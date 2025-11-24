import { users, orders, orderItems, subscriptions, ingredients, productIngredients, inventoryHistory, type User, type InsertUser, type Ingredient, type InsertIngredient, type ProductIngredient, type InsertProductIngredient, type InventoryHistory } from "@shared/schema";
import { db } from "./db";
import { eq, count, sum, lt, desc, sql } from "drizzle-orm";

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

  // Inventory methods
  getAllIngredients(): Promise<Ingredient[]>;
  getIngredientById(ingredientId: number): Promise<Ingredient | undefined>;
  createIngredient(ingredientData: InsertIngredient): Promise<Ingredient>;
  updateIngredient(ingredientId: number, data: Partial<InsertIngredient>): Promise<Ingredient | undefined>;
  deleteIngredient(ingredientId: number): Promise<void>;
  getLowStockIngredients(): Promise<Ingredient[]>;
  updateIngredientQuantity(ingredientId: number, quantityChange: number, reason: string, orderId?: number, notes?: string): Promise<void>;

  // Product-Ingredient relationship
  getProductIngredients(productId: number): Promise<(ProductIngredient & { ingredient: Ingredient })[]>;
  setProductIngredients(productId: number, ingredientIds: { ingredientId: number, quantityNeeded: number }[]): Promise<void>;

  // Inventory history
  getInventoryHistory(limit?: number): Promise<(InventoryHistory & { ingredient: Ingredient })[]>;
  getIngredientHistory(ingredientId: number, limit?: number): Promise<InventoryHistory[]>;

  // Inventory stats
  getInventoryStats(): Promise<{
    totalIngredients: number;
    lowStockItems: number;
    totalValue: number;
    recentConsumption: any[];
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

  // Inventory methods implementation
  async getAllIngredients(): Promise<Ingredient[]> {
    return await db.select().from(ingredients);
  }

  async getIngredientById(ingredientId: number): Promise<Ingredient | undefined> {
    const [ingredient] = await db.select().from(ingredients).where(eq(ingredients.id, ingredientId));
    return ingredient || undefined;
  }

  async createIngredient(ingredientData: InsertIngredient): Promise<Ingredient> {
    const [ingredient] = await db.insert(ingredients).values(ingredientData).returning();
    return ingredient;
  }

  async updateIngredient(ingredientId: number, data: Partial<InsertIngredient>): Promise<Ingredient | undefined> {
    const [ingredient] = await db.update(ingredients)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(ingredients.id, ingredientId))
      .returning();
    return ingredient || undefined;
  }

  async deleteIngredient(ingredientId: number): Promise<void> {
    await db.delete(ingredients).where(eq(ingredients.id, ingredientId));
  }

  async getLowStockIngredients(): Promise<Ingredient[]> {
    return await db.select().from(ingredients)
      .where(sql`${ingredients.currentQuantity} <= ${ingredients.minQuantity}`);
  }

  async updateIngredientQuantity(
    ingredientId: number,
    quantityChange: number,
    reason: string,
    orderId?: number,
    notes?: string
  ): Promise<void> {
    const [ingredient] = await db.select().from(ingredients).where(eq(ingredients.id, ingredientId));
    if (!ingredient) return;

    const previousQuantity = ingredient.currentQuantity;
    const newQuantity = previousQuantity + quantityChange;

    await db.update(ingredients)
      .set({
        currentQuantity: newQuantity,
        updatedAt: new Date(),
        lastRestockedAt: quantityChange > 0 ? new Date() : ingredient.lastRestockedAt
      })
      .where(eq(ingredients.id, ingredientId));

    await db.insert(inventoryHistory).values({
      ingredientId,
      quantityChange,
      previousQuantity,
      newQuantity,
      reason,
      orderId: orderId || null,
      notes: notes || null,
      createdBy: 'system'
    });
  }

  async getProductIngredients(productId: number): Promise<(ProductIngredient & { ingredient: Ingredient })[]> {
    const results = await db.select({
      id: productIngredients.id,
      productId: productIngredients.productId,
      ingredientId: productIngredients.ingredientId,
      quantityNeeded: productIngredients.quantityNeeded,
      ingredient: ingredients
    })
    .from(productIngredients)
    .leftJoin(ingredients, eq(productIngredients.ingredientId, ingredients.id))
    .where(eq(productIngredients.productId, productId));

    return results as any;
  }

  async setProductIngredients(productId: number, ingredientIds: { ingredientId: number, quantityNeeded: number }[]): Promise<void> {
    await db.delete(productIngredients).where(eq(productIngredients.productId, productId));

    if (ingredientIds.length > 0) {
      await db.insert(productIngredients).values(
        ingredientIds.map(item => ({
          productId,
          ingredientId: item.ingredientId,
          quantityNeeded: item.quantityNeeded
        }))
      );
    }
  }

  async getInventoryHistory(limit: number = 50): Promise<(InventoryHistory & { ingredient: Ingredient })[]> {
    const results = await db.select({
      id: inventoryHistory.id,
      ingredientId: inventoryHistory.ingredientId,
      quantityChange: inventoryHistory.quantityChange,
      previousQuantity: inventoryHistory.previousQuantity,
      newQuantity: inventoryHistory.newQuantity,
      reason: inventoryHistory.reason,
      orderId: inventoryHistory.orderId,
      notes: inventoryHistory.notes,
      createdBy: inventoryHistory.createdBy,
      createdAt: inventoryHistory.createdAt,
      ingredient: ingredients
    })
    .from(inventoryHistory)
    .leftJoin(ingredients, eq(inventoryHistory.ingredientId, ingredients.id))
    .orderBy(desc(inventoryHistory.createdAt))
    .limit(limit);

    return results as any;
  }

  async getIngredientHistory(ingredientId: number, limit: number = 50): Promise<InventoryHistory[]> {
    return await db.select()
      .from(inventoryHistory)
      .where(eq(inventoryHistory.ingredientId, ingredientId))
      .orderBy(desc(inventoryHistory.createdAt))
      .limit(limit);
  }

  async getInventoryStats(): Promise<{
    totalIngredients: number;
    lowStockItems: number;
    totalValue: number;
    recentConsumption: any[];
  }> {
    const [totalCount] = await db.select({ count: count() }).from(ingredients);
    const lowStock = await this.getLowStockIngredients();

    const allIngredients = await db.select().from(ingredients);
    const totalValue = allIngredients.reduce((sum, ing) =>
      sum + (ing.currentQuantity * ing.costPerUnit), 0
    );

    const recent = await db.select({
      ingredientId: inventoryHistory.ingredientId,
      totalConsumed: sum(sql`CASE WHEN ${inventoryHistory.quantityChange} < 0 THEN ABS(${inventoryHistory.quantityChange}) ELSE 0 END`)
    })
    .from(inventoryHistory)
    .where(sql`${inventoryHistory.reason} = 'order' AND ${inventoryHistory.createdAt} >= NOW() - INTERVAL '7 days'`)
    .groupBy(inventoryHistory.ingredientId)
    .orderBy(desc(sql`sum(CASE WHEN ${inventoryHistory.quantityChange} < 0 THEN ABS(${inventoryHistory.quantityChange}) ELSE 0 END)`))
    .limit(10);

    return {
      totalIngredients: totalCount?.count || 0,
      lowStockItems: lowStock.length,
      totalValue,
      recentConsumption: recent
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

  async getAllIngredients(): Promise<Ingredient[]> {
    return [];
  }

  async getIngredientById(ingredientId: number): Promise<Ingredient | undefined> {
    return undefined;
  }

  async createIngredient(ingredientData: InsertIngredient): Promise<Ingredient> {
    return {} as Ingredient;
  }

  async updateIngredient(ingredientId: number, data: Partial<InsertIngredient>): Promise<Ingredient | undefined> {
    return undefined;
  }

  async deleteIngredient(ingredientId: number): Promise<void> {
  }

  async getLowStockIngredients(): Promise<Ingredient[]> {
    return [];
  }

  async updateIngredientQuantity(ingredientId: number, quantityChange: number, reason: string, orderId?: number, notes?: string): Promise<void> {
  }

  async getProductIngredients(productId: number): Promise<(ProductIngredient & { ingredient: Ingredient })[]> {
    return [];
  }

  async setProductIngredients(productId: number, ingredientIds: { ingredientId: number, quantityNeeded: number }[]): Promise<void> {
  }

  async getInventoryHistory(limit?: number): Promise<(InventoryHistory & { ingredient: Ingredient })[]> {
    return [];
  }

  async getIngredientHistory(ingredientId: number, limit?: number): Promise<InventoryHistory[]> {
    return [];
  }

  async getInventoryStats(): Promise<{
    totalIngredients: number;
    lowStockItems: number;
    totalValue: number;
    recentConsumption: any[];
  }> {
    return {
      totalIngredients: 0,
      lowStockItems: 0,
      totalValue: 0,
      recentConsumption: []
    };
  }
}

// Utilizza DatabaseStorage invece di MemStorage per persistenza dati
export const storage = new DatabaseStorage();
