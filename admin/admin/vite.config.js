import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; " +
        "img-src 'self' data: blob: http://localhost:4000 https://res.cloudinary.com; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "connect-src 'self' http://localhost:4000 ws://localhost:4000"
    }
  }
})
