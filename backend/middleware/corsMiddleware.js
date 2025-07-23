import cors from 'cors';

const allowedOrigins = [
    'https://game-show-frontend.onrender.com',
    'http://localhost:3000',
    'https://game-show-9x0p.onrender.com'
  ],
  const corsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem origem (como mobile apps ou curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acesso bloqueado por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

export default cors(corsOptions);