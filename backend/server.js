import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import setupAssociations from './models/associations.js';
import heroRoutes from './routes/heroRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import battleRoutes from './routes/battleRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import corsMiddleware from './middleware/corsMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// ✅ CORS DEVE SER O PRIMEIRO MIDDLEWARE
app.use(corsMiddleware);

// ✅ Middleware para logs de todas as requisições
app.use((req, res, next) => {
  console.log('📥', req.method, req.url, '->', req.headers.origin);
  next();
});

// ✅ Middleware para OPTIONS (preflight)
app.options('*', corsMiddleware);

// ✅ Outros middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Rotas
app.use('/api/hero', heroRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/battle', battleRoutes);

// ✅ Rota de saúde
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: '🚀 API Game Show funcionando!',
    timestamp: new Date().toISOString()
  });
});

// ✅ Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: '🎮 Game Show API - Bem vindo!',
    version: '1.0.0',
    endpoints: {
      heroes: '/api/hero',
      players: '/api/players', 
      battle: '/api/battle'
    }
  });
});

// ✅ Error handler (ÚLTIMO middleware)
app.use(errorHandler);

// ✅ Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl 
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Banco de dados conectado!');
    
    setupAssociations();
    
    await sequelize.sync({
      // force: process.env.NODE_ENV === 'development' // Cuidado com force
      alter: true // ← Mais seguro que force
    });
    
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || '0.0.0.0';
    
    app.listen(PORT, HOST, () => {
      console.log(`\n🎉 Servidor rodando!`);
      console.log(`📍 Local: http://localhost:${PORT}`);
      console.log(`🌐 Network: http://${HOST}:${PORT}`);
      console.log(`🛡️ CORS habilitado para: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('❌ Erro crítico ao iniciar servidor:', error);
    process.exit(1);
  }
};

// ✅ Tratamento de sinais para shutdown graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Desligando servidor...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Desligando servidor...');
  await sequelize.close();
  process.exit(0);
});

startServer();