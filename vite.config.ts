import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        workbox: {
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        },
        manifest: {
          name: '旅遊行程與記帳助手',
          short_name: '旅遊行程',
          description: '多目的地旅遊行程與支出管理 (大阪京都 / 濟州島)',
          theme_color: '#000000',
          icons: [
            {
              src: 'https://cdn-icons-png.flaticon.com/512/3253/3253113.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'https://cdn-icons-png.flaticon.com/512/3253/3253113.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ],
          start_url: './',
          display: 'standalone',
          background_color: '#000000'
        }
      })
    ],
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
