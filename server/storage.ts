import { users, orders, orderItems, subscriptions, reservations, restaurantTables, dianaConfig, dianaLogs, type User, type InsertUser, type Reservation, type InsertReservation, type RestaurantTable, type InsertRestaurantTable, type DianaConfig, type DianaLog } from "@shared/schema";
import { db } from "./db";
import { eq, count, sum, gte, lte, and } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserLoyaltyInfo(userId: number): Promise<{points: number, level: string} | undefined>;
  updateLoyaltyPoints(userId: number, points: number): Promise<void>;
  
  // Category methods
  getAllCategories(): Promise<any[]>;
  
  // Product methods
  getAllProducts(): Promise<any[]>;
  getProductsByCategory(categoryId: number): Promise<any[]>;
  getProductById(productId: number): Promise<any | undefined>;
  
  // Order methods
  createOrder(orderData: any, orderItems: any[]): Promise<any>;
  getUserOrders(userId: number): Promise<any[]>;
  getAllOrders(): Promise<any[]>;
  updateOrderStatus(orderId: number, status: string): Promise<any>;
  
  // Subscription methods
  createSubscription(subscriptionData: any): Promise<any>;
  getUserSubscription(userId: number): Promise<any | undefined>;
  getAllSubscriptions(): Promise<any[]>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    activeSubscriptions: number;
  }>;

  // Diana — Reservations
  createReservation(data: InsertReservation): Promise<Reservation>;
  getTodayReservations(): Promise<Reservation[]>;
  getWeekReservations(): Promise<Reservation[]>;
  getAllReservations(): Promise<Reservation[]>;
  updateReservationStatus(id: number, status: string): Promise<Reservation>;

  // Diana — Tables
  getAllTables(): Promise<RestaurantTable[]>;
  updateTable(id: number, data: Partial<InsertRestaurantTable>): Promise<RestaurantTable>;
  mergeTables(ids: number[]): Promise<RestaurantTable>;
  unmergeTables(primaryId: number): Promise<RestaurantTable>;

  // Diana — Config
  getDianaConfig(): Promise<DianaConfig | undefined>;
  upsertDianaConfig(data: Partial<DianaConfig>): Promise<DianaConfig>;

  // Diana — Logs
  addDianaLog(data: { channel: string; role: string; message: string; intent?: string; metadata?: Record<string, unknown> }): Promise<DianaLog>;
  getDianaLogs(limit?: number): Promise<DianaLog[]>;
}

export class DatabaseStorage implements IStorage {
  // Implementazione metodi utente
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUserLoyaltyInfo(userId: number): Promise<{points: number, level: string} | undefined> {
    const [user] = await db.select({
      points: users.loyaltyPoints,
      level: users.loyaltyLevel
    }).from(users).where(eq(users.id, userId));
    
    if (!user) return undefined;
    
    return {
      points: user.points || 0,
      level: user.level || 'bronze'
    };
  }

