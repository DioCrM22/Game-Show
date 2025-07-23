// config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { parse } from 'pg-connection-string';

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Se estiver em produção (Render), faz o parsing da DATABASE_URL
  const config = parse(process.env.DATABASE_URL);
  sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // importante no Render
      },
    },
    logging: false,
  });
} else {
  // Se estiver rodando localmente
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
    }
  );
}

export default sequelize;
