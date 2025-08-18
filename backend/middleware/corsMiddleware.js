import cors from 'cors';

const allowedOrigins = [
  'https://game-show-frontend.onrender.com',
  'http://localhost:3000',
  'https://game-show-9x0p.onrender.com',
  'https://3000-ig57w7bg2tn87kzvv5z94-51b8f09b.manus.computer'
];

const corsOptions = {
  origin: (origin, callback) => {
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

// Exporte apenas uma vez, remova a linha duplicada
const corsMiddleware = cors(corsOptions);
export default corsMiddleware;