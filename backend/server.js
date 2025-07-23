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

// Middlewares devem vir ANTES das rotas
app.use(express.json());
app.use(corsMiddleware); // CORS deve ser o primeiro middleware

// Rotas
app.use('/api/herois', heroRoutes);
app.use('/api/jogadores', playerRoutes);
app.use('/api/batalhas', battleRoutes);

// Rota raiz
app.get('/', (req, res) => res.send('🚀 API Game Show funcionando!'));

// Error handler (deve ser o ÚLTIMO middleware)
app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    setupAssociations();
    
    await sequelize.sync({
      // force: true // Descomente apenas para desenvolvimento
    });
    
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || '0.0.0.0';
    
    console.log('✅ Banco de dados conectado e sincronizado!');
    app.listen(PORT, HOST, () => {
      console.log(`🛡️ Servidor rodando em http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();