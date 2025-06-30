// Performance monitoring utilities
export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  resourceCount: number;
  resourceSize: number;
  jsExecutionTime: number;
}

// Initialize performance monitoring
export const initPerformanceMonitoring = (): void => {
  if (typeof window === 'undefined' || !window.performance) {
    console.warn('Performance API not supported');
    return;
  }

  // Mark navigation start
  try {
    window.performance.mark('app-start');
  } catch (e) {
    console.warn('Performance mark failed:', e);
  }

  // Listen for largest contentful paint
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        try {
          // Use proper options object for measure
          window.performance.measure('largest-contentful-paint', 'app-start');
        } catch (e) {
          console.warn('LCP measurement failed:', e);
        }
      }
    });
    
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.warn('LCP observation not supported', e);
  }

  // Listen for first input delay
  try {
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        try {
          window.performance.mark('first-input');
        } catch (e) {
          console.warn('FID mark failed:', e);
        }
      }
    });
    
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    console.warn('FID observation not supported', e);
  }

  // Mark when app is fully loaded
  window.addEventListener('load', () => {
    try {
      window.performance.mark('app-loaded');
      window.performance.measure('app-load-time', 'app-start', 'app-loaded');
    } catch (e) {
      console.warn('Load time measurement failed:', e);
    }
  });
};

// Get current performance metrics
export const getPerformanceMetrics = (): Partial<PerformanceMetrics> => {
  if (typeof window === 'undefined' || !window.performance) {
    return {};
  }

  const metrics: Partial<PerformanceMetrics> = {};
  
  try {
    // Navigation timing
    const navigationEntries = window.performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navTiming = navigationEntries[0] as PerformanceNavigationTiming;
      metrics.pageLoadTime = navTiming.loadEventEnd - navTiming.startTime;
    }
    
    // Resource timing
    const resources = window.performance.getEntriesByType('resource');
    metrics.resourceCount = resources.length;
    metrics.resourceSize = resources.reduce((total, resource) => {
      return total + ((resource as PerformanceResourceTiming).transferSize || 0);
    }, 0);
  } catch (e) {
    console.warn('Error collecting performance metrics:', e);
  }
  
  return metrics;
};

// Report performance metrics
export const reportPerformanceMetrics = (): void => {
  const metrics = getPerformanceMetrics();
  
  // In a real app, you'd send this to your analytics service
  console.log('Performance metrics:', metrics);
};