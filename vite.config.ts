import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Ensure environment variables are available
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  envDir: './',
  envPrefix: 'VITE_',
}));