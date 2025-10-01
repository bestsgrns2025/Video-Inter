import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow network access
  },
  preview: {
    allowedHosts: [
      'video-inter.onrender.com', // add your deployed host here
    ],
  },
});
