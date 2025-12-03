import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'  // Import tailwindcss

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      // 👇 CHANGED: Use the imported package here
      plugins: [tailwindcss()], 
    },
  },
})