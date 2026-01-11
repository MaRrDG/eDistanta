import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'eDistanta',
        short_name: 'eDistanta',
        description: 'Planifica rutele tale cu cele mai bune preturi la combustibil din Romania.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'only_icon_transparent.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'only_icon_transparent.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  }
});
