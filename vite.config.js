import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Increase the chunk size warning limit (optional)
    chunkSizeWarningLimit: 1000, // Set to 1000 kB
    rollupOptions: {
      output: {
        // Manual chunk splitting for better optimization
        manualChunks: {
          // Split large dependencies into separate chunks
          react: ['react', 'react-dom'],
          lodash: ['lodash'],
          // Add other large dependencies here
        },
      },
    },
  },
  optimizeDeps: {
    // Optional: Include large dependencies for pre-bundling
    include: ['react', 'react-dom', 'lodash'],
  },
});