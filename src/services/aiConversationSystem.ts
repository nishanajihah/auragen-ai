// AI Conversational System with Gemini and ElevenLabs Integration
import { generateDesignSystem, regenerateSection } from './gemini';
import { speakAuraResponse } from './elevenlabs';
import { analytics } from './analytics';
import { notifications } from './notifications';

export interface ConversationMode {
  type: 'text' | 'voice' | 'hybrid';
  voiceEnabled: boolean;
  autoSpeak: boolean;
}

export interface UsageMetrics {
  geminiCharacters: number;
  elevenlabsCharacters: number;
  totalCost: number;
  requestCount: number;
}

export interface ConversationContext {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  mode: ConversationMode;
  userId?: string;
  isPremium: boolean;
}

class AIConversationSystem {
  private context: ConversationContext;
  private usageMetrics: UsageMetrics;
  private responseCache: Map<string, any>;
  private costLimits = {
    free: { daily: 10.00, monthly: 50.00 },
    premium: { daily: 100.00, monthly: 1000.00 }
  };

  constructor() {
    this.context = {
      messages: [],
      mode: { type: 'text', voiceEnabled: false, autoSpeak: false },
      isPremium: false
    };
    this.usageMetrics = {
      geminiCharacters: 0,
      elevenlabsCharacters: 0,
      totalCost: 0,
      requestCount: 0
    };
    this.responseCache = new Map();
    this.loadUsageMetrics();
  }

  // Initialize conversation system
  async initialize(userId: string, isPremium: boolean) {
    this.context.userId = userId;
    this.context.isPremium = isPremium;
    
    // Load user's conversation history
    await this.loadConversationHistory();
    
    analytics.trackFeatureUsage('ai_conversation_init', { userId, isPremium });
  }

  // Set conversation mode
  setMode(mode: Partial<ConversationMode>) {
    this.context.mode = { ...this.context.mode, ...mode };
    
    analytics.trackFeatureUsage('conversation_mode_change', {
      type: this.context.mode.type,
      voiceEnabled: this.context.mode.voiceEnabled
    });

    notifications.info(
      'Mode Updated',
      `Conversation mode set to ${this.context.mode.type}${this.context.mode.voiceEnabled ? ' with voice' : ''}`
    );
  }

  // Process user input and generate AI response
  async processMessage(
    userInput: string,
    options: {
      forceRefresh?: boolean;
      includeVoice?: boolean;
      contextData?: any;
    } = {}
  ) {
    try {
      // Check usage limits
      if (!this.checkUsageLimits()) {
        throw new Error('Usage limit exceeded');
      }

      // Add user message to context
      this.addMessage('user', userInput);

      // Check cache first
      const cacheKey = this.generateCacheKey(userInput);
      if (!options.forceRefresh && this.responseCache.has(cacheKey)) {
        const cachedResponse = this.responseCache.get(cacheKey);
        analytics.trackFeatureUsage('ai_response_cached');
        return this.handleResponse(cachedResponse, options.includeVoice);
      }

      // Generate AI response with Gemini
      const response = await this.generateAIResponse(userInput, options.contextData);
      
      // Cache the response
      this.responseCache.set(cacheKey, response);
      
      // Update usage metrics
      this.updateUsageMetrics('gemini', userInput.length);
      
      // Handle voice response if enabled
      return await this.handleResponse(response, options.includeVoice);

    } catch (error) {
      console.error('AI Conversation Error:', error);
      analytics.trackError('ai_conversation_failed', error instanceof Error ? error.message : 'Unknown error');
      
      return this.handleError(error);
    }
  }

  // Generate AI response using Gemini
  private async generateAIResponse(userInput: string, contextData?: any) {
    const conversationHistory = this.context.messages.slice(-10); // Last 10 messages for context
    
    const response = await generateDesignSystem(
      userInput,
      conversationHistory.map(m => `${m.role}: ${m.content}`),
      this.context.userId,
      this.context.isPremium
    );

    this.addMessage('assistant', response.message);
    
    analytics.trackGeneration(userInput, true);
    
    return response;
  }

  // Handle AI response with optional voice synthesis
  private async handleResponse(response: any, includeVoice?: boolean) {
    const shouldSpeak = includeVoice ?? 
                      (this.context.mode.voiceEnabled && this.context.mode.autoSpeak);

    if (shouldSpeak && response.message) {
      try {
        await this.synthesizeVoice(response.message);
      } catch (voiceError) {
        console.warn('Voice synthesis failed:', voiceError);
        notifications.warning('Voice Unavailable', 'Text response generated successfully, but voice synthesis failed.');
      }
    }

    return response;
  }

  // Synthesize voice response using ElevenLabs
  private async synthesizeVoice(text: string, voiceId?: string) {
    if (!this.checkVoiceUsageLimits(text.length)) {
      notifications.warning('Voice Limit Reached', 'Switching to text-only mode to stay within limits.');
      this.context.mode.voiceEnabled = false;
      return;
    }

    await speakAuraResponse(text, voiceId);
    this.updateUsageMetrics('elevenlabs', text.length);
    
    analytics.trackFeatureUsage('voice_synthesis', {
      characterCount: text.length,
      voiceId: voiceId || 'default'
    });
  }

