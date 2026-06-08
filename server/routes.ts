import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertCategorySchema, insertProductSchema, insertOrderSchema, insertOrderItemSchema, insertSubscriptionSchema, insertReservationSchema, type InsertUser } from "@shared/schema";
import { buildElenaSystemPrompt, buildOwnerBriefing, generateElenaAdvice } from "./elena-brain";

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

  // ─── Diana API: Reservations ────────────────────────────────────────────────

  app.post(`${apiPath}/reservations`, async (req, res) => {
    try {
      const data = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(data);
      broadcastToAdmins({ type: "new_reservation", reservation });
      res.status(201).json(reservation);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
      res.status(500).json({ error: "Failed to create reservation" });
    }
  });

  app.get(`${apiPath}/reservations/today`, async (req, res) => {
    try {
      const list = await storage.getTodayReservations();
      res.json(list);
    } catch { res.status(500).json({ error: "Failed to fetch today's reservations" }); }
  });

  app.get(`${apiPath}/reservations/week`, async (req, res) => {
    try {
      const list = await storage.getWeekReservations();
      res.json(list);
    } catch { res.status(500).json({ error: "Failed to fetch week reservations" }); }
  });

  app.get(`${apiPath}/reservations`, async (req, res) => {
    try {
      const list = await storage.getAllReservations();
      res.json(list);
    } catch { res.status(500).json({ error: "Failed to fetch reservations" }); }
  });

  app.patch(`${apiPath}/reservations/:id/status`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const reservation = await storage.updateReservationStatus(id, status);
      broadcastToAdmins({ type: "reservation_updated", reservation });
      res.json(reservation);
    } catch { res.status(500).json({ error: "Failed to update reservation" }); }
  });

  // ─── Diana API: Tables ──────────────────────────────────────────────────────

  app.get(`${apiPath}/tables`, async (req, res) => {
    try {
      const tables = await storage.getAllTables();
      res.json(tables);
    } catch { res.status(500).json({ error: "Failed to fetch tables" }); }
  });

  app.patch(`${apiPath}/tables/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const table = await storage.updateTable(id, req.body);
      broadcastToAdmins({ type: "table_updated", table });
      res.json(table);
    } catch { res.status(500).json({ error: "Failed to update table" }); }
  });

  app.post(`${apiPath}/tables/merge`, async (req, res) => {
    try {
      const { ids } = req.body as { ids: number[] };
      if (!Array.isArray(ids) || ids.length < 2) {
        return res.status(400).json({ error: "At least 2 table ids required" });
      }
      const merged = await storage.mergeTables(ids);
      broadcastToAdmins({ type: "tables_merged", merged, ids });
      res.json(merged);
    } catch { res.status(500).json({ error: "Failed to merge tables" }); }
  });

  // ─── Diana API: Config ──────────────────────────────────────────────────────

  app.get(`${apiPath}/diana/config`, async (req, res) => {
    try {
      const config = await storage.getDianaConfig();
      res.json(config || {});
    } catch { res.status(500).json({ error: "Failed to fetch Diana config" }); }
  });

  app.put(`${apiPath}/diana/config`, async (req, res) => {
    try {
      const config = await storage.upsertDianaConfig(req.body);
      res.json(config);
    } catch { res.status(500).json({ error: "Failed to update Diana config" }); }
  });

  // ─── Elena Brain API ─────────────────────────────────────────────────────────

  // Returns the full LLM system prompt for the phone agent
  app.get(`${apiPath}/elena/brain`, async (req, res) => {
    try {
      const config = await storage.getDianaConfig();
      const reservations = await storage.getTodayReservations();
      const totalCovers = reservations
        .filter((r) => r.status !== "cancelled")
        .reduce((s, r) => s + r.partySize, 0);

      const prompt = buildElenaSystemPrompt({
        restaurantName: (config as { restaurantName?: string })?.restaurantName ?? "Eetcafé Full House",
        ownerName: (config as { ownerName?: string })?.ownerName ?? "de eigenaar",
        voicePersona: (config as { voicePersona?: "owner" | "collaborator" | "elena" })?.voicePersona ?? "elena",
        todayMenu: (config as { todayMenu?: string })?.todayMenu,
        tomorrowMenu: (config as { tomorrowMenu?: string })?.tomorrowMenu,
        openingHours: (config as { openingHours?: string })?.openingHours,
        reservationsToday: reservations.map((r) => ({
          time: r.time,
          guestName: r.guestName,
          partySize: r.partySize,
          status: r.status,
          notes: r.notes ?? undefined,
        })),
        totalCoversToday: totalCovers,
      });

      res.json({ prompt, generatedAt: new Date().toISOString() });
    } catch { res.status(500).json({ error: "Failed to generate Elena brain" }); }
  });

  // Returns the morning briefing for the owner
  app.get(`${apiPath}/elena/briefing`, async (req, res) => {
    try {
      const config = await storage.getDianaConfig();
      const reservations = await storage.getTodayReservations();
      const ownerName = (config as { ownerName?: string })?.ownerName ?? "de eigenaar";

      const now = new Date();
      const date = now.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
      const dayOfWeek = now.toLocaleDateString("nl-NL", { weekday: "long" });
      const currentHour = now.getHours();

      const summaries = reservations.map((r) => ({
        time: r.time,
        guestName: r.guestName,
        partySize: r.partySize,
        status: r.status,
        notes: r.notes ?? undefined,
      }));

      const tips = generateElenaAdvice(summaries, currentHour);
      const briefing = buildOwnerBriefing(ownerName, date, dayOfWeek, summaries, undefined, tips);

      const active = summaries.filter((r) => r.status !== "cancelled");
      const totalCovers = active.reduce((s, r) => s + r.partySize, 0);
      const pending = summaries.filter((r) => r.status === "pending").length;

      res.json({
        text: briefing,
        stats: {
          reservationsToday: active.length,
          totalCovers,
          pending,
          tips,
        },
        generatedAt: now.toISOString(),
      });
    } catch { res.status(500).json({ error: "Failed to generate briefing" }); }
  });

  // ─── Diana API: Logs / Memory ────────────────────────────────────────────────

  app.get(`${apiPath}/diana/logs`, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const logs = await storage.getDianaLogs(limit);
      res.json(logs);
    } catch { res.status(500).json({ error: "Failed to fetch Diana logs" }); }
  });

  app.post(`${apiPath}/diana/logs`, async (req, res) => {
    try {
      const log = await storage.addDianaLog(req.body);
      res.status(201).json(log);
    } catch { res.status(500).json({ error: "Failed to save Diana log" }); }
  });

  // ─── WebSocket Server ────────────────────────────────────────────────────────

  const httpServer = createServer(app);

  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const adminClients = new Set<WebSocket>();

  wss.on("connection", (ws) => {
    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "register" && msg.role === "admin") {
          adminClients.add(ws);
        }
      } catch {}
    });
    ws.on("close", () => adminClients.delete(ws));
    ws.on("error", () => adminClients.delete(ws));
  });

  function broadcastToAdmins(payload: Record<string, unknown>) {
    const msg = JSON.stringify(payload);
    adminClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(msg);
    });
  }

  return httpServer;
}
