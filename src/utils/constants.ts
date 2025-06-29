// Feature limits for free vs premium users
export const FEATURE_LIMITS = {
  FREE: {
    GENERATIONS_PER_DAY: 5,
    PROJECTS_TOTAL: 3,
    EXPORTS_PER_DAY: 2,
    VOICE_RESPONSES: true,
    BASIC_PALETTES: true,
    ADVANCED_PALETTES: false,
    PRIORITY_SUPPORT: false,
    AI_CONVERSATION_COST_LIMIT: 5.00 // $5 daily limit for AI conversations
  },
  PREMIUM: {
    GENERATIONS_PER_DAY: -1, // unlimited
    PROJECTS_TOTAL: -1, // unlimited
    EXPORTS_PER_DAY: -1, // unlimited
    VOICE_RESPONSES: true,
    BASIC_PALETTES: true,
    ADVANCED_PALETTES: true,
    PRIORITY_SUPPORT: true,
    AI_CONVERSATION_COST_LIMIT: 100.00 // $100 daily limit for AI conversations
  }
};

// Pricing tiers with fair, sustainable pricing
export const PRICING_TIERS = {
  FREE: {
    name: 'Explorer',
    price: 0,
    features: {
      generations: 5,
      projects: 3,
      exports: 2,
      support: 'community',
      aiConversations: '$5/day'
    }
  },
  STARTER: {
    name: 'Innovator',
    price: 9, // $9/month - affordable for freelancers
    features: {
      generations: 50,
      projects: -1, // unlimited
      exports: 15,
      support: 'email',
      aiConversations: '$25/day'
    }
  },
  PRO: {
    name: 'Visionary',
    price: 29, // $29/month - reasonable for teams/agencies
    features: {
      generations: -1, // unlimited
      projects: -1, // unlimited
      exports: -1, // unlimited
      support: 'priority',
      aiConversations: '$100/day'
    }
  }
};

// Voice settings
export const VOICE_SETTINGS = {
  DEFAULT_VOICE_ID: 'pNInz6obpgDQGcFmaJgB', // Rachel voice
  ALTERNATIVE_VOICES: [
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Warm and friendly' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Professional and clear' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Energetic and engaging' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Calm and reassuring' }
  ],
  MODEL_ID: 'eleven_monolingual_v1',
  DEFAULT_SETTINGS: {
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.0,
    use_speaker_boost: true
  }
};

// Design system presets
export const DESIGN_PRESETS = {
  MODERN_SAAS: {
    name: 'Modern SaaS',
    description: 'Clean, professional interface for business applications',
    colors: ['#3B82F6', '#FFFFFF', '#F8FAFC', '#1E293B', '#10B981'],
    fonts: { heading: 'Inter', body: 'Inter' }
  },
  CREATIVE_AGENCY: {
    name: 'Creative Agency',
    description: 'Bold, artistic design for creative professionals',
    colors: ['#8B5CF6', '#FEFEFE', '#F1F3F7', '#0F0F23', '#06B6D4'],
    fonts: { heading: 'Space Grotesk', body: 'Inter' }
  },
  E_COMMERCE: {
    name: 'E-Commerce',
    description: 'Trust-building design for online stores',
    colors: ['#059669', '#FFFFFF', '#F0FDF4', '#1F2937', '#F59E0B'],
    fonts: { heading: 'Poppins', body: 'Source Sans Pro' }
  },
  FINTECH: {
    name: 'FinTech',
    description: 'Secure and trustworthy financial interfaces',
    colors: ['#1E40AF', '#FFFFFF', '#F0F9FF', '#1F2937', '#059669'],
    fonts: { heading: 'Montserrat', body: 'Inter' }
  },
  HEALTHCARE: {
    name: 'Healthcare',
    description: 'Calming and accessible medical interfaces',
    colors: ['#0891B2', '#FFFFFF', '#F0FDFA', '#1F2937', '#10B981'],
    fonts: { heading: 'Source Sans Pro', body: 'Inter' }
  }
};

// Animation presets
export const ANIMATION_PRESETS = {
  SUBTLE: {
    duration: '200ms',
    easing: 'ease-in-out',
    scale: '1.02'
  },
  MODERATE: {
    duration: '300ms',
    easing: 'ease-out',
    scale: '1.05'
  },
  BOLD: {
    duration: '400ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    scale: '1.1'
  }
};

// Usage tracking constants
export const USAGE_TRACKING = {
  RESET_HOUR: 0, // Reset daily limits at midnight
  WARNING_THRESHOLD: 0.8, // Warn when 80% of limit is reached
  GRACE_PERIOD: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
};

// AI Conversation System Constants
export const AI_CONVERSATION = {
  GEMINI_COST_PER_1K_CHARS: 0.00025, // $0.00025 per 1K characters
  ELEVENLABS_COST_PER_1K_CHARS: 0.30, // $0.30 per 1K characters
  MAX_CONTEXT_MESSAGES: 10, // Maximum messages to include in context
  CACHE_DURATION: 30 * 60 * 1000, // 30 minutes cache duration
  MAX_CACHE_SIZE: 100, // Maximum cached responses
  RESPONSE_TIMEOUT: 30000, // 30 seconds timeout for API calls
  RETRY_ATTEMPTS: 3, // Number of retry attempts for failed requests
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute rate limit window
  MAX_REQUESTS_PER_MINUTE: {
    FREE: 10,
    PREMIUM: 60
  }
};

// Component Library Theme Constants
export const COMPONENT_THEMES = {
  COLORS: {
    primary: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
      950: '#422006',
    },
    dark: {
      50: '#18181b',
      100: '#27272a',
      200: '#3f3f46',
      300: '#52525b',
      400: '#71717a',
      500: '#a1a1aa',
      600: '#d4d4d8',
      700: '#e4e4e7',
      800: '#f4f4f5',
      900: '#fafafa',
    }
  },
  SPACING: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  BORDER_RADIUS: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem'
  },
  SHADOWS: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
  }
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Accessibility Constants
export const ACCESSIBILITY = {
  MIN_CONTRAST_RATIO: 4.5,
  MIN_TOUCH_TARGET_SIZE: 44, // pixels
  FOCUS_RING_WIDTH: 2, // pixels
  ANIMATION_DURATION_PREFERENCE: 'prefers-reduced-motion',
  SCREEN_READER_ONLY_CLASS: 'sr-only'
};

// Performance Constants
export const PERFORMANCE = {
  DEBOUNCE_DELAY: 300, // milliseconds
  THROTTLE_DELAY: 100, // milliseconds
  LAZY_LOAD_THRESHOLD: 100, // pixels
  IMAGE_OPTIMIZATION: {
    QUALITY: 85,
    FORMAT: 'webp',
    FALLBACK_FORMAT: 'jpg'
  }
};