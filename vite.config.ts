/// <reference types="vitest/config" />
import { dirname, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
//import { configDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        changelog: resolve(__dirname, 'changelog/index.html'),
      }
    }
  },
  //Doing this allows index.html to link to .js and .css files correctly.
  base: './',
  test: {
    setupFiles: ['./tests/setup.ts']
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})