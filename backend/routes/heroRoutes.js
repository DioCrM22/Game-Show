// routes/heroRoutes.js
import express from 'express';
import { getAllHeroes, getRandomHero } from '../controllers/heroController.js';

const router = express.Router();

// GET /api/herois - Lista todos os heróis
router.get('/', getAllHeroes);

// GET /api/herois - Seleciona um herói aleatório
router.get('/random', getRandomHero);

export default router;
