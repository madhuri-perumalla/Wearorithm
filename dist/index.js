// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  userProfiles;
  outfits;
  wardrobeItems;
  outfitAnalyses;
  userFeedback;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.userProfiles = /* @__PURE__ */ new Map();
    this.outfits = /* @__PURE__ */ new Map();
    this.wardrobeItems = /* @__PURE__ */ new Map();
    this.outfitAnalyses = /* @__PURE__ */ new Map();
    this.userFeedback = /* @__PURE__ */ new Map();
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async getUserProfile(userId) {
    return this.userProfiles.get(userId);
  }
  async createUserProfile(insertProfile) {
    const id = randomUUID();
    const profile = { ...insertProfile, id };
    this.userProfiles.set(insertProfile.userId, profile);
    return profile;
  }
  async updateUserProfile(userId, updates) {
    const profile = await this.getUserProfile(userId);
    if (!profile) return void 0;
    const updatedProfile = { ...profile, ...updates };
    this.userProfiles.set(userId, updatedProfile);
    return updatedProfile;
  }
  async getOutfitsByUser(userId) {
    return Array.from(this.outfits.values()).filter((outfit) => outfit.userId === userId);
  }
  async getOutfit(id) {
    return this.outfits.get(id);
  }
  async createOutfit(insertOutfit) {
    const id = randomUUID();
    const outfit = {
      ...insertOutfit,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.outfits.set(id, outfit);
    return outfit;
  }
  async updateOutfit(id, updates) {
    const outfit = this.outfits.get(id);
    if (!outfit) return void 0;
    const updatedOutfit = { ...outfit, ...updates };
    this.outfits.set(id, updatedOutfit);
    return updatedOutfit;
  }
  async deleteOutfit(id) {
    return this.outfits.delete(id);
  }
  async getWardrobeItems(userId) {
    return Array.from(this.wardrobeItems.values()).filter((item) => item.userId === userId);
  }
  async createWardrobeItem(insertItem) {
    const id = randomUUID();
    const item = { ...insertItem, id };
    this.wardrobeItems.set(id, item);
    return item;
  }
  async updateWardrobeItem(id, updates) {
    const item = this.wardrobeItems.get(id);
    if (!item) return void 0;
    const updatedItem = { ...item, ...updates };
    this.wardrobeItems.set(id, updatedItem);
    return updatedItem;
  }
  async deleteWardrobeItem(id) {
    return this.wardrobeItems.delete(id);
  }
  async getOutfitAnalyses(userId) {
    return Array.from(this.outfitAnalyses.values()).filter((analysis) => analysis.userId === userId);
  }
  async createOutfitAnalysis(insertAnalysis) {
    const id = randomUUID();
    const analysis = {
      ...insertAnalysis,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.outfitAnalyses.set(id, analysis);
    return analysis;
  }
  async getUserFeedback(userId) {
    return Array.from(this.userFeedback.values()).filter((feedback) => feedback.userId === userId);
  }
  async createUserFeedback(insertFeedback) {
    const id = randomUUID();
    const feedback = {
      ...insertFeedback,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.userFeedback.set(id, feedback);
    return feedback;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  stylePreferences: jsonb("style_preferences").$type(),
  colorPersonality: jsonb("color_personality").$type(),
  bodyType: text("body_type"),
  favoriteOccasions: text("favorite_occasions").array(),
  moodPreferences: text("mood_preferences").array()
});
var outfits = pgTable("outfits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  occasion: text("occasion").notNull(),
  mood: text("mood").notNull(),
  items: jsonb("items").$type().notNull(),
  colors: text("colors").array().notNull(),
  confidenceScore: integer("confidence_score").notNull(),
  aiAnalysis: jsonb("ai_analysis").$type(),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var wardrobeItems = pgTable("wardrobe_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  category: text("category").notNull(),
  // top, bottom, shoes, accessory
  colors: text("colors").array().notNull(),
  imageUrl: text("image_url"),
  brand: text("brand"),
  size: text("size"),
  purchased: timestamp("purchased"),
  tags: text("tags").array()
});
var outfitAnalyses = pgTable("outfit_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  imageUrl: text("image_url").notNull(),
  analysis: jsonb("analysis").$type().notNull(),
  userRating: integer("user_rating"),
  // 1-5 stars
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userFeedback = pgTable("user_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  outfitId: varchar("outfit_id").references(() => outfits.id),
  analysisId: varchar("analysis_id").references(() => outfitAnalyses.id),
  rating: integer("rating").notNull(),
  // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true
});
var insertOutfitSchema = createInsertSchema(outfits).omit({
  id: true,
  createdAt: true
});
var insertWardrobeItemSchema = createInsertSchema(wardrobeItems).omit({
  id: true
});
var insertOutfitAnalysisSchema = createInsertSchema(outfitAnalyses).omit({
  id: true,
  createdAt: true
});
var insertUserFeedbackSchema = createInsertSchema(userFeedback).omit({
  id: true,
  createdAt: true
});
var loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
var registerSchema = insertUserSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// server/services/auth.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.SESSION_SECRET || "default-secret-key";
var SALT_ROUNDS = 10;
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

// server/middleware/auth.ts
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }
  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

// server/services/gemini.ts
import { GoogleGenAI } from "@google/genai";
var ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
async function generateOutfitRecommendations(userPreferences, occasion, mood, count = 2) {
  if (!process.env.GEMINI_API_KEY) {
    console.log("Gemini API key not found, returning mock recommendations");
    return [
      {
        name: `Perfect ${occasion} Look`,
        occasion,
        mood,
        items: {
          top: "Classic white button-down shirt",
          bottom: "Dark blue tailored trousers",
          shoes: "Brown leather loafers",
          accessories: ["Minimalist watch", "Leather belt"]
        },
        colors: ["#FFFFFF", "#1E3A8A", "#8B4513"],
        confidenceScore: 85,
        feedback: "This is a demo recommendation. To get personalized AI-powered outfit suggestions, please add your Gemini API key. This classic combination works well for professional occasions.",
        impact: "Projects confidence and professionalism",
        suggestions: [
          "Add a blazer for a more formal look",
          "Consider a pocket square for added elegance",
          "Try different shoe colors to match your style"
        ]
      },
      {
        name: `Casual ${mood} Style`,
        occasion,
        mood,
        items: {
          top: "Soft cotton t-shirt",
          bottom: "Comfortable jeans",
          shoes: "White sneakers",
          accessories: ["Canvas tote bag", "Simple necklace"]
        },
        colors: ["#F8F9FA", "#6C757D", "#FFFFFF"],
        confidenceScore: 80,
        feedback: "This is a demo recommendation. To get personalized AI-powered outfit suggestions, please add your Gemini API key. This relaxed look is perfect for casual outings.",
        impact: "Conveys comfort and approachability",
        suggestions: [
          "Layer with a denim jacket for cooler weather",
          "Add colorful accessories to express personality",
          "Try different jean washes for variety"
        ]
      }
    ];
  }
  try {
    const prompt = `As a professional fashion stylist AI, generate ${count} outfit recommendations for a person with these preferences:
    
Style Preferences: ${JSON.stringify(userPreferences?.stylePreferences || {})}
Color Personality: ${JSON.stringify(userPreferences?.colorPersonality || {})}
Occasion: ${occasion}
Mood: ${mood}

For each outfit, provide:
1. A creative name
2. Specific clothing items (top, bottom, shoes, accessories)
3. Color palette (hex codes)
4. Confidence score (0-100)
5. Detailed feedback explaining why this works
6. Personality impact description
7. Improvement suggestions

Focus on real, achievable outfit combinations that match the user's style and the specified occasion/mood.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  occasion: { type: "string" },
                  mood: { type: "string" },
                  items: {
                    type: "object",
                    properties: {
                      top: { type: "string" },
                      bottom: { type: "string" },
                      shoes: { type: "string" },
                      accessories: { type: "array", items: { type: "string" } }
                    },
                    required: ["top", "bottom", "shoes", "accessories"]
                  },
                  colors: { type: "array", items: { type: "string" } },
                  confidenceScore: { type: "number" },
                  feedback: { type: "string" },
                  impact: { type: "string" },
                  suggestions: { type: "array", items: { type: "string" } }
                },
                required: ["name", "occasion", "mood", "items", "colors", "confidenceScore", "feedback", "impact", "suggestions"]
              }
            }
          },
          required: ["recommendations"]
        }
      },
      contents: prompt
    });
    const result = JSON.parse(response.text || "{}");
    return result.recommendations || [];
  } catch (error) {
    console.error("Error generating outfit recommendations:", error);
    throw new Error("Failed to generate outfit recommendations");
  }
}
async function analyzeOutfitImage(imageBase64, mimeType) {
  if (!process.env.GEMINI_API_KEY) {
    console.log("Gemini API key not found, returning mock analysis");
    return {
      suitability: 75,
      feedback: "This is a demo analysis. To get real AI-powered outfit analysis, please add your Gemini API key to the environment variables. The outfit looks well-coordinated with good color harmony.",
      suggestions: [
        "Consider adding a statement accessory to elevate the look",
        "The color combination works well for casual occasions",
        "Try experimenting with different shoe styles for variety"
      ],
      colorAnalysis: {
        dominantColors: ["#2C3E50", "#E8F4FD", "#95A5A6"],
        complementaryColors: ["#E74C3C", "#F39C12", "#27AE60", "#8E44AD"]
      },
      styleMatch: {
        occasion: "Casual Day Out",
        mood: "Relaxed and Comfortable",
        confidence: 80
      }
    };
  }
  try {
    const contents = [
      {
        inlineData: {
          data: imageBase64,
          mimeType
        }
      },
      `Analyze this outfit image as a professional fashion expert. Provide:

1. Suitability score (0-100) - how well the outfit works overall
2. Detailed feedback on fit, style, and color coordination
3. Specific improvement suggestions
4. Color analysis:
   - Dominant colors (hex codes)
   - Complementary colors that would work well
5. Style matching:
   - Best occasion for this outfit
   - Mood it conveys
   - Confidence level it projects (0-100)

Be constructive and specific in your feedback. Focus on practical styling advice.`
    ];
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            suitability: { type: "number" },
            feedback: { type: "string" },
            suggestions: { type: "array", items: { type: "string" } },
            colorAnalysis: {
              type: "object",
              properties: {
                dominantColors: { type: "array", items: { type: "string" } },
                complementaryColors: { type: "array", items: { type: "string" } }
              },
              required: ["dominantColors", "complementaryColors"]
            },
            styleMatch: {
              type: "object",
              properties: {
                occasion: { type: "string" },
                mood: { type: "string" },
                confidence: { type: "number" }
              },
              required: ["occasion", "mood", "confidence"]
            }
          },
          required: ["suitability", "feedback", "suggestions", "colorAnalysis", "styleMatch"]
        }
      },
      contents
    });
    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Error analyzing outfit image:", error);
    throw new Error("Failed to analyze outfit image");
  }
}
async function generateColorPalette(baseColors) {
  if (!process.env.GEMINI_API_KEY) {
    console.log("Gemini API key not found, returning mock color palette");
    return [
      "#E74C3C",
      // Red
      "#F39C12",
      // Orange
      "#F1C40F",
      // Yellow
      "#27AE60",
      // Green
      "#3498DB",
      // Blue
      "#8E44AD",
      // Purple
      "#E67E22",
      // Dark Orange
      "#2ECC71"
      // Light Green
    ];
  }
  try {
    const prompt = `As a color theory expert, generate a complementary color palette for these base colors: ${baseColors.join(", ")}
    
    Provide 5-8 additional colors (hex codes) that would complement these base colors according to color theory principles.
    Consider both harmonious and accent colors that would work well in fashion styling.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            complementaryColors: { type: "array", items: { type: "string" } }
          },
          required: ["complementaryColors"]
        }
      },
      contents: prompt
    });
    const result = JSON.parse(response.text || "{}");
    return result.complementaryColors || [];
  } catch (error) {
    console.error("Error generating color palette:", error);
    throw new Error("Failed to generate color palette");
  }
}

