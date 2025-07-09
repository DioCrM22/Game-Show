// middleware/validatePlayers.js
import Player from '../models/Player.js';
import Hero from '../models/Hero.js';

const validatePlayers = async (req, res, next) => {
  const { player1_id, player2_id } = req.body;

  try {
    const player1 = await Player.findByPk(player1_id, { include: Hero });
    const player2 = await Player.findByPk(player2_id, { include: Hero });

    if (!player1 || !player2) {
      return res.status(404).json({ message: 'Jogadores não encontrados.' });
    }

    if (!player1.Hero || !player2.Hero) {
      return res.status(400).json({ message: 'Jogadores não têm heróis atribuídos.' });
    }

    // Anexamos os jogadores já carregados para usar no controller
    req.jogador1 = player1;
    req.jogador2 = player2;

    next();
  } catch (error) {
    next(error);
  }
};

export default validatePlayers;
