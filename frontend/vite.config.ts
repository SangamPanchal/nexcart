import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://137.23.46.99',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
