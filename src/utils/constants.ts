// Feature limits for free vs premium users
export const FEATURE_LIMITS = {
  FREE: {
    GENERATIONS_PER_DAY: 3,
    PROJECTS_TOTAL: 2,
    EXPORTS_PER_DAY: 1,
    VOICE_RESPONSES: true,
    BASIC_PALETTES: true,
    ADVANCED_PALETTES: false,
    PRIORITY_SUPPORT: false
  },
  PREMIUM: {
    GENERATIONS_PER_DAY: -1, // unlimited
    PROJECTS_TOTAL: -1, // unlimited
    EXPORTS_PER_DAY: -1, // unlimited
    VOICE_RESPONSES: true,
    BASIC_PALETTES: true,
    ADVANCED_PALETTES: true,
    PRIORITY_SUPPORT: true
  }
};

// Pricing tiers with fair, sustainable pricing
export const PRICING_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: {
      generations: 3,
      projects: 2,
      exports: 1,
      support: 'community'
    }
  },
  STARTER: {
    name: 'Starter',
    price: 9, // $9/month - affordable for freelancers
    features: {
      generations: 50,
      projects: -1, // unlimited
      exports: 10,
      support: 'email'
    }
  },
  PRO: {
    name: 'Pro',
    price: 29, // $29/month - reasonable for teams/agencies
    features: {
      generations: -1, // unlimited
      projects: -1, // unlimited
      exports: -1, // unlimited
      support: 'priority'
    }
  }
};

// Voice settings
export const VOICE_SETTINGS = {
  DEFAULT_VOICE_ID: 'pNInz6obpgDQGcFmaJgB', // Rachel voice
  ALTERNATIVE_VOICES: [
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli' }
  ],
  MODEL_ID: 'eleven_monolingual_v1'
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