import express from 'express';
import {
  getHeroGifs,
  getSpecialStatus,
  updateSpecialStatus
} from '../controllers/gameController.js';

const router = express.Router();

//GIFs de entrada, ataque normal, ataque especial e vitória
router.get('/hero/:id/gifs', getHeroGifs);

export default router;