  async updateLoyaltyPoints(userId: number, points: number): Promise<void> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) return;
    
    const currentPoints = user.loyaltyPoints || 0;
    const newPoints = currentPoints + points;
    
    // Determina il nuovo livello
    let newLevel = user.loyaltyLevel || 'bronze';
    if (newPoints >= 500) {
      newLevel = 'gold';
    } else if (newPoints >= 250) {
      newLevel = 'silver';
    }
    
    await db.update(users)
      .set({
        loyaltyPoints: newPoints,
        loyaltyLevel: newLevel
      })
      .where(eq(users.id, userId));
  }
  
  // Implementazione stub per gli altri metodi
  async getAllCategories(): Promise<any[]> {
    return [];
  }
  
  async getAllProducts(): Promise<any[]> {
    return [];
  }
  
  async getProductsByCategory(categoryId: number): Promise<any[]> {
    return [];
  }
  
  async getProductById(productId: number): Promise<any | undefined> {
    return undefined;
  }
  
  async createOrder(orderData: any, items: any[]): Promise<any> {
    const [order] = await db.insert(orders).values(orderData).returning();
    
    const itemsWithOrderId = items.map(item => ({
      ...item,
      orderId: order.id
    }));
    
    await db.insert(orderItems).values(itemsWithOrderId);
    
    return order;
  }
  
  async getUserOrders(userId: number): Promise<any[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }
  
  async getAllOrders(): Promise<any[]> {
    return await db.select().from(orders);
  }
  
  async updateOrderStatus(orderId: number, status: string): Promise<any> {
    const [order] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))
      .returning();
    return order;
  }
  
  async createSubscription(subscriptionData: any): Promise<any> {
    const [subscription] = await db.insert(subscriptions).values(subscriptionData).returning();
    return subscription;
  }
  
  async getUserSubscription(userId: number): Promise<any | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return subscription || undefined;
  }
  
  async getAllSubscriptions(): Promise<any[]> {
    return await db.select().from(subscriptions).where(eq(subscriptions.isActive, true));
  }
  
  async getDashboardStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    activeSubscriptions: number;
  }> {
    const [orderCount] = await db.select({ count: count() }).from(orders);
    const [revenueResult] = await db.select({ total: sum(orders.total) }).from(orders);
    const [pendingCount] = await db.select({ count: count() }).from(orders).where(eq(orders.status, 'pending'));
    const [subsCount] = await db.select({ count: count() }).from(subscriptions).where(eq(subscriptions.isActive, true));

    return {
      totalOrders: orderCount?.count || 0,
      totalRevenue: Number(revenueResult?.total || 0),
      pendingOrders: pendingCount?.count || 0,
      activeSubscriptions: subsCount?.count || 0
    };
  }

  // Diana — Reservations
  async createReservation(data: InsertReservation): Promise<Reservation> {
    const [reservation] = await db.insert(reservations).values(data).returning();
    return reservation;
  }

  async getTodayReservations(): Promise<Reservation[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db.select().from(reservations).where(eq(reservations.date, today));
  }

  async getWeekReservations(): Promise<Reservation[]> {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const start = weekStart.toISOString().split('T')[0];
    const end = weekEnd.toISOString().split('T')[0];
    return await db.select().from(reservations).where(
      and(gte(reservations.date, start), lte(reservations.date, end))
    );
  }

  async getAllReservations(): Promise<Reservation[]> {
    return await db.select().from(reservations);
  }

  async updateReservationStatus(id: number, status: string): Promise<Reservation> {
    const [reservation] = await db.update(reservations)
      .set({ status })
      .where(eq(reservations.id, id))
      .returning();
    return reservation;
  }

  // Diana — Tables
  async getAllTables(): Promise<RestaurantTable[]> {
    return await db.select().from(restaurantTables);
  }

  async updateTable(id: number, data: Partial<InsertRestaurantTable>): Promise<RestaurantTable> {
    const [table] = await db.update(restaurantTables)
      .set(data as any)
      .where(eq(restaurantTables.id, id))
      .returning();
    return table;
  }

  async mergeTables(ids: number[]): Promise<RestaurantTable> {
    const all = await db.select().from(restaurantTables);
    const primary = all.find((t) => t.id === ids[0]);
    if (!primary) throw new Error(`Table ${ids[0]} not found`);
    const secondaries = ids.slice(1)
      .map((sid) => all.find((t) => t.id === sid))
      .filter((t): t is RestaurantTable => !!t);
    if (secondaries.length === 0) throw new Error("No valid secondary tables");

    // Sum the real capacities of the merged tables
    const extraCapacity = secondaries.reduce((sum, s) => sum + (s.capacity ?? 2), 0);

    const [merged] = await db.update(restaurantTables)
      .set({
        width: (primary.width || 80) + secondaries.length * 90,
        capacity: (primary.capacity || 4) + extraCapacity,
        mergedWith: secondaries.map((s) => s.id),
      })
      .where(eq(restaurantTables.id, ids[0]))
      .returning();

    for (const s of secondaries) {
      await db.update(restaurantTables)
        .set({ status: 'occupied' })
        .where(eq(restaurantTables.id, s.id));
    }

    return merged;
  }

  async unmergeTables(primaryId: number): Promise<RestaurantTable> {
    const all = await db.select().from(restaurantTables);
    const primary = all.find((t) => t.id === primaryId);
    if (!primary) throw new Error(`Table ${primaryId} not found`);
    const mergedIds = (primary.mergedWith ?? []) as number[];
    if (mergedIds.length === 0) throw new Error("Table is not merged");

    const secondaries = mergedIds
      .map((id) => all.find((t) => t.id === id))
      .filter((t): t is RestaurantTable => !!t);
    const extraCapacity = secondaries.reduce((sum, s) => sum + (s.capacity ?? 2), 0);

    const [restored] = await db.update(restaurantTables)
      .set({
        width: Math.max(70, (primary.width || 80) - mergedIds.length * 90),
        capacity: Math.max(2, (primary.capacity || 4) - extraCapacity),
        mergedWith: [],
      })
      .where(eq(restaurantTables.id, primaryId))
      .returning();

    for (const s of secondaries) {
      await db.update(restaurantTables)
        .set({ status: 'free' })
        .where(eq(restaurantTables.id, s.id));
    }

    return restored;
  }

  // Diana — Config
  async getDianaConfig(): Promise<DianaConfig | undefined> {
    const [config] = await db.select().from(dianaConfig);
    return config || undefined;
  }

  async upsertDianaConfig(data: Partial<DianaConfig>): Promise<DianaConfig> {
    const existing = await this.getDianaConfig();
    if (existing) {
      const [updated] = await db.update(dianaConfig)
        .set(data)
        .where(eq(dianaConfig.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(dianaConfig).values(data as any).returning();
    return created;
  }

  // Diana — Logs
  async addDianaLog(data: { channel: string; role: string; message: string; intent?: string; metadata?: Record<string, unknown> }): Promise<DianaLog> {
    const [log] = await db.insert(dianaLogs).values({
      channel: data.channel,
      role: data.role,
      message: data.message,
      intent: data.intent,
      metadata: data.metadata || {},
    }).returning();
    return log;
  }

  async getDianaLogs(limit = 100): Promise<DianaLog[]> {
    return await db.select().from(dianaLogs).limit(limit);
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.seedTables();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = {
      ...insertUser,
      id,
      avatar: null,
      loyaltyPoints: 0,
      loyaltyLevel: 'bronze',
      isAdmin: false
    } as User;
    this.users.set(id, user);
    return user;
  }
  
  async getUserLoyaltyInfo(userId: number): Promise<{points: number, level: string} | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    return {
      points: user.loyaltyPoints || 0,
      level: user.loyaltyLevel || 'bronze'
    };
  }
  
  async updateLoyaltyPoints(userId: number, points: number): Promise<void> {
    const user = this.users.get(userId);
    if (!user) return;
    
    const currentPoints = user.loyaltyPoints || 0;
    const newPoints = currentPoints + points;
    
    // Determina il nuovo livello
    let newLevel = user.loyaltyLevel || 'bronze';
    if (newPoints >= 500) {
      newLevel = 'gold';
    } else if (newPoints >= 250) {
      newLevel = 'silver';
    }
    
    user.loyaltyPoints = newPoints;
    user.loyaltyLevel = newLevel;
  }
  
  // Implementazione stub per gli altri metodi
  async getAllCategories(): Promise<any[]> {
    return [];
  }
  
  async getAllProducts(): Promise<any[]> {
    return [];
  }
  
  async getProductsByCategory(categoryId: number): Promise<any[]> {
    return [];
  }
  
  async getProductById(productId: number): Promise<any | undefined> {
    return undefined;
  }
  
  async createOrder(orderData: any, orderItems: any[]): Promise<any> {
    return {};
  }
  
  async getUserOrders(userId: number): Promise<any[]> {
    return [];
  }
  
  async getAllOrders(): Promise<any[]> {
    return [];
  }
  
  async updateOrderStatus(orderId: number, status: string): Promise<any> {
    return {};
  }
  
  async createSubscription(subscriptionData: any): Promise<any> {
    return {};
  }
  
  async getUserSubscription(userId: number): Promise<any | undefined> {
    return undefined;
  }
  
  async getAllSubscriptions(): Promise<any[]> {
    return [];
  }
  
  async getDashboardStats() {
    return { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, activeSubscriptions: 0 };
  }
  private reservations: Map<number, Reservation> = new Map();
  private tables: Map<number, RestaurantTable> = new Map();
  private mergeSnapshots: Map<number, { width: number; capacity: number; secondaries: { id: number; status: string }[] }> = new Map();
  private dianaConfigData: DianaConfig | undefined = undefined;
  private dianaLogsData: DianaLog[] = [];
  private nextResId = 1;
  private nextTableId = 1;

  private seedTables() {
    // Seed the Full House floor plan so the map works without a database
    const seed: Omit<RestaurantTable, "id">[] = [
      { label: "T1", x: 15, y: 25, width: 80, height: 80, capacity: 4, status: "free", mergedWith: [] },
      { label: "T2", x: 40, y: 25, width: 80, height: 80, capacity: 4, status: "free", mergedWith: [] },
      { label: "T3", x: 65, y: 25, width: 80, height: 80, capacity: 4, status: "free", mergedWith: [] },
      { label: "VIP", x: 28, y: 55, width: 120, height: 80, capacity: 8, status: "free", mergedWith: [] },
      { label: "T5", x: 70, y: 55, width: 80, height: 80, capacity: 4, status: "free", mergedWith: [] },
      { label: "T6", x: 80, y: 78, width: 70, height: 70, capacity: 2, status: "free", mergedWith: [] },
      { label: "T7", x: 15, y: 78, width: 80, height: 80, capacity: 4, status: "free", mergedWith: [] },
    ];
    for (const t of seed) {
      const id = this.nextTableId++;
      this.tables.set(id, { ...t, id } as RestaurantTable);
    }
  }

  async createReservation(data: InsertReservation): Promise<Reservation> {
    const r = { ...data, id: this.nextResId++, status: data.status ?? "pending", notes: data.notes ?? null } as Reservation;
    this.reservations.set(r.id, r);
    return r;
  }
  async getTodayReservations(): Promise<Reservation[]> {
    const today = new Date().toISOString().split("T")[0];
    return Array.from(this.reservations.values()).filter((r) => r.date === today);
  }
  async getWeekReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }
  async getAllReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }
  async updateReservationStatus(id: number, status: string): Promise<Reservation> {
    const r = this.reservations.get(id);
    if (!r) throw new Error("Not found");
    const updated = { ...r, status };
    this.reservations.set(id, updated);
    return updated;
  }
  async getAllTables(): Promise<RestaurantTable[]> {
    return Array.from(this.tables.values());
  }
  async updateTable(id: number, data: Partial<InsertRestaurantTable>): Promise<RestaurantTable> {
    const t = this.tables.get(id);
    if (!t) throw new Error(`Table ${id} not found`);
    const updated = { ...t, ...data } as RestaurantTable;
    this.tables.set(id, updated);
    return updated;
  }
  async mergeTables(ids: number[]): Promise<RestaurantTable> {
    const primary = this.tables.get(ids[0]);
    if (!primary) throw new Error(`Table ${ids[0]} not found`);
    const secondaries = ids.slice(1)
      .map((sid) => this.tables.get(sid))
      .filter((t): t is RestaurantTable => !!t);
    if (secondaries.length === 0) throw new Error("No valid secondary tables");

    // Snapshot for unmerge
    this.mergeSnapshots.set(primary.id, {
      width: primary.width,
      capacity: primary.capacity,
      secondaries: secondaries.map((s) => ({ id: s.id, status: s.status })),
    });

    const extraCapacity = secondaries.reduce((sum, s) => sum + (s.capacity ?? 2), 0);
    const merged = {
      ...primary,
      width: primary.width + secondaries.length * 90,
      capacity: primary.capacity + extraCapacity,
      mergedWith: secondaries.map((s) => s.id),
    } as RestaurantTable;
    this.tables.set(primary.id, merged);

    for (const s of secondaries) {
      this.tables.set(s.id, { ...s, status: "occupied" } as RestaurantTable);
    }
    return merged;
  }
  async unmergeTables(primaryId: number): Promise<RestaurantTable> {
    const primary = this.tables.get(primaryId);
    if (!primary) throw new Error(`Table ${primaryId} not found`);
    const snap = this.mergeSnapshots.get(primaryId);
    const mergedIds = (primary.mergedWith ?? []) as number[];
    if (!snap && mergedIds.length === 0) throw new Error("Table is not merged");

    const restored = {
      ...primary,
      width: snap?.width ?? Math.max(70, primary.width - mergedIds.length * 90),
      capacity: snap?.capacity ?? Math.max(2, primary.capacity - mergedIds.length * 2),
      mergedWith: [],
    } as RestaurantTable;
    this.tables.set(primaryId, restored);

    const secondaryStates = snap?.secondaries ?? mergedIds.map((id) => ({ id, status: "free" }));
    for (const { id, status } of secondaryStates) {
      const s = this.tables.get(id);
      if (s) this.tables.set(id, { ...s, status } as RestaurantTable);
    }
    this.mergeSnapshots.delete(primaryId);
    return restored;
  }
  async getDianaConfig(): Promise<DianaConfig | undefined> { return this.dianaConfigData; }
  async upsertDianaConfig(data: Partial<DianaConfig>): Promise<DianaConfig> {
    this.dianaConfigData = { ...(this.dianaConfigData ?? {}), ...data } as DianaConfig;
    return this.dianaConfigData;
  }
  async addDianaLog(data: any): Promise<DianaLog> {
    const log = { ...data, id: this.dianaLogsData.length + 1, createdAt: new Date() } as DianaLog;
    this.dianaLogsData.push(log);
    return log;
  }
  async getDianaLogs(limit = 100): Promise<DianaLog[]> {
    return this.dianaLogsData.slice(-limit);
  }
}

// Use MemStorage when no real DATABASE_URL is configured (local dev / CI)
const hasRealDb = process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.startsWith("postgresql://fake");
export const storage = hasRealDb ? new DatabaseStorage() : new MemStorage();
