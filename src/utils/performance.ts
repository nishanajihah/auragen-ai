import { debounce } from './helpers';

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
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    window.performance.measure('largest-contentful-paint', 'app-start', lastEntry.startTime.toString());
    console.log('Largest Contentful Paint:', lastEntry.startTime);
  });

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.warn('LCP observation not supported', e);
  }

  // Listen for first input delay
  const fidObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const firstInput = entries[0];
    window.performance.measure('first-input-delay', 'app-start', firstInput.startTime.toString());
    console.log('First Input Delay:', firstInput.processingStart - firstInput.startTime);
  });

  try {
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    console.warn('FID observation not supported', e);
  }

  // Listen for layout shifts
  const clsObserver = new PerformanceObserver((entryList) => {
    let cumulativeLayoutShift = 0;
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        cumulativeLayoutShift += (entry as any).value;
      }
    }
    console.log('Cumulative Layout Shift:', cumulativeLayoutShift);
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    console.warn('CLS observation not supported', e);
  }

  // Mark when app is fully loaded
  window.addEventListener('load', () => {
    window.performance.mark('app-loaded');
    window.performance.measure('app-load-time', 'app-start', 'app-loaded');
    
    const loadTime = window.performance.getEntriesByName('app-load-time')[0].duration;
    console.log('App Load Time:', loadTime);
  });
};

// Get current performance metrics
export const getPerformanceMetrics = (): Partial<PerformanceMetrics> => {
  if (typeof window === 'undefined' || !window.performance) {
    return {};
  }

  const metrics: Partial<PerformanceMetrics> = {};
  
  // Navigation timing
  const navigationTiming = window.performance.timing;
  if (navigationTiming) {
    metrics.pageLoadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
  }
  
  // Resource timing
  const resources = window.performance.getEntriesByType('resource');
  metrics.resourceCount = resources.length;
  metrics.resourceSize = resources.reduce((total, resource) => total + (resource as any).transferSize || 0, 0);
  
  // Custom measures
  const loadTimeMeasure = window.performance.getEntriesByName('app-load-time')[0];
  if (loadTimeMeasure) {
    metrics.pageLoadTime = loadTimeMeasure.duration;
  }
  
  const lcpMeasure = window.performance.getEntriesByName('largest-contentful-paint')[0];
  if (lcpMeasure) {
    metrics.largestContentfulPaint = lcpMeasure.duration;
  }
  
  const fidMeasure = window.performance.getEntriesByName('first-input-delay')[0];
  if (fidMeasure) {
    metrics.firstInputDelay = fidMeasure.duration;
  }
  
  return metrics;
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

// Lazy loading utilities
export const lazyLoadImage = (imageElement: HTMLImageElement, src: string): void => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        imageElement.src = src;
        observer.unobserve(imageElement);
      }
    });
  }, { rootMargin: '200px' });
  
  observer.observe(imageElement);
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

// Debounced window resize handler
export const handleResize = debounce(() => {
  // Update responsive elements
  console.log('Window resized:', window.innerWidth, window.innerHeight);
}, 200);

// Track and report performance metrics
export const reportPerformanceMetrics = debounce(() => {
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
}, 5000);