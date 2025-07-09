// routes/playerRoutes.js
import express from 'express';
import {
  createPlayer,
  getRanking,
} from '../controllers/playerController.js';

const router = express.Router();

// POST /api/jogadores - Cria jogador
router.post('/', createPlayer);

// GET /api/jogadores/ranking - Ranking por vitórias
router.get('/ranking', getRanking);

export default router;
