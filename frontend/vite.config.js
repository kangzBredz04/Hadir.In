import {
  defineConfig
} from 'vite';

import react from '@vitejs/plugin-react';

import tailwindcss from '@tailwindcss/vite';

import {
  VitePWA
} from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),

    tailwindcss(),

    VitePWA({
      /*
       * Service worker otomatis
       * diperbarui ketika ada
       * deployment frontend baru.
       */
      registerType:
        'autoUpdate',

      /*
       * File yang ingin ikut
       * dimasukkan ke PWA.
       */
      includeAssets: [
        'favicon.ico',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'pwa-maskable-512x512.png'
      ],

      manifest: {
        name:
          'Hadir.In - Employee Attendance',

        short_name:
          'Hadir.In',

        description:
          'Sistem absensi karyawan berbasis foto dan lokasi.',

        start_url:
          '/',

        scope:
          '/',

        display:
          'standalone',

        orientation:
          'portrait',

        background_color:
          '#F5F8FB',

        theme_color:
          '#0067B1',

        lang:
          'id-ID',

        categories: [
          'business',
          'productivity'
        ],

        icons: [
          {
            src:
              '/pwa-192x192.png',

            sizes:
              '192x192',

            type:
              'image/png'
          },

          {
            src:
              '/pwa-512x512.png',

            sizes:
              '512x512',

            type:
              'image/png'
          },

          {
            src:
              '/pwa-maskable-512x512.png',

            sizes:
              '512x512',

            type:
              'image/png',

            purpose:
              'maskable'
          }
        ]
      },

      workbox: {
        /*
         * Hanya cache asset frontend.
         *
         * Jangan cache request API
         * attendance/auth.
         */
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'
        ],

        cleanupOutdatedCaches:
          true,

        navigateFallback:
          '/index.html'
      },

      devOptions: {
        /*
         * Untuk awal saya matikan
         * service worker saat dev.
         *
         * Test PWA sesungguhnya
         * lewat build/preview atau
         * Vercel production.
         */
        enabled:
          false
      }
    })
  ]
});