// import { ElevenLabsApi, ElevenLabsApiOptions } from 'elevenlabs';

// Commented out until dependency is installed manually
// const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
// let elevenlabs: ElevenLabsApi | null = null;

// Mock implementation for now
export const generateSpeech = async (text: string, voiceId: string = 'pNInz6obpgDQGcFmaJgB') => {
  console.log('Mock generateSpeech:', text, voiceId);
  return null;
};

export const playAudio = (audioBuffer: ArrayBuffer) => {
  console.log('Mock playAudio');
};

// Voice AI Integration for AuraGen AI
export const speakAuraResponse = async (message: string, voiceId?: string) => {
  console.log('Mock speakAuraResponse:', message, voiceId);
  // Mock implementation - just log for now
};