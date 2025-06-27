// Analytics and tracking service
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp: Date;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private userId: string | null = null;

  setUserId(userId: string) {
    this.userId = userId;
  }

  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      userId: this.userId || undefined,
      timestamp: new Date()
    };

    this.events.push(analyticsEvent);
    
    // Store in localStorage for now (in production, send to analytics service)
    this.saveToStorage();
    
    console.log('Analytics Event:', analyticsEvent);
  }

  private saveToStorage() {
    try {
      const existingEvents = JSON.parse(localStorage.getItem('auragen-analytics') || '[]');
      const allEvents = [...existingEvents, ...this.events];
      
      // Keep only last 1000 events
      const recentEvents = allEvents.slice(-1000);
      localStorage.setItem('auragen-analytics', JSON.stringify(recentEvents));
      
      this.events = [];
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }

  // Predefined tracking methods
  trackSignUp(method: string) {
    this.track('user_signed_up', { method });
  }

  trackSignIn(method: string) {
    this.track('user_signed_in', { method });
  }

  trackGeneration(prompt: string, success: boolean) {
    this.track('ai_generation', { 
      prompt_length: prompt.length,
      success,
      timestamp: new Date().toISOString()
    });
  }

  trackProjectSave(projectName: string, tags: string[]) {
    this.track('project_saved', {
      project_name: projectName,
      tags_count: tags.length,
      tags
    });
  }

  trackProjectLoad(projectId: string) {
    this.track('project_loaded', { project_id: projectId });
  }

  trackExport(format: string, projectName?: string) {
    this.track('design_exported', {
      format,
      project_name: projectName
    });
  }

  trackPremiumUpgrade(plan: string) {
    this.track('premium_upgrade', { plan });
  }

  trackFeatureUsage(feature: string, context?: string) {
    this.track('feature_used', { feature, context });
  }

  trackError(error: string, context?: string) {
    this.track('error_occurred', { error, context });
  }

  // Get analytics summary
  getAnalyticsSummary() {
    try {
      const events = JSON.parse(localStorage.getItem('auragen-analytics') || '[]');
      const today = new Date().toDateString();
      
      const todayEvents = events.filter((e: AnalyticsEvent) => 
        new Date(e.timestamp).toDateString() === today
      );

      return {
        total_events: events.length,
        today_events: todayEvents.length,
        generations_today: todayEvents.filter((e: AnalyticsEvent) => e.event === 'ai_generation').length,
        projects_saved: events.filter((e: AnalyticsEvent) => e.event === 'project_saved').length,
        exports_today: todayEvents.filter((e: AnalyticsEvent) => e.event === 'design_exported').length
      };
    } catch (error) {
      console.error('Failed to get analytics summary:', error);
      return null;
    }
  }
}

export const analytics = new AnalyticsService();