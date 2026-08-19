import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Semasa development, hantar /api ke backend Express (port 5000)
      '/api': 'http://localhost:5000',
    },
  },
})
