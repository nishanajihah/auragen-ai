import { GoogleGenerativeAI } from '@google/generative-ai';
import { AuraGenResponse, MoodboardData } from '../types';
import { geminiCache } from './geminiCache';
import { usageTracker } from './usageTracker';

// Environment detection
const isDevelopment = import.meta.env.VITE_APP_ENV === 'development' || import.meta.env.DEV;
const isProduction = import.meta.env.VITE_APP_ENV === 'production' || import.meta.env.PROD;

// Get API key based on environment
const getGeminiApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn(`Gemini API key not found for ${isDevelopment ? 'development' : 'production'} environment`);
    return '';
  }
  
  return apiKey;
};

// Get model based on environment
const getGeminiModel = (): string => {
  return import.meta.env.VITE_GEMINI_MODEL || (isDevelopment ? 'gemini-1.5-flash' : 'gemini-1.5-pro');
};

// Initialize Gemini AI
let genAI: GoogleGenerativeAI | null = null;

const initializeGemini = () => {
  const apiKey = getGeminiApiKey();
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log(`Gemini AI initialized for ${isDevelopment ? 'development' : 'production'} with model: ${getGeminiModel()}`);
  }
  return genAI;
};

// System prompt for AuraGen AI
const SYSTEM_PROMPT = `You are AuraGen AI, an expert UI/UX design assistant that creates comprehensive design systems. You help users create beautiful, professional design systems through conversation.

CRITICAL: You MUST respond with valid JSON in this exact format:
{
  "message": "Your conversational response to the user",
  "moodboard": {
    "vibeSummary": "Brief description of the design vibe",
    "colorPalettes": [
      {
        "name": "Palette Name",
        "purpose": "Purpose description",
        "colors": [
          {
            "name": "Color Name",
            "hex": "#HEXCODE",
            "rgb": "rgb(r, g, b)",
            "hsl": "hsl(h, s%, l%)",
            "description": "Color description and psychology",
            "usage": "Where and how to use this color"
          }
        ]
      }
    ],
    "fontPairing": {
      "heading": {
        "name": "Font Name",
        "googleFont": "Google+Font+Name:wght@weights",
        "fallback": "fallback-family",
        "category": "serif|sans-serif|display|monospace",
        "weights": [400, 500, 600, 700],
        "sizes": {
          "h1": "4rem",
          "h2": "3rem",
          "h3": "2.25rem",
          "h4": "1.875rem",
          "h5": "1.5rem",
          "h6": "1.25rem"
        }
      },
      "body": {
        "name": "Font Name",
        "googleFont": "Google+Font+Name:wght@weights",
        "fallback": "fallback-family",
        "category": "serif|sans-serif|display|monospace",
        "weights": [300, 400, 500, 600],
        "sizes": {
          "large": "1.25rem",
          "regular": "1rem",
          "small": "0.875rem",
          "caption": "0.75rem"
        }
      }
    },
    "visualInspiration": [
      {
        "title": "Inspiration Title",
        "description": "Detailed description",
        "mood": "Mood description",
        "colors": ["#hex1", "#hex2"],
        "elements": ["element1", "element2"],
        "useCases": ["usecase1", "usecase2"],
        "prompt": "AI image generation prompt"
      }
    ],
    "componentSuggestions": [
      {
        "component": "Component Name",
        "description": "Component description",
        "styling": "Tailwind CSS classes",
        "category": "interactive|forms|feedback|layout|navigation",
        "states": {
          "default": "default styling",
          "hover": "hover styling",
          "focus": "focus styling",
          "active": "active styling",
          "disabled": "disabled styling"
        }
      }
    ],
    "designPrinciples": {
      "spacing": "Spacing system description",
      "borderRadius": "Border radius system",
      "shadows": "Shadow system",
      "animations": "Animation guidelines"
    }
  },
  "isComplete": true
}

IMPORTANT RULES:
1. Always include a complete moodboard object when generating a design system
2. Use real, accessible color combinations with proper contrast ratios
3. Suggest real Google Fonts that exist
4. Provide practical Tailwind CSS classes for components
5. Make responses conversational and helpful
6. Include 4-6 colors per palette with proper color theory
7. Ensure all hex codes are valid 6-digit codes
8. Include multiple visual inspiration examples
9. Provide comprehensive component suggestions with all states

When a user asks for regeneration of specific sections, only modify that section while keeping the rest intact.`;

