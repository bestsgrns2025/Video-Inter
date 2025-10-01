
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['new-video-2.onrender.com'], // ✅ Allow Render domain
    host: '0.0.0.0',                            // ✅ Bind to all interfaces
    port: process.env.PORT || 4173              // ✅ Use Render's PORT
  }
})
