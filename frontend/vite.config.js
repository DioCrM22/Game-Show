import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Importe o módulo path

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: parseInt(process.env.PORT) || 3000,
    strictPort: true,
    allowedHosts: [
      'game-show-frontend.onrender.com',
      'localhost',
      'game-show-frontend',
      '127.0.0.1'
    ],
    hmr: {
      clientPort: 443
    }
  },
  preview: {
    host: true,
    port: parseInt(process.env.PORT) || 3000,
    allowedHosts: 'all'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // Exemplo de uso do path
    }
  }
});