// Generate design system with Gemini AI
export const generateDesignSystem = async (
  userMessage: string, 
  conversationHistory: string[] = [],
  userId?: string,
  isPremium: boolean = false,
  forceRefresh: boolean = false
): Promise<AuraGenResponse> => {
  try {
    // Check rate limits in production
    if (isProduction && userId) {
      const rateCheck = usageTracker.checkRateLimit(userId, 'generation', isPremium);
      if (!rateCheck.allowed) {
        const resetTime = rateCheck.resetTime ? new Date(rateCheck.resetTime).toLocaleTimeString() : 'later';
        return {
          message: `You've reached your ${rateCheck.reason?.replace('_', ' ')} limit. Please try again ${resetTime === 'later' ? 'later' : `at ${resetTime}`} or upgrade to Premium for unlimited access.`,
          isComplete: false
        };
      }
    }

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = geminiCache.get(userMessage, conversationHistory);
      if (cached) {
        console.log('Returning cached response');
        return cached;
      }
    }

    // Initialize Gemini if not already done
    if (!genAI) {
      genAI = initializeGemini();
    }

    if (!genAI) {
      throw new Error('Gemini AI not initialized - API key missing');
    }

    const model = genAI.getGenerativeModel({ model: getGeminiModel() });

    // Build conversation context
    const context = conversationHistory.length > 0 
      ? `Previous conversation:\n${conversationHistory.join('\n')}\n\nUser: ${userMessage}`
      : `User: ${userMessage}`;

    const prompt = `${SYSTEM_PROMPT}\n\n${context}\n\nRespond with valid JSON only:`;

    console.log(`Generating with Gemini ${getGeminiModel()} in ${isDevelopment ? 'development' : 'production'} mode`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let parsedResponse;
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Raw response:', text);
      
      // Record failed usage
      if (userId) {
        usageTracker.recordUsage(userId, 'generation', false);
      }
      
      // Fallback response
      return {
        message: "I apologize, but I'm having trouble generating your design system right now. Please try again with a more specific request about the type of interface you'd like to create.",
        isComplete: false
      };
    }

    // Validate response structure
    if (!parsedResponse.message) {
      throw new Error('Invalid response structure - missing message');
    }

    // Convert color formats if needed
    if (parsedResponse.moodboard?.colorPalettes) {
      parsedResponse.moodboard.colorPalettes.forEach((palette: any) => {
        palette.colors.forEach((color: any) => {
          if (!color.rgb) {
            color.rgb = hexToRgb(color.hex);
          }
          if (!color.hsl) {
            color.hsl = hexToHsl(color.hex);
          }
        });
      });
    }

    const finalResponse = {
      message: parsedResponse.message,
      moodboard: parsedResponse.moodboard,
      isComplete: parsedResponse.isComplete || !!parsedResponse.moodboard
    };

    // Cache the response
    geminiCache.set(userMessage, finalResponse, conversationHistory);

    // Record successful usage
    if (userId) {
      usageTracker.recordUsage(userId, 'generation', true);
    }

    return finalResponse;

  } catch (error) {
    console.error('Gemini AI Error:', error);
    
    // Record failed usage
    if (userId) {
      usageTracker.recordUsage(userId, 'generation', false);
    }
    
    // Return user-friendly error message
    return {
      message: "I'm experiencing some technical difficulties right now. Please try again in a moment, or try rephrasing your request with more specific details about the design you'd like to create.",
      isComplete: false
    };
  }
};

// Regenerate specific sections
export const regenerateSection = async (
  section: string, 
  currentMoodboard: MoodboardData,
  userContext: string = '',
  userId?: string,
  isPremium: boolean = false
): Promise<AuraGenResponse> => {
  try {
    // Check rate limits in production
    if (isProduction && userId) {
      const rateCheck = usageTracker.checkRateLimit(userId, 'generation', isPremium);
      if (!rateCheck.allowed) {
        const resetTime = rateCheck.resetTime ? new Date(rateCheck.resetTime).toLocaleTimeString() : 'later';
        return {
          message: `You've reached your ${rateCheck.reason?.replace('_', ' ')} limit. Please try again ${resetTime === 'later' ? 'later' : `at ${resetTime}`} or upgrade to Premium for unlimited access.`,
          isComplete: false
        };
      }
    }

    if (!genAI) {
      genAI = initializeGemini();
    }

    if (!genAI) {
      throw new Error('Gemini AI not initialized');
    }

    const model = genAI.getGenerativeModel({ model: getGeminiModel() });

    const prompt = `${SYSTEM_PROMPT}

Current design system context:
${JSON.stringify(currentMoodboard, null, 2)}

User request: Regenerate the ${section} section. ${userContext}

Please provide a complete JSON response with the updated ${section} section while keeping all other sections intact.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);

    // Record successful usage
    if (userId) {
      usageTracker.recordUsage(userId, 'generation', true);
    }

    return {
      message: parsedResponse.message || `I've regenerated the ${section} section with fresh ideas!`,
      moodboard: parsedResponse.moodboard,
      isComplete: true
    };

  } catch (error) {
    console.error('Regeneration Error:', error);
    
    // Record failed usage
    if (userId) {
      usageTracker.recordUsage(userId, 'generation', false);
    }
    
    return {
      message: `I had trouble regenerating the ${section} section. Please try again or be more specific about what you'd like to change.`,
      isComplete: false
    };
  }
};

// Utility functions
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgb(${r}, ${g}, ${b})`;
};

const hexToHsl = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

// Environment info for debugging
export const getEnvironmentInfo = () => {
  return {
    environment: isDevelopment ? 'development' : 'production',
    model: getGeminiModel(),
    hasApiKey: !!getGeminiApiKey(),
    branch: isDevelopment ? 'dev' : 'main',
    cacheStats: geminiCache.getStats()
  };
};

// Clear cache manually
export const clearCache = () => {
  geminiCache.clear();
};

// Get usage statistics
export const getUsageStats = (userId: string, isPremium: boolean = false) => {
  return usageTracker.getUsageStats(userId, isPremium);
};