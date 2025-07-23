import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Equivalente a '0.0.0.0' + melhor compatibilidade
    port: parseInt(process.env.PORT) || 3000,
    strictPort: true,
    allowedHosts: [
      'game-show-frontend.onrender.com',
      'localhost',
      'game-show-frontend', // Nome do serviço no Render (sem .onrender.com)
      '127.0.0.1'
    ],
    hmr: {
      clientPort: 443 // Importante para HMR no Render
    }
  },
  preview: {
    host: true,
    port: parseInt(process.env.PORT) || 3000,
    allowedHosts: 'all' // Permite todos hosts no preview (produção)
  }
});