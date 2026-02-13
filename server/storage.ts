import { 
  type User, 
  type InsertUser, 
  type UserProfile, 
  type InsertUserProfile,
  type Outfit,
  type InsertOutfit,
  type WardrobeItem,
  type InsertWardrobeItem,
  type OutfitAnalysis,
  type InsertOutfitAnalysis,
  type UserFeedback,
  type InsertUserFeedback
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  
  // Outfit operations
  getOutfitsByUser(userId: string): Promise<Outfit[]>;
  getOutfit(id: string): Promise<Outfit | undefined>;
  createOutfit(outfit: InsertOutfit): Promise<Outfit>;
  updateOutfit(id: string, updates: Partial<InsertOutfit>): Promise<Outfit | undefined>;
  deleteOutfit(id: string): Promise<boolean>;
  
  // Wardrobe operations
  getWardrobeItems(userId: string): Promise<WardrobeItem[]>;
  createWardrobeItem(item: InsertWardrobeItem): Promise<WardrobeItem>;
  updateWardrobeItem(id: string, updates: Partial<InsertWardrobeItem>): Promise<WardrobeItem | undefined>;
  deleteWardrobeItem(id: string): Promise<boolean>;
  
  // Analysis operations
  getOutfitAnalyses(userId: string): Promise<OutfitAnalysis[]>;
  createOutfitAnalysis(analysis: InsertOutfitAnalysis): Promise<OutfitAnalysis>;
  
  // Feedback operations
  getUserFeedback(userId: string): Promise<UserFeedback[]>;
  createUserFeedback(feedback: InsertUserFeedback): Promise<UserFeedback>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProfiles: Map<string, UserProfile>;
  private outfits: Map<string, Outfit>;
  private wardrobeItems: Map<string, WardrobeItem>;
  private outfitAnalyses: Map<string, OutfitAnalysis>;
  private userFeedback: Map<string, UserFeedback>;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.outfits = new Map();
    this.wardrobeItems = new Map();
    this.outfitAnalyses = new Map();
    this.userFeedback = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return this.userProfiles.get(userId);
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const profile: UserProfile = { ...insertProfile, id };
    this.userProfiles.set(insertProfile.userId, profile);
    return profile;
  }

  async updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return undefined;
    
    const updatedProfile: UserProfile = { ...profile, ...updates };
    this.userProfiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  async getOutfitsByUser(userId: string): Promise<Outfit[]> {
    return Array.from(this.outfits.values()).filter(outfit => outfit.userId === userId);
  }

  async getOutfit(id: string): Promise<Outfit | undefined> {
    return this.outfits.get(id);
  }

  async createOutfit(insertOutfit: InsertOutfit): Promise<Outfit> {
    const id = randomUUID();
    const outfit: Outfit = { 
      ...insertOutfit, 
      id, 
      createdAt: new Date()
    };
    this.outfits.set(id, outfit);
    return outfit;
  }

  async updateOutfit(id: string, updates: Partial<InsertOutfit>): Promise<Outfit | undefined> {
    const outfit = this.outfits.get(id);
    if (!outfit) return undefined;
    
    const updatedOutfit: Outfit = { ...outfit, ...updates };
    this.outfits.set(id, updatedOutfit);
    return updatedOutfit;
  }

  async deleteOutfit(id: string): Promise<boolean> {
    return this.outfits.delete(id);
  }

  async getWardrobeItems(userId: string): Promise<WardrobeItem[]> {
    return Array.from(this.wardrobeItems.values()).filter(item => item.userId === userId);
  }

  async createWardrobeItem(insertItem: InsertWardrobeItem): Promise<WardrobeItem> {
    const id = randomUUID();
    const item: WardrobeItem = { ...insertItem, id };
    this.wardrobeItems.set(id, item);
    return item;
  }

  async updateWardrobeItem(id: string, updates: Partial<InsertWardrobeItem>): Promise<WardrobeItem | undefined> {
    const item = this.wardrobeItems.get(id);
    if (!item) return undefined;
    
    const updatedItem: WardrobeItem = { ...item, ...updates };
    this.wardrobeItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteWardrobeItem(id: string): Promise<boolean> {
    return this.wardrobeItems.delete(id);
  }

  async getOutfitAnalyses(userId: string): Promise<OutfitAnalysis[]> {
    return Array.from(this.outfitAnalyses.values()).filter(analysis => analysis.userId === userId);
  }

  async createOutfitAnalysis(insertAnalysis: InsertOutfitAnalysis): Promise<OutfitAnalysis> {
    const id = randomUUID();
    const analysis: OutfitAnalysis = { 
      ...insertAnalysis, 
      id, 
      createdAt: new Date()
    };
    this.outfitAnalyses.set(id, analysis);
    return analysis;
  }

  async getUserFeedback(userId: string): Promise<UserFeedback[]> {
    return Array.from(this.userFeedback.values()).filter(feedback => feedback.userId === userId);
  }

  async createUserFeedback(insertFeedback: InsertUserFeedback): Promise<UserFeedback> {
    const id = randomUUID();
    const feedback: UserFeedback = { 
      ...insertFeedback, 
      id, 
      createdAt: new Date()
    };
    this.userFeedback.set(id, feedback);
    return feedback;
  }
}

export const storage = new MemStorage();
