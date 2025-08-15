import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    // Handle client-side routing during development
    historyApiFallback: true,
  },
  preview: {
    // Handle client-side routing in preview mode
    historyApiFallback: true,
  },
});
