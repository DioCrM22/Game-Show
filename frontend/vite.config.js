import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,  // ✅ Porta fixa para desenvolvimento
    strictPort: false,  // ✅ Permite outras portas se 3000 estiver ocupada
    // REMOVA allowedHosts - não é necessário localmente
    hmr: {
      port: 3001  // ✅ Porta diferente para HMR
    }
  },
  preview: {
    port: 3000  // ✅ Porta simples para preview
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});