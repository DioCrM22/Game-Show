import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Equivalente a '0.0.0.0' + melhor compatibilidade
    port: parseInt(process.env.PORT) || 3000, // Conversão explícita para número
    strictPort: true,
    hmr: {
      clientPort: 443, // Importante para HMR no Render (usar 443 para HTTPS)
    }
  },
  preview: {
    port: parseInt(process.env.PORT) || 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV !== 'production'
  }
});