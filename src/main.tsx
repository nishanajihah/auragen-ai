import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Performance measurement
const startTime = performance.now();

// Create root with error boundary
const rootElement = document.getElementById('root');

if (rootElement) {
  // Remove loading screen if present
  const loadingScreen = rootElement.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.remove();
  }

  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  // Log initial render time
  const renderTime = performance.now() - startTime;
  console.log(`Initial render time: ${renderTime.toFixed(2)}ms`);
}