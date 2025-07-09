import Player from '../models/Player.js';
import Hero from '../models/Hero.js';
import Battle from '../models/Battle.js';

// Estado global da batalha (melhorado para suportar múltiplas batalhas)
const activeBattles = new Map();

// Helper: Calcula chance de esquiva baseada na velocidade (0-100%)
const calculateDodge = (speed) => Math.random() < speed / 200;

// Helper: Calcula dano reduzido pela defesa
const calculateDamage = (attack, defense) => Math.max(0, Math.floor(attack * (1 - defense / 100)));

// Helper: Executa um ataque completo
const executeAttack = (type, attacker, defender) => {
  const attackField = type === 'special' ? 'ataque_especial' : `ataque${type}`;
  
  // Verifica acerto baseado na precisão
  const accuracy = attacker[`${attackField}_precisao`];
  if (Math.random() * 100 > accuracy) {
    return { 
      damage: 0, 
      message: `${attacker.nome} errou o ataque!`,
      animation: null
    };
  }

  // Verifica esquiva
  if (calculateDodge(defender.velocidade)) {
    return { 
      damage: 0, 
      message: `${defender.nome} esquivou do ataque!`,
      animation: null
    };
  }

  // Calcula dano
  const baseDamage = attacker[`${attackField}_dano`];
  const finalDamage = type === 'special' 
    ? baseDamage 
    : calculateDamage(baseDamage, defender.defesa);

  return {
    damage: finalDamage,
    message: type === 'special' 
      ? `${attacker.nome} acertou um ataque especial! (${finalDamage} de dano)` 
      : `${attacker.nome} acertou um ataque normal. (${finalDamage} de dano)`,
    animation: type === 'special' ? attacker.gif_ataque_especial : null
  };
};

// Inicia uma nova batalha
export const startBattle = async (req, res) => {
  const { player1Id, player2Id } = req.body;

  try {
    const [player1, player2] = await Promise.all([
      Player.findByPk(player1Id, { include: Hero }),
      Player.findByPk(player2Id, { include: Hero })
    ]);

    if (!player1 || !player2) {
      return res.status(404).json({ error: 'Jogador(es) não encontrado(s)' });
    }

    const battleId = `battle_${Date.now()}`;
    activeBattles.set(battleId, {
      player1: { 
        id: player1Id,
        attacks: 0,
        specialReady: false,
        hero: player1.Hero
      },
      player2: { 
        id: player2Id,
        attacks: 0,
        specialReady: false,
        hero: player2.Hero 
      },
      health: {
        p1: player1.Hero.vida_base,
        p2: player2.Hero.vida_base
      },
      rounds: 0
    });

    res.json({
      battleId,
      animations: {
        player1: player1.Hero.gif_entrada,
        player2: player2.Hero.gif_entrada
      },
      message: 'Batalha iniciada!'
    });

  } catch (err) {
    console.error('Erro ao iniciar batalha:', err);
    res.status(500).json({ error: 'Erro ao iniciar batalha' });
  }
};

// Executa um turno de batalha
export const executeTurn = async (req, res) => {
  const { battleId, playerId, attackType } = req.body;

  try {
    const battle = activeBattles.get(battleId);
    if (!battle) {
      return res.status(404).json({ error: 'Batalha não encontrada' });
    }

    const playerKey = battle.player1.id === playerId ? 'player1' : 'player2';
    const opponentKey = playerKey === 'player1' ? 'player2' : 'player1';

    // Verifica se o ataque especial está disponível
    if (attackType === 'special' && !battle[playerKey].specialReady) {
      return res.status(400).json({ 
        error: 'Ataque especial não disponível',
        specialReady: false
      });
    }

    // Executa o ataque
    const result = executeAttack(
      attackType,
      battle[playerKey].hero,
      battle[opponentKey].hero
    );

    // Aplica o dano
    battle.health[opponentKey === 'player1' ? 'p1' : 'p2'] -= result.damage;
    battle.rounds++;

    // Atualiza contador de ataques
    if (attackType === 'normal') {
      battle[playerKey].attacks++;
      if (battle[playerKey].attacks >= 3) {
        battle[playerKey].specialReady = true;
      }
    } else {
      battle[playerKey].attacks = 0;
      battle[playerKey].specialReady = false;
    }

    // Verifica se a batalha terminou
    const battleOver = battle.health.p1 <= 0 || battle.health.p2 <= 0;
    let winner = null;

    if (battleOver) {
      winner = battle.health.p1 > battle.health.p2 ? battle.player1 : battle.player2;
      
      // Registra a batalha no banco de dados
      await Battle.create({
        player1_id: battle.player1.id,
        player2_id: battle.player2.id,
        vencedor_id: winner.id,
        player1_heroi: battle.player1.hero.nome,
        player2_heroi: battle.player2.hero.nome,
        rounds: battle.rounds,
        dano_total: battle.health.p1 > battle.health.p2 
          ? battle.player1.hero.vida_base - battle.health.p1
          : battle.player2.hero.vida_base - battle.health.p2
      });

      // Atualiza estatísticas dos jogadores
      await Promise.all([
        Player.increment('vitorias', { where: { id: winner.id } }),
        Player.increment('derrotas', { 
          where: { id: winner.id === battle.player1.id ? battle.player2.id : battle.player1.id }
        })
      ]);

      // Remove a batalha da memória
      activeBattles.delete(battleId);
    }

    res.json({
      ...result,
      battleOver,
      winner: battleOver ? {
        id: winner.id,
        name: winner.hero.nome,
        victoryAnimation: winner.hero.gif_vitoria
      } : null,
      health: {
        player1: Math.max(0, battle.health.p1),
        player2: Math.max(0, battle.health.p2)
      },
      specialStatus: {
        player1: battle.player1.specialReady,
        player2: battle.player2.specialReady,
        remainingAttacks: 3 - battle[playerKey].attacks
      },
      currentRound: battle.rounds
    });

  } catch (err) {
    console.error('Erro no turno:', err);
    res.status(500).json({ error: 'Erro ao processar turno' });
  }
};

// Retorna histórico de batalhas
export const getBattles = async (req, res) => {
  try {
    const battles = await Battle.findAll({
      include: [
        { 
          model: Player, 
          as: 'Player1',
          attributes: ['id', 'nome'],
          include: [{ model: Hero, attributes: ['nome'] }]
        },
        {
          model: Player,
          as: 'Player2',
          attributes: ['id', 'nome'],
          include: [{ model: Hero, attributes: ['nome'] }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    res.json(battles);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({ error: 'Erro ao carregar histórico de batalhas' });
  }
};

// Reseta o histórico (apenas desenvolvimento)
export const resetBattles = async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'Operação não permitida em produção' });
  }

  try {
    await Battle.destroy({ where: {}, truncate: true });
    activeBattles.clear();
    res.json({ message: 'Histórico de batalhas resetado' });
  } catch (err) {
    console.error('Erro ao resetar:', err);
    res.status(500).json({ error: 'Erro ao resetar histórico' });
  }
};

// função para verificar status da batalha
export const getBattleStatus = async (req, res) => {
  try {
    const battle = activeBattles.get(req.params.battleId);
    if (!battle) {
      return res.status(404).json({ error: 'Batalha não encontrada' });
    }

    res.json({
      health: {
        player1: battle.health.p1,
        player2: battle.health.p2
      },
      specialStatus: {
        player1: battle.player1.specialReady,
        player2: battle.player2.specialReady,
        remainingAttacks: 3 - battle.player1.attacks // Para mostrar progresso no front
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar status' });
  }
};