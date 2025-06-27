// Usage tracking and throttling service
interface UsageEntry {
  timestamp: number;
  userId: string;
  feature: string;
  success: boolean;
}

interface UsageLimits {
  free: {
    generations: { daily: number; hourly: number };
    exports: { daily: number; hourly: number };
    projects: { total: number };
  };
  premium: {
    generations: { daily: number; hourly: number };
    exports: { daily: number; hourly: number };
    projects: { total: number };
  };
}

class UsageTracker {
  private usage: UsageEntry[] = [];
  private readonly STORAGE_KEY = 'auragen-usage-tracking';
  
  private readonly limits: UsageLimits = {
    free: {
      generations: { daily: 10, hourly: 5 },
      exports: { daily: 3, hourly: 2 },
      projects: { total: 5 }
    },
    premium: {
      generations: { daily: -1, hourly: 50 }, // unlimited daily, but rate limited
      exports: { daily: -1, hourly: 20 },
      projects: { total: -1 }
    }
  };

  constructor() {
    this.loadUsage();
    this.cleanup();
  }

  private loadUsage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.usage = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load usage data:', error);
      this.usage = [];
    }
  }

  private saveUsage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usage));
    } catch (error) {
      console.error('Failed to save usage data:', error);
    }
  }

  private cleanup(): void {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    this.usage = this.usage.filter(entry => entry.timestamp > sevenDaysAgo);
    this.saveUsage();
  }

  private getUsageInPeriod(
    userId: string, 
    feature: string, 
    periodMs: number
  ): number {
    const cutoff = Date.now() - periodMs;
    return this.usage.filter(entry => 
      entry.userId === userId &&
      entry.feature === feature &&
      entry.timestamp > cutoff &&
      entry.success
    ).length;
  }

  checkRateLimit(
    userId: string, 
    feature: 'generation' | 'export' | 'project',
    isPremium: boolean = false
  ): { allowed: boolean; reason?: string; resetTime?: number } {
    const userLimits = isPremium ? this.limits.premium : this.limits.free;
    const featureLimits = userLimits[feature];

    // Check hourly limit
    const hourlyUsage = this.getUsageInPeriod(userId, feature, 60 * 60 * 1000);
    if (featureLimits.hourly !== -1 && hourlyUsage >= featureLimits.hourly) {
      const nextHour = new Date();
      nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
      return {
        allowed: false,
        reason: 'hourly_limit',
        resetTime: nextHour.getTime()
      };
    }

    // Check daily limit
    if ('daily' in featureLimits) {
      const dailyUsage = this.getUsageInPeriod(userId, feature, 24 * 60 * 60 * 1000);
      if (featureLimits.daily !== -1 && dailyUsage >= featureLimits.daily) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return {
          allowed: false,
          reason: 'daily_limit',
          resetTime: tomorrow.getTime()
        };
      }
    }

    // Check total limit for projects
    if (feature === 'project' && featureLimits.total !== -1) {
      const totalUsage = this.usage.filter(entry => 
        entry.userId === userId &&
        entry.feature === feature &&
        entry.success
      ).length;
      
      if (totalUsage >= featureLimits.total) {
        return {
          allowed: false,
          reason: 'total_limit'
        };
      }
    }

    return { allowed: true };
  }

  recordUsage(
    userId: string, 
    feature: 'generation' | 'export' | 'project',
    success: boolean = true
  ): void {
    this.usage.push({
      timestamp: Date.now(),
      userId,
      feature,
      success
    });

    this.saveUsage();
  }

  getUsageStats(userId: string, isPremium: boolean = false) {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const hourMs = 60 * 60 * 1000;

    const userLimits = isPremium ? this.limits.premium : this.limits.free;

    return {
      generations: {
        hourly: {
          used: this.getUsageInPeriod(userId, 'generation', hourMs),
          limit: userLimits.generations.hourly
        },
        daily: {
          used: this.getUsageInPeriod(userId, 'generation', dayMs),
          limit: userLimits.generations.daily
        }
      },
      exports: {
        hourly: {
          used: this.getUsageInPeriod(userId, 'export', hourMs),
          limit: userLimits.exports.hourly
        },
        daily: {
          used: this.getUsageInPeriod(userId, 'export', dayMs),
          limit: userLimits.exports.daily
        }
      },
      projects: {
        total: {
          used: this.usage.filter(entry => 
            entry.userId === userId &&
            entry.feature === 'project' &&
            entry.success
          ).length,
          limit: userLimits.projects.total
        }
      }
    };
  }

  // Get time until next reset
  getResetTime(type: 'hourly' | 'daily'): number {
    const now = new Date();
    
    if (type === 'hourly') {
      const nextHour = new Date(now);
      nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
      return nextHour.getTime();
    } else {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow.getTime();
    }
  }
}

export const usageTracker = new UsageTracker();