// routes/playerRoutes.js
import express from 'express';
import {
  createPlayer,
  getRanking,
  checkPlayerName,
} from '../controllers/playerController.js';

const router = express.Router();

// POST /api/jogadores - Cria jogador
router.post('/', createPlayer);

// GET /api/jogadores/ranking - Ranking por vitórias
router.get('/ranking', getRanking);

// GET /api/jogadores/check - Verifica se o nome do jogador existe
router.get('/check', checkPlayerName);

export default router;
