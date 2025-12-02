import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.htm'),
        tools: resolve(__dirname, 'tools.html'),
        about: resolve(__dirname, 'about.html'),
        'tool_details': resolve(__dirname, 'tool-details.html')
      },
    },
  },

  root: resolve(__dirname)
})
