// Enhanced ElevenLabs integration with cost tracking and error handling
interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

interface ElevenLabsConfig {
  apiKey: string;
  baseUrl: string;
  defaultVoice: string;
  defaultSettings: VoiceSettings;
}

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private usageTracker: Map<string, number> = new Map();
  private isInitialized = false;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
      baseUrl: 'https://api.elevenlabs.io/v1',
      defaultVoice: 'pNInz6obpgDQGcFmaJgB', // Rachel voice
      defaultSettings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      }
    };
  }

  async initialize(): Promise<boolean> {
    if (!this.config.apiKey) {
      console.warn('ElevenLabs API key not configured');
      return false;
    }

    try {
      // Test API connection
      const response = await fetch(`${this.config.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.config.apiKey
        }
      });

      if (response.ok) {
        this.isInitialized = true;
        console.log('ElevenLabs service initialized successfully');
        return true;
      } else {
        console.error('ElevenLabs API authentication failed');
        return false;
      }
    } catch (error) {
      console.error('ElevenLabs initialization failed:', error);
      return false;
    }
  }

  async generateSpeech(
    text: string,
    voiceId: string = this.config.defaultVoice,
    settings: Partial<VoiceSettings> = {}
  ): Promise<ArrayBuffer | null> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        return null;
      }
    }

    try {
      const voiceSettings = { ...this.config.defaultSettings, ...settings };
      
      const response = await fetch(
        `${this.config.baseUrl}/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.config.apiKey
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: voiceSettings
          })
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      // Track usage
      this.trackUsage(text.length);

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Speech generation failed:', error);
      return null;
    }
  }

  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioData = await audioContext.decodeAudioData(audioBuffer);
      const source = audioContext.createBufferSource();
      
      source.buffer = audioData;
      source.connect(audioContext.destination);
      source.start();

      return new Promise((resolve) => {
        source.onended = () => resolve();
      });
    } catch (error) {
      console.error('Audio playback failed:', error);
      throw error;
    }
  }

  async speakText(
    text: string,
    voiceId?: string,
    settings?: Partial<VoiceSettings>
  ): Promise<void> {
    try {
      const audioBuffer = await this.generateSpeech(text, voiceId, settings);
      if (audioBuffer) {
        await this.playAudio(audioBuffer);
      } else {
        throw new Error('Failed to generate speech');
      }
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      throw error;
    }
  }

  private trackUsage(characterCount: number): void {
    const today = new Date().toDateString();
    const currentUsage = this.usageTracker.get(today) || 0;
    this.usageTracker.set(today, currentUsage + characterCount);
    
    // Save to localStorage for persistence
    localStorage.setItem('elevenlabs-usage', JSON.stringify(Object.fromEntries(this.usageTracker)));
  }

  getUsageStats(): { today: number; total: number; cost: number } {
    const today = new Date().toDateString();
    const todayUsage = this.usageTracker.get(today) || 0;
    const totalUsage = Array.from(this.usageTracker.values()).reduce((sum, usage) => sum + usage, 0);
    
    // ElevenLabs pricing: approximately $0.30 per 1K characters
    const cost = (totalUsage / 1000) * 0.30;
    
    return {
      today: todayUsage,
      total: totalUsage,
      cost
    };
  }

  async getAvailableVoices(): Promise<any[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.config.apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.voices || [];
      }
    } catch (error) {
      console.error('Failed to fetch voices:', error);
    }

    return [];
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  getDefaultVoice(): string {
    return this.config.defaultVoice;
  }
}

// Create singleton instance
const elevenLabsService = new ElevenLabsService();

// Export main functions for backward compatibility
export const generateSpeech = async (text: string, voiceId?: string) => {
  return elevenLabsService.generateSpeech(text, voiceId);
};

export const playAudio = async (audioBuffer: ArrayBuffer) => {
  return elevenLabsService.playAudio(audioBuffer);
};

export const speakAuraResponse = async (message: string, voiceId?: string) => {
  if (!elevenLabsService.isConfigured()) {
    console.warn('ElevenLabs not configured, skipping voice synthesis');
    return;
  }

  try {
    await elevenLabsService.speakText(message, voiceId);
  } catch (error) {
    console.error('Voice synthesis failed:', error);
    // Don't throw error to prevent breaking the main flow
  }
};

// Export service instance and types
export { elevenLabsService };
export type { VoiceSettings, ElevenLabsConfig };