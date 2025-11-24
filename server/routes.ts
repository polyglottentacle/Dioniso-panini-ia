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
      // ⚠️ SECURITY WARNING: Questo è un sistema di login di dimostrazione
      // ⚠️ CRITICAL: Le password sono confrontate in chiaro (plain text)!
      // ⚠️ TODO: Implementare hashing delle password con bcrypt o argon2 prima del deployment
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);

      // ⚠️ IMPORTANTE: Usare bcrypt.compare(password, user.password) in produzione
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
        // Genera uno username unico basato sull'email e un timestamp
        // per evitare collisioni tra utenti con email simili
        const baseUsername = email.split('@')[0];
        const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
        const username = `${baseUsername}_${uniqueSuffix}`;

        // Crea un nuovo utente se non esiste
        // Gli utenti Firebase non necessitano di password nel database locale
        const userData = insertUserSchema.parse({
          username,
          email,
          displayName: displayName || baseUsername,
          password: 'firebase_auth', // Segnaposto per utenti autenticati via Firebase
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

  // ⚠️ SECURITY WARNING: Dashboard API (Admin only)
  // ⚠️ CRITICAL: Questi endpoint NON hanno autenticazione!
  // ⚠️ TODO: Implementare middleware di autenticazione admin PRIMA del deployment in produzione
  // Esempio: app.get(`${apiPath}/admin/stats`, verifyAdmin, async (req, res) => { ... })
  app.get(`${apiPath}/admin/stats`, async (req, res) => {
    try {
      // ⚠️ IMPORTANTE: Verificare che l'utente sia admin prima di procedere
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  app.get(`${apiPath}/admin/orders`, async (req, res) => {
    try {
      // ⚠️ IMPORTANTE: Verificare che l'utente sia admin prima di procedere
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.patch(`${apiPath}/admin/orders/:id/status`, async (req, res) => {
    try {
      // ⚠️ IMPORTANTE: Verificare che l'utente sia admin prima di procedere
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
      // ⚠️ IMPORTANTE: Verificare che l'utente sia admin prima di procedere
      const subscriptions = await storage.getAllSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
