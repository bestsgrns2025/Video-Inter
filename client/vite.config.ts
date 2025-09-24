import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,                // allow external connections
    port: 5000,               // match your Render PORT
    strictPort: true,          // fail if port is taken
    preview: {
      allowedHosts: ['video-interview-app-2.onrender.com'], // your Render domain
    },
  },
  build: {
    outDir: 'dist',            // default React build folder
  },
});