// server/routes.ts
import multer from "multer";
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      const existingUsername = await storage.getUserByUsername(data.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      const hashedPassword = await hashPassword(data.password);
      const user = await storage.createUser({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName
      });
      await storage.createUserProfile({
        userId: user.id,
        stylePreferences: {
          minimalist: 50,
          boldColors: 50,
          vintage: 50,
          formal: 50
        },
        colorPersonality: {
          undertone: "neutral",
          preferredColors: []
        },
        favoriteOccasions: [],
        moodPreferences: []
      });
      const token = generateToken(user);
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isValidPassword = await verifyPassword(data.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken(user);
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/profile", authenticateToken, async (req, res) => {
    try {
      let profile = await storage.getUserProfile(req.user.id);
      if (!profile) {
        profile = await storage.createUserProfile({
          userId: req.user.id,
          stylePreferences: {
            minimalist: 50,
            boldColors: 50,
            vintage: 50,
            formal: 50
          },
          colorPersonality: {
            undertone: "neutral",
            preferredColors: []
          },
          favoriteOccasions: [],
          moodPreferences: []
        });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/profile", authenticateToken, async (req, res) => {
    try {
      let profile = await storage.getUserProfile(req.user.id);
      if (!profile) {
        profile = await storage.createUserProfile({
          userId: req.user.id,
          stylePreferences: {
            minimalist: 50,
            boldColors: 50,
            vintage: 50,
            formal: 50
          },
          colorPersonality: {
            undertone: "neutral",
            preferredColors: []
          },
          favoriteOccasions: [],
          moodPreferences: []
        });
      }
      const data = insertUserProfileSchema.partial().parse(req.body);
      const updatedProfile = await storage.updateUserProfile(req.user.id, data);
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(updatedProfile);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/recommendations", authenticateToken, async (req, res) => {
    try {
      const { occasion, mood, count = 2 } = req.body;
      const userProfile = await storage.getUserProfile(req.user.id);
      const recommendations = await generateOutfitRecommendations(userProfile, occasion, mood, count);
      const savedOutfits = await Promise.all(
        recommendations.map((rec) => storage.createOutfit({
          userId: req.user.id,
          name: rec.name,
          occasion: rec.occasion,
          mood: rec.mood,
          items: rec.items,
          colors: rec.colors,
          confidenceScore: rec.confidenceScore,
          aiAnalysis: {
            feedback: rec.feedback,
            suggestions: rec.suggestions,
            impact: rec.impact
          }
        }))
      );
      res.json(savedOutfits);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/outfits", authenticateToken, async (req, res) => {
    try {
      const outfits2 = await storage.getOutfitsByUser(req.user.id);
      res.json(outfits2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/outfits/:id/favorite", authenticateToken, async (req, res) => {
    try {
      const outfit = await storage.updateOutfit(req.params.id, { isFavorite: req.body.isFavorite });
      if (!outfit) {
        return res.status(404).json({ message: "Outfit not found" });
      }
      res.json(outfit);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/analyze-image", authenticateToken, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      const imageBase64 = req.file.buffer.toString("base64");
      const analysis = await analyzeOutfitImage(imageBase64, req.file.mimetype);
      const savedAnalysis = await storage.createOutfitAnalysis({
        userId: req.user.id,
        imageUrl: `data:${req.file.mimetype};base64,${imageBase64}`,
        analysis
      });
      res.json(savedAnalysis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/analyses", authenticateToken, async (req, res) => {
    try {
      const analyses = await storage.getOutfitAnalyses(req.user.id);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/wardrobe", authenticateToken, async (req, res) => {
    try {
      const items = await storage.getWardrobeItems(req.user.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/wardrobe", authenticateToken, async (req, res) => {
    try {
      const data = insertWardrobeItemSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const item = await storage.createWardrobeItem(data);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.delete("/api/wardrobe/:id", authenticateToken, async (req, res) => {
    try {
      const deleted = await storage.deleteWardrobeItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/colors/palette", authenticateToken, async (req, res) => {
    try {
      const { baseColors } = req.body;
      if (!Array.isArray(baseColors)) {
        return res.status(400).json({ message: "baseColors must be an array" });
      }
      const palette = await generateColorPalette(baseColors);
      res.json({ complementaryColors: palette });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/feedback", authenticateToken, async (req, res) => {
    try {
      const data = insertUserFeedbackSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const feedback = await storage.createUserFeedback(data);
      res.json(feedback);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/feedback", authenticateToken, async (req, res) => {
    try {
      const feedback = await storage.getUserFeedback(req.user.id);
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "localhost", () => {
    log(`serving on port ${port}`);
  });
})();
