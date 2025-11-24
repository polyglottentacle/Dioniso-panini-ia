import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  avatar: text("avatar"),
  loyaltyPoints: integer("loyalty_points").default(0),
  loyaltyLevel: text("loyalty_level").default("bronze"),
  isAdmin: boolean("is_admin").default(false),
});

// Product categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameIt: text("name_it").notNull(),
  nameEn: text("name_en").notNull(),
  nameEs: text("name_es").notNull(),
  slug: text("slug").notNull().unique(),
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  nameIt: text("name_it").notNull(),
  nameEn: text("name_en").notNull(),
  nameEs: text("name_es").notNull(),
  descriptionIt: text("description_it").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionEs: text("description_es").notNull(),
  price: integer("price").notNull(), // price in cents
  imageUrl: text("image_url").notNull(),
  isPopular: boolean("is_popular").default(false),
  isVegetarian: boolean("is_vegetarian").default(false),
  isCustomizable: boolean("is_customizable").default(false),
});

// Ingredients (base inventory items)
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  nameIt: text("name_it").notNull(),
  nameEn: text("name_en").notNull(),
  nameEs: text("name_es").notNull(),
  unit: text("unit").notNull(), // "kg", "pz" (pezzi), "l" (litri)
  currentQuantity: integer("current_quantity").notNull().default(0),
  minQuantity: integer("min_quantity").notNull().default(0), // soglia di allarme
  maxQuantity: integer("max_quantity").notNull().default(100),
  costPerUnit: integer("cost_per_unit").notNull().default(0), // in cents
  category: text("category"), // "carni", "verdure", "pane", "condimenti", "bevande"
  lastRestockedAt: timestamp("last_restocked_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Product-Ingredient relationship (recipes)
export const productIngredients = pgTable("product_ingredients", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  ingredientId: integer("ingredient_id").notNull(),
  quantityNeeded: integer("quantity_needed").notNull(), // quantity per product unit
});

// Inventory history/logs (audit trail)
export const inventoryHistory = pgTable("inventory_history", {
  id: serial("id").primaryKey(),
  ingredientId: integer("ingredient_id").notNull(),
  quantityChange: integer("quantity_change").notNull(), // positive for restock, negative for consumption
  previousQuantity: integer("previous_quantity").notNull(),
  newQuantity: integer("new_quantity").notNull(),
  reason: text("reason").notNull(), // "order", "restock", "adjustment", "waste"
  orderId: integer("order_id"), // reference if related to an order
  notes: text("notes"),
  createdBy: text("created_by"), // "system" or user ID
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  status: text("status").notNull().default("pending"),
  total: integer("total").notNull(), // total in cents
  deliveryFloor: text("delivery_floor").notNull(),
  deliveryTime: text("delivery_time").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Order items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(), // price in cents at time of order
  customizations: json("customizations"),
});

// Subscription plans
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  menuPreference: text("menu_preference").notNull().default("standard"),
  preferredDays: json("preferred_days").notNull(),
  preferredTime: text("preferred_time").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
});

export const insertCategorySchema = createInsertSchema(categories);
export const insertProductSchema = createInsertSchema(products);
export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});
export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});
export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertProductIngredientSchema = createInsertSchema(productIngredients).omit({
  id: true,
});
export const insertInventoryHistorySchema = createInsertSchema(inventoryHistory).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Ingredient = typeof ingredients.$inferSelect;

export type InsertProductIngredient = z.infer<typeof insertProductIngredientSchema>;
export type ProductIngredient = typeof productIngredients.$inferSelect;

export type InsertInventoryHistory = z.infer<typeof insertInventoryHistorySchema>;
export type InventoryHistory = typeof inventoryHistory.$inferSelect;
