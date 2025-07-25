import Player from '../models/Player.js';
import Hero from '../models/Hero.js';

// Cria novo jogador com herói associado
export const createPlayer = async (req, res) => {
  const { nome } = req.body;
  
  try {
    const player = await Player.create({ 
      nome
    });
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: 'Falha ao criar jogador' });
  }
};

// Retorna ranking top 10 por vitórias
export const getRanking = async (req, res) => {
  try {
    const ranking = await Player.findAll({
      include: {
        model: Hero,
        attributes: ['nome']
      },
      order: [['vitorias', 'DESC']],
      limit: 10,
      attributes: ['id', 'nome', 'vitorias']
    });
    res.json(ranking);
  } catch (err) {
    res.status(500).json({ error: 'Falha ao carregar ranking' });
  }
};

// Simula batalha entre dois jogadores
export const fight = async (req, res) => {
  const { player1Id, player2Id } = req.body;

  try {
    // Busca ambos jogadores com seus heróis
    const [player1, player2] = await Promise.all([
      Player.findByPk(player1Id, { include: Hero }),
      Player.findByPk(player2Id, { include: Hero })
    ]);

    // Lógica simplificada de vitória (50% de chance para cada)
    const winner = Math.random() > 0.5 ? player1 : player2;
    const loser = winner === player1 ? player2 : player1;

    // Atualiza registros
    await Promise.all([
      winner.increment('vitorias'),
      loser.increment('derrotas')
    ]);

    res.json({ 
      winner: winner.nome,
      hero: winner.Hero.nome
    });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao processar batalha' });
  }
};