  // Regenerate specific sections
  async regenerateSection(
    section: string,
    currentMoodboard: any,
    userContext: string = ''
  ) {
    try {
      if (!this.checkUsageLimits()) {
        throw new Error('Usage limit exceeded');
      }

      const response = await regenerateSection(
        section,
        currentMoodboard,
        userContext,
        this.context.userId,
        this.context.isPremium
      );

      this.updateUsageMetrics('gemini', userContext.length);
      
      if (this.context.mode.voiceEnabled && this.context.mode.autoSpeak) {
        await this.synthesizeVoice(response.message);
      }

      analytics.trackFeatureUsage('section_regeneration', { section });
      
      return response;

    } catch (error) {
      console.error('Section regeneration error:', error);
      analytics.trackError('section_regeneration_failed', section);
      throw error;
    }
  }

  // Check usage limits
  private checkUsageLimits(): boolean {
    const limits = this.context.isPremium ? this.costLimits.premium : this.costLimits.free;
    const dailyCost = this.getDailyCost();
    
    if (dailyCost >= limits.daily) {
      notifications.warning(
        'Daily Limit Reached',
        `You've reached your daily usage limit of $${limits.daily}. ${this.context.isPremium ? 'Please try again tomorrow.' : 'Upgrade to Premium for higher limits.'}`
      );
      return false;
    }

    return true;
  }

  // Check voice-specific usage limits
  private checkVoiceUsageLimits(characterCount: number): boolean {
    const estimatedCost = this.estimateElevenLabsCost(characterCount);
    const limits = this.context.isPremium ? this.costLimits.premium : this.costLimits.free;
    const dailyCost = this.getDailyCost();
    
    return (dailyCost + estimatedCost) <= limits.daily;
  }

  // Estimate costs
  private estimateGeminiCost(characterCount: number): number {
    // Gemini pricing: ~$0.00025 per 1K characters
    return (characterCount / 1000) * 0.00025;
  }

  private estimateElevenLabsCost(characterCount: number): number {
    // ElevenLabs pricing: ~$0.30 per 1K characters
    return (characterCount / 1000) * 0.30;
  }

  // Update usage metrics
  private updateUsageMetrics(service: 'gemini' | 'elevenlabs', characterCount: number) {
    if (service === 'gemini') {
      this.usageMetrics.geminiCharacters += characterCount;
      this.usageMetrics.totalCost += this.estimateGeminiCost(characterCount);
    } else {
      this.usageMetrics.elevenlabsCharacters += characterCount;
      this.usageMetrics.totalCost += this.estimateElevenLabsCost(characterCount);
    }
    
    this.usageMetrics.requestCount++;
    this.saveUsageMetrics();
  }

  // Get daily cost
  private getDailyCost(): number {
    const today = new Date().toDateString();
    const todayMetrics = this.loadDailyMetrics(today);
    return todayMetrics.totalCost;
  }

  // Utility methods
  private addMessage(role: 'user' | 'assistant', content: string) {
    this.context.messages.push({
      role,
      content,
      timestamp: new Date()
    });

    // Keep only last 50 messages to prevent memory issues
    if (this.context.messages.length > 50) {
      this.context.messages = this.context.messages.slice(-50);
    }

    this.saveConversationHistory();
  }

  private generateCacheKey(input: string): string {
    const contextHash = this.context.messages.slice(-5)
      .map(m => m.content)
      .join('|');
    return btoa(`${input}|${contextHash}`).replace(/[^a-zA-Z0-9]/g, '');
  }

  private handleError(error: any): any {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (errorMessage.includes('limit exceeded')) {
      return {
        message: "You've reached your usage limit. Please upgrade to Premium for unlimited access or try again tomorrow.",
        isComplete: false,
        error: 'USAGE_LIMIT_EXCEEDED'
      };
    }

    return {
      message: "I'm experiencing technical difficulties. Please try again in a moment.",
      isComplete: false,
      error: 'TECHNICAL_ERROR'
    };
  }

  // Storage methods
  private saveConversationHistory() {
    if (this.context.userId) {
      localStorage.setItem(
        `auragen-conversation-${this.context.userId}`,
        JSON.stringify(this.context.messages)
      );
    }
  }

  private async loadConversationHistory() {
    if (this.context.userId) {
      const saved = localStorage.getItem(`auragen-conversation-${this.context.userId}`);
      if (saved) {
        this.context.messages = JSON.parse(saved).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      }
    }
  }

  private saveUsageMetrics() {
    const today = new Date().toDateString();
    localStorage.setItem(
      `auragen-usage-${today}`,
      JSON.stringify(this.usageMetrics)
    );
  }

  private loadUsageMetrics() {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`auragen-usage-${today}`);
    if (saved) {
      this.usageMetrics = JSON.parse(saved);
    }
  }

  private loadDailyMetrics(date: string): UsageMetrics {
    const saved = localStorage.getItem(`auragen-usage-${date}`);
    return saved ? JSON.parse(saved) : {
      geminiCharacters: 0,
      elevenlabsCharacters: 0,
      totalCost: 0,
      requestCount: 0
    };
  }

  // Public getters
  getUsageMetrics(): UsageMetrics {
    return { ...this.usageMetrics };
  }

  getConversationMode(): ConversationMode {
    return { ...this.context.mode };
  }

  getConversationHistory() {
    return [...this.context.messages];
  }

  // Clear conversation
  clearConversation() {
    this.context.messages = [];
    this.responseCache.clear();
    this.saveConversationHistory();
    
    analytics.trackFeatureUsage('conversation_cleared');
    notifications.info('Conversation Cleared', 'Starting fresh conversation.');
  }

  // Export conversation
  exportConversation(): string {
    return JSON.stringify({
      messages: this.context.messages,
      mode: this.context.mode,
      metrics: this.usageMetrics,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }
}

// Export singleton instance
export const aiConversationSystem = new AIConversationSystem();

// Export types and utilities
export type { ConversationMode, UsageMetrics, ConversationContext };