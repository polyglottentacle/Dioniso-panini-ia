import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertCategorySchema, insertProductSchema, insertOrderSchema, insertOrderItemSchema, insertSubscriptionSchema, type InsertUser } from "@shared/schema";

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
      
      const newOrder = await storage.createOrder(orderData, orderItems);
      
      // Update loyalty points if user is logged in
      if (orderData.userId) {
        await storage.updateLoyaltyPoints(orderData.userId, Math.floor(orderData.total / 100));
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

  const httpServer = createServer(app);
  return httpServer;
}
