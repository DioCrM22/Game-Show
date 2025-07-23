import cors from 'cors';

export default cors({
  origin: [
    'https://game-show-frontend.onrender.com',
    'http://localhost:3000',
    'https://game-show-backend.onrender.com' // Seu backend no Render
  ],
  credentials: true
});