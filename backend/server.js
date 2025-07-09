import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import setupAssociations from './models/associations.js'; // Importe as associações
import heroRoutes from './routes/heroRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import battleRoutes from './routes/battleRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
const app = express();
app.use(express.json());

// Rotas
app.use('/api/herois', heroRoutes);
app.use('/api/jogadores', playerRoutes);
app.use('/api/batalhas', battleRoutes);

app.get('/', (req, res) => res.send('🚀 API Game Show funcionando!'));

// Error handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    
    // Configura associações ANTES de sincronizar
    setupAssociations();
    
    await sequelize.sync({ 
      // force: true // Use apenas em desenvolvimento para recriar tabelas
    });
    
    console.log('✅ Banco de dados conectado e sincronizado!');
    app.listen(5000, () => {
      console.log('🛡️  Servidor rodando em http://localhost:5000');
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    process.exit(1); // Encerra o processo com falha
  }
};

startServer();