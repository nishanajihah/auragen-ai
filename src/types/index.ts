export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ColorPalette {
  name: string;
  purpose?: string;
  colors: Array<{
    name: string;
    hex: string;
    rgb: string;
    hsl: string;
    description: string;
    usage: string;
  }>;
}

export interface FontPairing {
  heading: {
    name: string;
    googleFont: string;
    fallback: string;
    category: string;
    weights: number[];
    sizes: {
      h1: string;
      h2: string;
      h3: string;
      h4: string;
      h5: string;
      h6: string;
    };
  };
  body: {
    name: string;
    googleFont: string;
    fallback: string;
    category: string;
    weights: number[];
    sizes: {
      large: string;
      regular: string;
      small: string;
      caption: string;
    };
  };
}

export interface ComponentSuggestion {
  component: string;
  description: string;
  styling: string;
  category: 'navigation' | 'forms' | 'feedback' | 'layout' | 'interactive';
  states?: {
    default: string;
    hover?: string;
    focus?: string;
    active?: string;
    disabled?: string;
  };
}

export interface VisualInspiration {
  title: string;
  description: string;
  mood: string;
  colors: string[];
  elements: string[];
  useCases: string[];
  prompt: string;
}

export interface MoodboardData {
  vibeSummary: string;
  colorPalettes: ColorPalette[];
  fontPairing: FontPairing;
  visualInspiration: VisualInspiration[];
  componentSuggestions: ComponentSuggestion[];
  designPrinciples: {
    spacing: string;
    borderRadius: string;
    shadows: string;
    animations: string;
  };
}

export interface AuraGenResponse {
  message: string;
  moodboard?: MoodboardData;
  isComplete: boolean;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  moodboard: MoodboardData;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  userId?: string;
}

export interface FontSelectionRequest {
  currentFont: string;
  reason: string;
  preferences: {
    style: 'modern' | 'classic' | 'playful' | 'elegant' | 'bold' | 'minimal';
    category: 'serif' | 'sans-serif' | 'display' | 'monospace';
    mood: string;
  };
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  subscription_tier: 'free' | 'premium';
  usage_stats: {
    generations_today: number;
    projects_count: number;
    exports_today: number;
  };
}

export interface UsageLimit {
  feature: 'generation' | 'project' | 'export';
  limit: number;
  used: number;
  resetTime?: Date;
}