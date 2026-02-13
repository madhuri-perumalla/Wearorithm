import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  loginSchema, 
  registerSchema, 
  insertUserProfileSchema,
  insertOutfitSchema,
  insertWardrobeItemSchema,
  insertOutfitAnalysisSchema,
  insertUserFeedbackSchema
} from "@shared/schema";
import { hashPassword, verifyPassword, generateToken } from "./services/auth";
import { authenticateToken, type AuthenticatedRequest } from "./middleware/auth";
import { generateOutfitRecommendations, analyzeOutfitImage, generateColorPalette } from "./services/gemini";
import multer from "multer";

// Configure multer for image uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const existingUsername = await storage.getUserByUsername(data.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(data.password);
      const user = await storage.createUser({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Create default user profile
      await storage.createUserProfile({
        userId: user.id,
        stylePreferences: {
          minimalist: 50,
          boldColors: 50,
          vintage: 50,
          formal: 50,
        },
        colorPersonality: {
          undertone: "neutral",
          preferredColors: [],
        },
        favoriteOccasions: [],
        moodPreferences: [],
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
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
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
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User profile routes
  app.get("/api/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      let profile = await storage.getUserProfile(req.user!.id);
      if (!profile) {
        // Create default profile if it doesn't exist
        profile = await storage.createUserProfile({
          userId: req.user!.id,
          stylePreferences: {
            minimalist: 50,
            boldColors: 50,
            vintage: 50,
            formal: 50,
          },
          colorPersonality: {
            undertone: "neutral",
            preferredColors: [],
          },
          favoriteOccasions: [],
          moodPreferences: [],
        });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      let profile = await storage.getUserProfile(req.user!.id);
      if (!profile) {
        // Create default profile if it doesn't exist
        profile = await storage.createUserProfile({
          userId: req.user!.id,
          stylePreferences: {
            minimalist: 50,
            boldColors: 50,
            vintage: 50,
            formal: 50,
          },
          colorPersonality: {
            undertone: "neutral",
            preferredColors: [],
          },
          favoriteOccasions: [],
          moodPreferences: [],
        });
      }
      
      const data = insertUserProfileSchema.partial().parse(req.body);
      const updatedProfile = await storage.updateUserProfile(req.user!.id, data);
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(updatedProfile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Outfit recommendation routes
  app.post("/api/recommendations", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { occasion, mood, count = 2 } = req.body;
      
      const userProfile = await storage.getUserProfile(req.user!.id);
      const recommendations = await generateOutfitRecommendations(userProfile, occasion, mood, count);
      
      // Save recommendations as outfits
      const savedOutfits = await Promise.all(
        recommendations.map(rec => storage.createOutfit({
          userId: req.user!.id,
          name: rec.name,
          occasion: rec.occasion,
          mood: rec.mood,
          items: rec.items,
          colors: rec.colors,
          confidenceScore: rec.confidenceScore,
          aiAnalysis: {
            feedback: rec.feedback,
            suggestions: rec.suggestions,
            impact: rec.impact,
          },
        }))
      );

      res.json(savedOutfits);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/outfits", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const outfits = await storage.getOutfitsByUser(req.user!.id);
      res.json(outfits);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/outfits/:id/favorite", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const outfit = await storage.updateOutfit(req.params.id, { isFavorite: req.body.isFavorite });
      if (!outfit) {
        return res.status(404).json({ message: "Outfit not found" });
      }
      res.json(outfit);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Image analysis routes
  app.post("/api/analyze-image", authenticateToken, upload.single('image'), async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imageBase64 = req.file.buffer.toString('base64');
      const analysis = await analyzeOutfitImage(imageBase64, req.file.mimetype);
      
      // Save analysis
      const savedAnalysis = await storage.createOutfitAnalysis({
        userId: req.user!.id,
        imageUrl: `data:${req.file.mimetype};base64,${imageBase64}`,
        analysis,
      });

      res.json(savedAnalysis);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/analyses", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const analyses = await storage.getOutfitAnalyses(req.user!.id);
      res.json(analyses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Wardrobe routes
  app.get("/api/wardrobe", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const items = await storage.getWardrobeItems(req.user!.id);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/wardrobe", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const data = insertWardrobeItemSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const item = await storage.createWardrobeItem(data);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/wardrobe/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const deleted = await storage.deleteWardrobeItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json({ message: "Item deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Color intelligence routes
  app.post("/api/colors/palette", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { baseColors } = req.body;
      if (!Array.isArray(baseColors)) {
        return res.status(400).json({ message: "baseColors must be an array" });
      }
      
      const palette = await generateColorPalette(baseColors);
      res.json({ complementaryColors: palette });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Feedback routes
  app.post("/api/feedback", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const data = insertUserFeedbackSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const feedback = await storage.createUserFeedback(data);
      res.json(feedback);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/feedback", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const feedback = await storage.getUserFeedback(req.user!.id);
      res.json(feedback);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
