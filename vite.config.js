import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ['lodash'], // Ensure lodash is correctly specified
        },
      },
    },
  },
});