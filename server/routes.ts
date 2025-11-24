import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertCategorySchema, insertProductSchema, insertOrderSchema, insertOrderItemSchema, insertSubscriptionSchema, insertIngredientSchema, insertProductIngredientSchema, type InsertUser } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Base API path
  const apiPath = "/api";

  // Products API
  app.get(`${apiPath}/categories`, async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get(`${apiPath}/products`, async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const products = categoryId 
        ? await storage.getProductsByCategory(categoryId)
        : await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get(`${apiPath}/products/:id`, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Orders API
  app.post(`${apiPath}/orders`, async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const orderItems = z.array(insertOrderItemSchema).parse(req.body.items);

      // Create the order
      const newOrder = await storage.createOrder(orderData, orderItems);

      // Update loyalty points if user is logged in
      if (orderData.userId) {
        await storage.updateLoyaltyPoints(orderData.userId, Math.floor(orderData.total / 100));
      }

      // Deduct ingredients from inventory for each order item
      for (const item of orderItems) {
        const productIngredients = await storage.getProductIngredients(item.productId);

        for (const pi of productIngredients) {
          if (pi.ingredient) {
            const totalQuantityNeeded = pi.quantityNeeded * item.quantity;
            await storage.updateIngredientQuantity(
              pi.ingredientId,
              -totalQuantityNeeded, // negative for consumption
              'order',
              newOrder.id,
              `Order #${newOrder.id} - ${item.quantity}x Product #${item.productId}`
            );
          }
        }
      }

      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get(`${apiPath}/orders/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Subscriptions API
  app.post(`${apiPath}/subscriptions`, async (req, res) => {
    try {
      const subscriptionData = insertSubscriptionSchema.parse(req.body);
      const newSubscription = await storage.createSubscription(subscriptionData);
      res.status(201).json(newSubscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  app.get(`${apiPath}/subscriptions/:userId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const subscription = await storage.getUserSubscription(userId);
      
      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }
      
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Users API
  app.post(`${apiPath}/users/login`, async (req, res) => {
    try {
      // Simple mock login for demonstration
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Don't return password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post(`${apiPath}/users/register`, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
      
      // Don't return password
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });
  
  // Firebase Auth API
  app.post(`${apiPath}/users/firebase-auth`, async (req, res) => {
    try {
      const { email, displayName, photoURL } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // Cerca l'utente via email
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Genera uno username unico basato sull'email
        const username = email.split('@')[0] + '_' + Math.floor(Math.random() * 1000);
        
        // Crea un nuovo utente se non esiste
        const userData = insertUserSchema.parse({
          username,
          email,
          displayName: displayName || email.split('@')[0],
          password: Math.random().toString(36).slice(-10), // Password casuale
        });
        
        user = await storage.createUser(userData);
      }
      
      // Non restituire la password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Firebase auth error:', error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.get(`${apiPath}/users/:id/loyalty`, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const loyaltyInfo = await storage.getUserLoyaltyInfo(userId);
      
      if (!loyaltyInfo) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(loyaltyInfo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch loyalty information" });
    }
  });

  // Dashboard API (Admin only - NOTE: Authentication should be added in production)
  // TODO: Add proper admin authentication middleware before deploying
  app.get(`${apiPath}/admin/stats`, async (req, res) => {
    try {
      // In production, check if user is admin here
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  app.get(`${apiPath}/admin/orders`, async (req, res) => {
    try {
      // In production, check if user is admin here
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.patch(`${apiPath}/admin/orders/:id/status`, async (req, res) => {
    try {
      // In production, check if user is admin here
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  app.get(`${apiPath}/admin/subscriptions`, async (req, res) => {
    try {
      // In production, check if user is admin here
      const subscriptions = await storage.getAllSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  // Inventory Management API (Admin only)
  // Get all ingredients
  app.get(`${apiPath}/admin/inventory`, async (req, res) => {
    try {
      const ingredients = await storage.getAllIngredients();
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ingredients" });
    }
  });

  // Get single ingredient
  app.get(`${apiPath}/admin/inventory/:id`, async (req, res) => {
    try {
      const ingredientId = parseInt(req.params.id);
      const ingredient = await storage.getIngredientById(ingredientId);

      if (!ingredient) {
        return res.status(404).json({ error: "Ingredient not found" });
      }

      res.json(ingredient);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ingredient" });
    }
  });

  // Create ingredient
  app.post(`${apiPath}/admin/inventory`, async (req, res) => {
    try {
      const ingredientData = insertIngredientSchema.parse(req.body);
      const newIngredient = await storage.createIngredient(ingredientData);
      res.status(201).json(newIngredient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create ingredient" });
    }
  });

  // Update ingredient
  app.patch(`${apiPath}/admin/inventory/:id`, async (req, res) => {
    try {
      const ingredientId = parseInt(req.params.id);
      const updatedIngredient = await storage.updateIngredient(ingredientId, req.body);

      if (!updatedIngredient) {
        return res.status(404).json({ error: "Ingredient not found" });
      }

      res.json(updatedIngredient);
    } catch (error) {
      res.status(500).json({ error: "Failed to update ingredient" });
    }
  });

  // Delete ingredient
  app.delete(`${apiPath}/admin/inventory/:id`, async (req, res) => {
    try {
      const ingredientId = parseInt(req.params.id);
      await storage.deleteIngredient(ingredientId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete ingredient" });
    }
  });

  // Get low stock ingredients
  app.get(`${apiPath}/admin/inventory/alerts/low-stock`, async (req, res) => {
    try {
      const lowStockItems = await storage.getLowStockIngredients();
      res.json(lowStockItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch low stock items" });
    }
  });

  // Update ingredient quantity (restock or adjustment)
  app.post(`${apiPath}/admin/inventory/:id/adjust`, async (req, res) => {
    try {
      const ingredientId = parseInt(req.params.id);
      const { quantityChange, reason, notes } = req.body;

      if (typeof quantityChange !== 'number') {
        return res.status(400).json({ error: "quantityChange must be a number" });
      }

      await storage.updateIngredientQuantity(
        ingredientId,
        quantityChange,
        reason || 'adjustment',
        undefined,
        notes
      );

      const updatedIngredient = await storage.getIngredientById(ingredientId);
      res.json(updatedIngredient);
    } catch (error) {
      res.status(500).json({ error: "Failed to adjust ingredient quantity" });
    }
  });

  // Get inventory history
  app.get(`${apiPath}/admin/inventory/history`, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const history = await storage.getInventoryHistory(limit);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory history" });
    }
  });

  // Get ingredient history
  app.get(`${apiPath}/admin/inventory/:id/history`, async (req, res) => {
    try {
      const ingredientId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const history = await storage.getIngredientHistory(ingredientId, limit);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ingredient history" });
    }
  });

  // Get inventory stats
  app.get(`${apiPath}/admin/inventory/stats`, async (req, res) => {
    try {
      const stats = await storage.getInventoryStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory stats" });
    }
  });

  // Product-Ingredient management
  // Get product ingredients (recipe)
  app.get(`${apiPath}/admin/products/:id/ingredients`, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const ingredients = await storage.getProductIngredients(productId);
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product ingredients" });
    }
  });

  // Set product ingredients (recipe)
  app.post(`${apiPath}/admin/products/:id/ingredients`, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { ingredients } = req.body;

      if (!Array.isArray(ingredients)) {
        return res.status(400).json({ error: "ingredients must be an array" });
      }

      await storage.setProductIngredients(productId, ingredients);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to set product ingredients" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
