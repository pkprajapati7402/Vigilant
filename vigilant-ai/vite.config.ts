import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'https://bunny-particular-nuclear-wildlife.trycloudflare.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
