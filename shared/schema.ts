import { pgTable, text, serial, integer, boolean, timestamp, json, real } from "drizzle-orm/pg-core";
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

// Diana — Eetcafé Full House reservations
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  guestName: text("guest_name").notNull(),
  guestPhone: text("guest_phone").notNull(),
  guestEmail: text("guest_email"),
  date: text("date").notNull(),       // "2026-04-13"
  time: text("time").notNull(),       // "19:00"
  partySize: integer("party_size").notNull(),
  tableId: integer("table_id"),
  status: text("status").notNull().default("pending"), // pending | confirmed | cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Diana — Restaurant floor map tables
export const restaurantTables = pgTable("restaurant_tables", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),     // "T1", "VIP", "T-Terrazza"
  x: real("x").notNull().default(50), // % position on map
  y: real("y").notNull().default(50),
  width: real("width").notNull().default(80),   // px
  height: real("height").notNull().default(80),
  capacity: integer("capacity").notNull().default(4),
  status: text("status").notNull().default("free"), // free | occupied | reserved
  mergedWith: json("merged_with").$type<number[]>().default([]),
});

// Diana — Conversation memory (ogni chiamata/chat salvata)
export const dianaLogs = pgTable("diana_logs", {
  id: serial("id").primaryKey(),
  channel: text("channel").notNull().default("phone"), // phone | whatsapp | dashboard
  role: text("role").notNull(),   // "guest" | "owner" | "diana"
  message: text("message").notNull(),
  intent: text("intent"),         // "reservation" | "menu_query" | "owner_mode" | "other"
  metadata: json("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Diana — AI configuration for the restaurant
export const dianaConfig = pgTable("diana_config", {
  id: serial("id").primaryKey(),
  restaurantName: text("restaurant_name").notNull().default("Eetcafé Full House"),
  address: text("address").notNull().default("De Veste 1692, 8231 JK Lelystad"),
  phone: text("phone").notNull().default("+31 320 282 428"),
  openTime: text("open_time").notNull().default("17:00"),
  closeTime: text("close_time").notNull().default("22:00"),
  ownerPassphrase: text("owner_passphrase").notNull().default("sono il proprietario"),
  elevenLabsVoiceId: text("eleven_labs_voice_id"),
  menuJson: json("menu_json").$type<Record<string, unknown>>().default({}),
  totalTables: integer("total_tables").notNull().default(10),
  staffCount: integer("staff_count").notNull().default(3),
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

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
});

export const insertRestaurantTableSchema = createInsertSchema(restaurantTables).omit({
  id: true,
});

export const insertDianaConfigSchema = createInsertSchema(dianaConfig).omit({
  id: true,
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

export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservations.$inferSelect;

export type InsertRestaurantTable = z.infer<typeof insertRestaurantTableSchema>;
export type RestaurantTable = typeof restaurantTables.$inferSelect;

export type InsertDianaConfig = z.infer<typeof insertDianaConfigSchema>;
export type DianaConfig = typeof dianaConfig.$inferSelect;

export const insertDianaLogSchema = createInsertSchema(dianaLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertDianaLog = z.infer<typeof insertDianaLogSchema>;
export type DianaLog = typeof dianaLogs.$inferSelect;
