import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // In production build (GitHub Actions / Pages), use '/food.io/'. In local dev (npm run dev), use '/'
  base: command === 'build' ? '/food.io/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
}))


