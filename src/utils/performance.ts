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

  // Clear previous performance entries
  if (window.performance.clearMarks) {
    window.performance.clearMarks();
  }
  if (window.performance.clearMeasures) {
    window.performance.clearMeasures();
  }

  // Mark navigation start
  window.performance.mark('app-start');

  // Listen for largest contentful paint
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        // Use proper options object for measure
        window.performance.measure('largest-contentful-paint', {
          start: 'app-start',
          end: lastEntry.startTime
        });
        console.log('Largest Contentful Paint:', lastEntry.startTime);
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
        const firstInput = entries[0];
        // Use proper options object for measure
        window.performance.measure('first-input-delay', {
          start: firstInput.startTime,
          end: firstInput.processingStart
        });
        console.log('First Input Delay:', firstInput.processingStart - firstInput.startTime);
      }
    });
    
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    console.warn('FID observation not supported', e);
  }

  // Listen for layout shifts
  try {
    const clsObserver = new PerformanceObserver((entryList) => {
      let cumulativeLayoutShift = 0;
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          cumulativeLayoutShift += (entry as any).value;
        }
      }
      console.log('Cumulative Layout Shift:', cumulativeLayoutShift);
    });
    
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    console.warn('CLS observation not supported', e);
  }

  // Mark when app is fully loaded
  window.addEventListener('load', () => {
    window.performance.mark('app-loaded');
    window.performance.measure('app-load-time', 'app-start', 'app-loaded');
    
    const loadTimeMeasures = window.performance.getEntriesByName('app-load-time');
    if (loadTimeMeasures.length > 0) {
      const loadTime = loadTimeMeasures[0].duration;
      console.log('App Load Time:', loadTime);
    }
  });
};

// Get current performance metrics
export const getPerformanceMetrics = (): Partial<PerformanceMetrics> => {
  if (typeof window === 'undefined' || !window.performance) {
    return {};
  }

  const metrics: Partial<PerformanceMetrics> = {};
  
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
  
  // Custom measures
  const loadTimeMeasures = window.performance.getEntriesByName('app-load-time');
  if (loadTimeMeasures.length > 0) {
    metrics.pageLoadTime = loadTimeMeasures[0].duration;
  }
  
  const lcpMeasures = window.performance.getEntriesByName('largest-contentful-paint');
  if (lcpMeasures.length > 0) {
    metrics.largestContentfulPaint = lcpMeasures[0].duration;
  }
  
  const fidMeasures = window.performance.getEntriesByName('first-input-delay');
  if (fidMeasures.length > 0) {
    metrics.firstInputDelay = fidMeasures[0].duration;
  }
  
  return metrics;
};

// Report performance metrics
export const reportPerformanceMetrics = (): void => {
  const metrics = getPerformanceMetrics();
  
  // In a real app, you'd send this to your analytics service
  console.log('Performance metrics:', metrics);
  
  // Example threshold checks
  if (metrics.pageLoadTime && metrics.pageLoadTime > 3000) {
    console.warn('Page load time exceeds threshold:', metrics.pageLoadTime);
  }
  
  if (metrics.largestContentfulPaint && metrics.largestContentfulPaint > 2500) {
    console.warn('LCP exceeds threshold:', metrics.largestContentfulPaint);
  }
};

// Image optimization utilities
export const optimizeImage = (url: string, width: number, quality = 80): string => {
  // This is a placeholder - in a real app, you'd use an image optimization service
  if (!url) return url;
  
  // If already using an optimized service like Cloudinary, Imgix, etc.
  if (url.includes('images.pexels.com')) {
    // Pexels already provides optimized images with size parameters
    return url.includes('?') 
      ? `${url}&w=${width}&q=${quality}&auto=compress` 
      : `${url}?w=${width}&q=${quality}&auto=compress`;
  }
  
  return url;
};

// Prefetch critical resources
export const prefetchCriticalResources = (resources: string[]): void => {
  if (typeof document === 'undefined') return;
  
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    document.head.appendChild(link);
  });
};