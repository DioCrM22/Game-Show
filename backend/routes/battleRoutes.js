import express from 'express';
import { 
  startBattle, 
  executeTurn, 
  getBattles, 
  resetBattles,
  getBattleStatus 
} from '../controllers/battleController.js';

const router = express.Router();

//POST /battles/start/Inicia uma nova batalha
router.post('/start', startBattle);

//@route POST /battles/turn/Executa uma ação na batalha
router.post('/turn', executeTurn);

//GET /battles/status/:battleId/ Obtém o status atual de uma batalha
router.get('/status/:battleId', getBattleStatus);

//GET /battlesLista o histórico de batalhas
router.get('/', getBattles);

//DELETE /battles/reset/Reseta o histórico de batalhas (apenas desenvolvimento)
router.delete('/reset', resetBattles);

export default router;
