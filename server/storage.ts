import { users, orders, orderItems, subscriptions, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, count, sum } from "drizzle-orm";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
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
  
  async getDashboardStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    activeSubscriptions: number;
  }> {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      activeSubscriptions: 0
    };
  }
}

// Utilizza DatabaseStorage invece di MemStorage per persistenza dati
export const storage = new DatabaseStorage();
