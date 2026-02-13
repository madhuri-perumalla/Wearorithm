import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  stylePreferences: jsonb("style_preferences").$type<{
    minimalist: number;
    boldColors: number;
    vintage: number;
    formal: number;
  }>(),
  colorPersonality: jsonb("color_personality").$type<{
    undertone: "warm" | "cool" | "neutral";
    preferredColors: string[];
  }>(),
  bodyType: text("body_type"),
  favoriteOccasions: text("favorite_occasions").array(),
  moodPreferences: text("mood_preferences").array(),
});

export const outfits = pgTable("outfits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  occasion: text("occasion").notNull(),
  mood: text("mood").notNull(),
  items: jsonb("items").$type<{
    top?: string;
    bottom?: string;
    shoes?: string;
    accessories?: string[];
  }>().notNull(),
  colors: text("colors").array().notNull(),
  confidenceScore: integer("confidence_score").notNull(),
  aiAnalysis: jsonb("ai_analysis").$type<{
    feedback: string;
    suggestions: string[];
    impact: string;
  }>(),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wardrobeItems = pgTable("wardrobe_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  category: text("category").notNull(), // top, bottom, shoes, accessory
  colors: text("colors").array().notNull(),
  imageUrl: text("image_url"),
  brand: text("brand"),
  size: text("size"),
  purchased: timestamp("purchased"),
  tags: text("tags").array(),
});

export const outfitAnalyses = pgTable("outfit_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  imageUrl: text("image_url").notNull(),
  analysis: jsonb("analysis").$type<{
    suitability: number;
    feedback: string;
    suggestions: string[];
    colorAnalysis: {
      dominantColors: string[];
      complementaryColors: string[];
    };
    styleMatch: {
      occasion: string;
      mood: string;
      confidence: number;
    };
  }>().notNull(),
  userRating: integer("user_rating"), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userFeedback = pgTable("user_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  outfitId: varchar("outfit_id").references(() => outfits.id),
  analysisId: varchar("analysis_id").references(() => outfitAnalyses.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
});

export const insertOutfitSchema = createInsertSchema(outfits).omit({
  id: true,
  createdAt: true,
});

export const insertWardrobeItemSchema = createInsertSchema(wardrobeItems).omit({
  id: true,
});

export const insertOutfitAnalysisSchema = createInsertSchema(outfitAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertUserFeedbackSchema = createInsertSchema(userFeedback).omit({
  id: true,
  createdAt: true,
});

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type Outfit = typeof outfits.$inferSelect;
export type InsertOutfit = z.infer<typeof insertOutfitSchema>;
export type WardrobeItem = typeof wardrobeItems.$inferSelect;
export type InsertWardrobeItem = z.infer<typeof insertWardrobeItemSchema>;
export type OutfitAnalysis = typeof outfitAnalyses.$inferSelect;
export type InsertOutfitAnalysis = z.infer<typeof insertOutfitAnalysisSchema>;
export type UserFeedback = typeof userFeedback.$inferSelect;
export type InsertUserFeedback = z.infer<typeof insertUserFeedbackSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;
