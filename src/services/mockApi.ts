import { AuraGenResponse } from '../types';
import { generateDesignSystem, regenerateSection } from './gemini';

// Conversation history for context
let conversationHistory: string[] = [];

export const generateAuraResponse = async (message: string): Promise<AuraGenResponse> => {
  try {
    // Add user message to history
    conversationHistory.push(`User: ${message}`);
    
    // Keep only last 10 messages for context
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    // Generate response with Gemini AI
    const response = await generateDesignSystem(message, conversationHistory);
    
    // Add AI response to history
    if (response.message) {
      conversationHistory.push(`Assistant: ${response.message}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    
    // Fallback response
    return {
      message: "I'm having trouble connecting to my AI brain right now. Please check your internet connection and try again. If the problem persists, make sure your API key is properly configured.",
      isComplete: false
    };
  }
};

export const handleRegenerateSection = async (
  section: string,
  currentMoodboard: any,
  userContext: string = ''
): Promise<AuraGenResponse> => {
  try {
    return await regenerateSection(section, currentMoodboard, userContext);
  } catch (error) {
    console.error('Error regenerating section:', error);
    
    return {
      message: `I had trouble regenerating the ${section} section. Please try again or check your connection.`,
      isComplete: false
    };
  }
};

// Reset for new conversations
export const resetConversation = () => {
  conversationHistory = [];
};