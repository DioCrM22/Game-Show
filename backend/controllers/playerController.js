import Player from '../models/Player.js';
import Hero from '../models/Hero.js';

// Cria novo jogador com herói associado
export const createPlayer = async (req, res) => {
  try {
    const { nome, heroi_id } = req.body;

    // Validação simples para nome
    if (!nome || nome.trim() === "") {
      return res.status(400).json({
        success: false,
        error: 'O campo nome é obrigatório para criar um jogador.'
      });
    }

    // Se heroi_id for enviado, valida se existe
    if (heroi_id) {
      const hero = await Hero.findByPk(heroi_id);
      if (!hero) {
        return res.status(400).json({
          success: false,
          error: 'Herói informado não existe.'
        });
      }
    }

    const novoJogador = await Player.create({
      nome,
      heroi_id: heroi_id || null,
      vitorias: 0,
      derrotas: 0
    });

    res.status(201).json({ success: true, data: novoJogador });
  } catch (error) {
    console.error('Erro ao criar jogador:', error);
    res.status(500).json({ success: false, error: 'Erro interno ao criar jogador' });
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

// Verifica se o nome do jogador já existe
export const checkPlayerName = async (req, res) => {
  try {
    const { nome } = req.query;
    if (!nome) {
      return res.status(400).json({ success: false, error: 'Nome é obrigatório para verificação.' });
    }
    const player = await Player.findOne({ where: { nome: nome.trim() } });
    res.json({ success: true, existe: !!player });
  } catch (error) {
    console.error('Erro ao verificar nome do jogador:', error);
    res.status(500).json({ success: false, error: 'Erro interno ao verificar nome do jogador' });
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