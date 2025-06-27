// Gemini API response caching service
interface CacheEntry {
  response: any;
  timestamp: number;
  expiresAt: number;
}

class GeminiCacheService {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_CACHE_SIZE = 100;

  private generateCacheKey(prompt: string, context?: string[]): string {
    const contextStr = context ? context.join('|') : '';
    return btoa(`${prompt}|${contextStr}`).replace(/[^a-zA-Z0-9]/g, '');
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiresAt;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
      }
    }

    // If still too large, remove oldest entries
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, this.cache.size - this.MAX_CACHE_SIZE);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  get(prompt: string, context?: string[]): any | null {
    const key = this.generateCacheKey(prompt, context);
    const entry = this.cache.get(key);

    if (!entry || this.isExpired(entry)) {
      if (entry) {
        this.cache.delete(key);
      }
      return null;
    }

    return entry.response;
  }

  set(prompt: string, response: any, context?: string[]): void {
    const key = this.generateCacheKey(prompt, context);
    const now = Date.now();

    this.cache.set(key, {
      response,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION
    });

    this.cleanup();
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; maxSize: number; hitRate?: number } {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE
    };
  }

  // Force refresh by clearing cache for specific prompt
  invalidate(prompt: string, context?: string[]): void {
    const key = this.generateCacheKey(prompt, context);
    this.cache.delete(key);
  }
}

export const geminiCache = new GeminiCacheService();