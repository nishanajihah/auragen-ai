import { isDeveloper, getUserTier } from '../services/supabase';

export interface PlanLimits {
  generations: {
    daily: number;
    model: 'gemini-1.5-flash' | 'gemini-1.5-pro';
  };
  projects: {
    total: number;
  };
  exports: {
    daily: number;
  };
  voice: {
    enabled: boolean;
    charactersPerDay: number;
  };
  features: {
    advancedPalettes: boolean;
    prioritySupport: boolean;
    apiAccess: boolean;
    customBranding: boolean;
  };
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    generations: {
      daily: 5,
      model: 'gemini-1.5-flash'
    },
    projects: {
      total: 3
    },
    exports: {
      daily: 2
    },
    voice: {
      enabled: true,
      charactersPerDay: 1000
    },
    features: {
      advancedPalettes: false,
      prioritySupport: false,
      apiAccess: false,
      customBranding: false
    }
  },
  starter: {
    generations: {
      daily: 50,
      model: 'gemini-1.5-flash'
    },
    projects: {
      total: 10
    },
    exports: {
      daily: 15
    },
    voice: {
      enabled: true,
      charactersPerDay: 5000
    },
    features: {
      advancedPalettes: true,
      prioritySupport: false,
      apiAccess: false,
      customBranding: false
    }
  },
  pro: {
    generations: {
      daily: 200,
      model: 'gemini-1.5-pro'
    },
    projects: {
      total: -1 // unlimited
    },
    exports: {
      daily: 50
    },
    voice: {
      enabled: true,
      charactersPerDay: 20000
    },
    features: {
      advancedPalettes: true,
      prioritySupport: true,
      apiAccess: true,
      customBranding: true
    }
  },
  developer: {
    generations: {
      daily: -1, // unlimited
      model: 'gemini-1.5-pro'
    },
    projects: {
      total: -1 // unlimited
    },
    exports: {
      daily: -1 // unlimited
    },
    voice: {
      enabled: true,
      charactersPerDay: -1 // unlimited
    },
    features: {
      advancedPalettes: true,
      prioritySupport: true,
      apiAccess: true,
      customBranding: true
    }
  }
};

export const getUserPlanLimits = (user: any): PlanLimits => {
  const tier = getUserTier(user);
  return PLAN_LIMITS[tier] || PLAN_LIMITS.free;
};

export const checkFeatureAccess = (
  feature: keyof PlanLimits['features'],
  user: any
): boolean => {
  const limits = getUserPlanLimits(user);
  return limits.features[feature];
};

export const checkUsageLimit = (
  type: 'generations' | 'projects' | 'exports' | 'voice',
  currentUsage: number,
  user: any
): { allowed: boolean; limit: number; remaining: number } => {
  const limits = getUserPlanLimits(user);
  
  let limit: number;
  switch (type) {
    case 'generations':
      limit = limits.generations.daily;
      break;
    case 'projects':
      limit = limits.projects.total;
      break;
    case 'exports':
      limit = limits.exports.daily;
      break;
    case 'voice':
      limit = limits.voice.charactersPerDay;
      break;
    default:
      limit = 0;
  }

  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 };
  }

  const remaining = Math.max(0, limit - currentUsage);
  return {
    allowed: currentUsage < limit,
    limit,
    remaining
  };
};

export const getGeminiModel = (user: any): string => {
  const limits = getUserPlanLimits(user);
  return limits.generations.model;
};

export const canUseVoice = (user: any): boolean => {
  const limits = getUserPlanLimits(user);
  return limits.voice.enabled;
};

export const getPlanDisplayName = (tier: string): string => {
  const names = {
    free: 'Explorer',
    starter: 'Innovator', 
    pro: 'Visionary',
    developer: 'Developer'
  };
  return names[tier as keyof typeof names] || 'Explorer';
};

export const getPlanColor = (tier: string): string => {
  const colors = {
    free: 'from-blue-500 to-indigo-600',
    starter: 'from-green-500 to-emerald-600',
    pro: 'from-purple-500 to-pink-600',
    developer: 'from-orange-500 to-red-600'
  };
  return colors[tier as keyof typeof colors] || 'from-blue-500 to-indigo-600';
};