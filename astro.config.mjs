// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/three/')) {
              return 'three-core';
            }

            if (id.includes('@react-three/fiber')) {
              return 'r3f-vendor';
            }

            if (id.includes('@react-three/drei') || id.includes('three-stdlib')) {
              return 'drei-vendor';
            }

            if (id.includes('framer-motion')) {
              return 'motion-vendor';
            }
          },
        },
      },
    },
  },

  redirects: {
    '/about': '/zh-CN/about',
    '/projects': '/zh-CN/projects',
    '/friends': '/zh-CN/friends'
  },

  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'zh-TW', 'en'],
    routing: {
      prefixDefaultLocale: true,
      fallbackType: 'redirect',
    }
  }
});
