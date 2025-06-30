import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'formik',
      'yup'
    ]
  },
  define: {
    // Ensure environment variables are available
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  envDir: './',
  envPrefix: 'VITE_',
  build: {
    // Improve build performance
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production'
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'form-vendor': ['formik', 'yup'],
          'supabase-vendor': ['@supabase/supabase-js']
        }
      }
    },
    // Improve chunk loading
    chunkSizeWarningLimit: 1000,
    sourcemap: mode !== 'production'
  },
  server: {
    // Improve dev server performance
    hmr: {
      overlay: true
    },
    // Increase timeout for slow connections
    timeout: 120000
  }
}));