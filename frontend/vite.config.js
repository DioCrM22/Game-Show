import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // ou '0.0.0.0' para expor em todos os endereços
    port: process.env.PORT || 3000, // Usa a porta do Render ou 3000 localmente
    strictPort: true // Fecha se a porta estiver em uso
  },
  preview: {
    port: process.env.PORT || 3000 // Configuração para o preview (build)
  }
});