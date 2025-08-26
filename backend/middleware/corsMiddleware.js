import cors from 'cors';

const allowedOrigins = [
  'https://game-show-frontend.onrender.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://game-show-9x0p.onrender.com',
  'https://3000-ig57w7bg2tn87kzvv5z94-51b8f09b.manus.computer',
  'http://localhost:3001', // ← Para desenvolvimento
  undefined // ← Permite requisições sem origin (como Postman)
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log('🛡️ Origin recebida:', origin); // ← Debug
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('⚠️ Origin bloqueada por CORS:', origin);
      callback(new Error('Acesso bloqueado por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false // ← Importante!
};

const corsMiddleware = cors(corsOptions);

// Middleware adicional para logs
export default (req, res, next) => {
  console.log('🛡️ Requisição recebida:', req.method, req.url);
  corsMiddleware(req, res, next);
};