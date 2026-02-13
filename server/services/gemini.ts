import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface OutfitRecommendation {
  name: string;
  occasion: string;
  mood: string;
  items: {
    top: string;
    bottom: string;
    shoes: string;
    accessories: string[];
  };
  colors: string[];
  confidenceScore: number;
  feedback: string;
  impact: string;
  suggestions: string[];
}

export interface ImageAnalysisResult {
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
}

export async function generateOutfitRecommendations(
  userPreferences: any,
  occasion: string,
  mood: string,
  count: number = 2
): Promise<OutfitRecommendation[]> {
  // Check if Gemini API key is available
  if (!process.env.GEMINI_API_KEY) {
    console.log("Gemini API key not found, returning mock recommendations");
    return [
      {
        name: `Perfect ${occasion} Look`,
        occasion: occasion,
        mood: mood,
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
        occasion: occasion,
        mood: mood,
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
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    return result.recommendations || [];
  } catch (error) {
    console.error("Error generating outfit recommendations:", error);
    throw new Error("Failed to generate outfit recommendations");
  }
}

export async function analyzeOutfitImage(imageBase64: string, mimeType: string): Promise<ImageAnalysisResult> {
  // Check if Gemini API key is available
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
          mimeType: mimeType,
        },
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

Be constructive and specific in your feedback. Focus on practical styling advice.`,
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
      contents: contents,
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Error analyzing outfit image:", error);
    throw new Error("Failed to analyze outfit image");
  }
}

export async function generateColorPalette(baseColors: string[]): Promise<string[]> {
  // Check if Gemini API key is available
  if (!process.env.GEMINI_API_KEY) {
    console.log("Gemini API key not found, returning mock color palette");
    return [
      "#E74C3C", // Red
      "#F39C12", // Orange
      "#F1C40F", // Yellow
      "#27AE60", // Green
      "#3498DB", // Blue
      "#8E44AD", // Purple
      "#E67E22", // Dark Orange
      "#2ECC71"  // Light Green
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
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    return result.complementaryColors || [];
  } catch (error) {
    console.error("Error generating color palette:", error);
    throw new Error("Failed to generate color palette");
  }
}
