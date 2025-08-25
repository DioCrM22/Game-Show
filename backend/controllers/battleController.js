// controllers/battleController.js
import Player from '../models/Player.js';
import Hero from '../models/Hero.js';
import Battle from '../models/Battle.js';

// Estado global das batalhas ativas
const activeBattles = new Map();

// Helper: Calcula chance de acerto considerando precisão e velocidade do defensor
const calculateHit = (attackerAccuracy, defenderSpeed) => {
  const baseHitChance = attackerAccuracy / 100;
  const dodgeChance = defenderSpeed / 400; // Velocidade reduz chance de acerto (0-25%)
  return Math.random() <= (baseHitChance - dodgeChance);
};

// Helper: Calcula dano com redução de defesa
const calculateDamage = (baseDamage, defenderDefense, isSpecial = false) => {
  const defenseReduction = isSpecial 
    ? defenderDefense / 400 // Especial ignora 75% da defesa
    : defenderDefense / 200; // Ataque normal reduz 50% da defesa
  
  return Math.max(1, Math.floor(baseDamage * (1 - defenseReduction)));
};

// Helper: Determina ataque da CPU
const determineCPUAttack = (cpuHero, specialAvailable) => {
  if (specialAvailable && Math.random() > 0.4) {
    return 'special';
  }
  return Math.random() > 0.5 ? 'basico' : 'rapido';
};

// Inicia uma nova batalha
export const startBattle = async (req, res) => {
  try {
    const { player1Id, player2Id } = req.body;

    // Busca jogador 1
    const player1 = await Player.findByPk(player1Id, { 
      include: { model: Hero, as: 'Hero' } 
    });

    if (!player1) {
      return res.status(404).json({ error: 'Jogador 1 não encontrado' });
    }

    let player2;
    let isCPU = false;

    // Verifica se é batalha contra CPU
    if (!player2Id || player2Id === -1) {
      isCPU = true;
      // Busca um herói aleatório para CPU ou usa default
      player2 = {
        id: -1,
        nome: 'CPU',
        Hero: await Hero.findOne({ 
          where: { nome: 'Warrior' } // Exemplo default
        }) || {
          id: -1,
          nome: 'CPU Warrior',
          vida_base: 100,
          defesa: 15,
          velocidade: 60,
          ataque_basico_dano: 18,
          ataque_basico_precisao: 75,
          ataque_rapido_dano: 12,
          ataque_rapido_precisao: 90,
          ataque_especial_dano: 35,
          ataque_especial_precisao: 100,
          gif_entrada: '/gifs/cpu/entrada.gif',
          gif_ataque_especial: '/gifs/cpu/especial.gif',
          gif_saida: '/gifs/cpu/saida.gif'
        }
      };
    } else {
      // Busca jogador 2 real
      player2 = await Player.findByPk(player2Id, { 
        include: { model: Hero, as: 'Hero' } 
      });

      if (!player2) {
        return res.status(404).json({ error: 'Jogador 2 não encontrado' });
      }
    }

    // Gera ID único para a batalha
    const battleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Dados da batalha
    const battleData = {
      player1: {
        id: player1.id,
        name: player1.nome,
        hero: {
          id: player1.Hero.id,
          nome: player1.Hero.nome,
          vida_base: player1.Hero.vida_base || 100,
          defesa: player1.Hero.defesa || 10,
          velocidade: player1.Hero.velocidade || 50,
          ataque_basico_dano: player1.Hero.ataque_basico_dano || 20,
          ataque_basico_precisao: player1.Hero.ataque_basico_precisao || 80,
          ataque_rapido_dano: player1.Hero.ataque_rapido_dano || 15,
          ataque_rapido_precisao: player1.Hero.ataque_rapido_precisao || 90,
          ataque_especial_dano: player1.Hero.ataque_especial_dano || 30,
          ataque_especial_precisao: player1.Hero.ataque_especial_precisao || 100,
          gif_entrada: player1.Hero.gif_entrada || '/gifs/default/entrada.gif',
          gif_ataque_especial: player1.Hero.gif_ataque_especial || '/gifs/default/especial.gif',
          gif_saida: player1.Hero.gif_saida || '/gifs/default/saida.gif'
        },
        attacks: 0
      },
      player2: {
        id: isCPU ? -1 : player2.id,
        name: isCPU ? 'CPU' : player2.nome,
        hero: {
          id: isCPU ? -1 : player2.Hero.id,
          nome: isCPU ? 'CPU Warrior' : player2.Hero.nome,
          vida_base: isCPU ? 100 : player2.Hero.vida_base || 100,
          defesa: isCPU ? 15 : player2.Hero.defesa || 10,
          velocidade: isCPU ? 60 : player2.Hero.velocidade || 50,
          ataque_basico_dano: isCPU ? 18 : player2.Hero.ataque_basico_dano || 20,
          ataque_basico_precisao: isCPU ? 75 : player2.Hero.ataque_basico_precisao || 80,
          ataque_rapido_dano: isCPU ? 12 : player2.Hero.ataque_rapido_dano || 15,
          ataque_rapido_precisao: isCPU ? 90 : player2.Hero.ataque_rapido_precisao || 90,
          ataque_especial_dano: isCPU ? 35 : player2.Hero.ataque_especial_dano || 30,
          ataque_especial_precisao: isCPU ? 100 : player2.Hero.ataque_especial_precisao || 100,
          gif_entrada: isCPU ? '/gifs/cpu/entrada.gif' : player2.Hero.gif_entrada || '/gifs/default/entrada.gif',
          gif_ataque_especial: isCPU ? '/gifs/cpu/especial.gif' : player2.Hero.gif_ataque_especial || '/gifs/default/especial.gif',
          gif_saida: isCPU ? '/gifs/cpu/saida.gif' : player2.Hero.gif_saida || '/gifs/default/saida.gif'
        },
        attacks: 0,
        isCPU
      },
      health: {
        p1: player1.Hero.vida_base || 100,
        p2: isCPU ? 100 : player2.Hero.vida_base || 100
      },
      specials: {
        p1: 0,
        p2: 0
      },
      currentTurn: 'player1',
      battleOver: false,
      rounds: 0,
      createdAt: Date.now(),
      isCPU
    };

    // Salva batalha ativa
    activeBattles.set(battleId, battleData);

    res.json({
      success: true,
      battleId,
      players: {
        player1: battleData.player1,
        player2: battleData.player2
      },
      health: battleData.health,
      specials: battleData.specials,
      currentTurn: battleData.currentTurn,
      message: 'Batalha iniciada com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao iniciar batalha:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor ao iniciar batalha' 
    });
  }
};

// Executa um turno de batalha
export const executeTurn = async (req, res) => {
  try {
    const { battleId, playerId, attackType } = req.body;

    if (!battleId || !playerId || !attackType) {
      return res.status(400).json({ 
        success: false,
        error: 'Dados incompletos: battleId, playerId e attackType são obrigatórios' 
      });
    }

    const battle = activeBattles.get(battleId);
    if (!battle) {
      return res.status(404).json({ 
        success: false,
        error: 'Batalha não encontrada' 
      });
    }

    if (battle.battleOver) {
      return res.status(400).json({ 
        success: false,
        error: 'Batalha já terminou' 
      });
    }

    // Identifica jogador e oponente
    const playerKey = battle.player1.id === playerId ? 'player1' : 'player2';
    const opponentKey = playerKey === 'player1' ? 'player2' : 'player1';

    if (battle.currentTurn !== playerKey) {
      return res.status(400).json({ 
        success: false,
        error: 'Não é seu turno' 
      });
    }

    const attacker = battle[playerKey];
    const defender = battle[opponentKey];

    // Verifica se ataque especial está disponível
    if (attackType === 'special' && battle.specials[playerKey === 'player1' ? 'p1' : 'p2'] < 3) {
      return res.status(400).json({ 
        success: false,
        error: 'Ataque especial não disponível. Use 3 ataques normais primeiro.',
        specials: battle.specials
      });
    }

    // Executa o ataque
    let result;
    switch (attackType) {
      case 'basico':
        result = executeBasicAttack(attacker, defender);
        break;
      case 'rapido':
        result = executeQuickAttack(attacker, defender);
        break;
      case 'special':
        result = executeSpecialAttack(attacker, defender);
        break;
      default:
        return res.status(400).json({ 
          success: false,
          error: 'Tipo de ataque inválido. Use: basico, rapido ou special' 
        });
    }

    // Aplica o dano
    battle.health[opponentKey === 'player1' ? 'p1' : 'p2'] -= result.damage;

    // Atualiza contadores de especial
    if (attackType === 'special') {
      battle.specials[playerKey === 'player1' ? 'p1' : 'p2'] = 0;
    } else {
      battle.specials[playerKey === 'player1' ? 'p1' : 'p2'] = 
        Math.min(3, battle.specials[playerKey === 'player1' ? 'p1' : 'p2'] + 1);
    }

    battle.rounds++;
    battle.battleOver = battle.health.p1 <= 0 || battle.health.p2 <= 0;

    // Prepara resposta
    const response = {
      success: true,
      damage: result.damage,
      message: result.message,
      animation: result.animation,
      health: { ...battle.health },
      specials: { ...battle.specials },
      battleOver: battle.battleOver,
      attackType,
      attacker: attacker.name,
      defender: defender.name
    };

    // Se batalha terminou, processa finalização
    if (battle.battleOver) {
      const winner = battle.health.p1 > 0 ? battle.player1 : battle.player2;
      const loser = battle.health.p1 > 0 ? battle.player2 : battle.player1;

      response.winner = winner;
      response.loser = loser;
      response.victoryAnimation = winner.hero.gif_saida;

      // Registra no banco de dados (apenas para jogadores reais)
      if (winner.id !== -1 && loser.id !== -1) {
        try {
          await Battle.create({
            player1_id: battle.player1.id,
            player2_id: battle.player2.id,
            vencedor_id: winner.id,
            player1_heroi: battle.player1.hero.nome,
            player2_heroi: battle.player2.hero.nome,
            rounds: battle.rounds,
            dano_total: winner.id === battle.player1.id 
              ? battle.player1.hero.vida_base - battle.health.p1
              : battle.player2.hero.vida_base - battle.health.p2
          });

          // Atualiza estatísticas dos jogadores
          await Player.increment('vitorias', { where: { id: winner.id } });
          await Player.increment('derrotas', { where: { id: loser.id } });
        } catch (dbError) {
          console.error('Erro ao salvar batalha no banco:', dbError);
        }
      }

      // Remove batalha da memória após 1 minuto
      setTimeout(() => activeBattles.delete(battleId), 60000);
    } else {
      // Próximo turno
      battle.currentTurn = opponentKey;
      response.nextTurn = opponentKey;
    }

    // Atualiza estado da batalha
    activeBattles.set(battleId, battle);

    res.json(response);

  } catch (error) {
    console.error('Erro ao executar turno:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor ao executar turno' 
    });
  }
};

// Funções de execução de ataques
const executeBasicAttack = (attacker, defender) => {
  const accuracy = attacker.hero.ataque_basico_precisao;
  const damage = attacker.hero.ataque_basico_dano;

  if (!calculateHit(accuracy, defender.hero.velocidade)) {
    return {
      damage: 0,
      message: `${attacker.name} errou o ataque básico!`,
      animation: null
    };
  }

  const finalDamage = calculateDamage(damage, defender.hero.defesa);
  
  return {
    damage: finalDamage,
    message: `${attacker.name} acertou um ataque básico! Causou ${finalDamage} de dano.`,
    animation: null
  };
};

const executeQuickAttack = (attacker, defender) => {
  const accuracy = attacker.hero.ataque_rapido_precisao;
  const damage = attacker.hero.ataque_rapido_dano;

  if (!calculateHit(accuracy, defender.hero.velocidade)) {
    return {
      damage: 0,
      message: `${attacker.name} errou o ataque rápido!`,
      animation: null
    };
  }

  const finalDamage = calculateDamage(damage, defender.hero.defesa);
  
  return {
    damage: finalDamage,
    message: `${attacker.name} acertou um ataque rápido! Causou ${finalDamage} de dano.`,
    animation: null
  };
};

const executeSpecialAttack = (attacker, defender) => {
  const accuracy = attacker.hero.ataque_especial_precisao;
  const damage = attacker.hero.ataque_especial_dano;

  // Ataque especial tem alta precisão mas pode ser esquivado
  if (!calculateHit(accuracy, defender.hero.velocidade)) {
    return {
      damage: 0,
      message: `${attacker.name} errou o ataque especial!`,
      animation: null
    };
  }

  const finalDamage = calculateDamage(damage, defender.hero.defesa, true);
  
  return {
    damage: finalDamage,
    message: `${attacker.name} acertou um ataque especial PODEROSO! Causou ${finalDamage} de dano.`,
    animation: attacker.hero.gif_ataque_especial
  };
};

// Retorna status atual da batalha
export const getBattleStatus = async (req, res) => {
  try {
    const { battleId } = req.params;

    if (!battleId) {
      return res.status(400).json({ 
        success: false,
        error: 'battleId é obrigatório' 
      });
    }

    const battle = activeBattles.get(battleId);
    if (!battle) {
      return res.status(404).json({ 
        success: false,
        error: 'Batalha não encontrada' 
      });
    }

    res.json({
      success: true,
      health: battle.health,
      specials: battle.specials,
      currentTurn: battle.currentTurn,
      battleOver: battle.battleOver,
      rounds: battle.rounds,
      players: {
        player1: battle.player1,
        player2: battle.player2
      }
    });

  } catch (error) {
    console.error('Erro ao buscar status da batalha:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno ao buscar status' 
    });
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
          attributes: ['id', 'nome']
        },
        {
          model: Player,
          as: 'Player2',
          attributes: ['id', 'nome']
        },
        {
          model: Player,
          as: 'Vencedor',
          attributes: ['id', 'nome']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json({
      success: true,
      battles,
      total: battles.length
    });

  } catch (error) {
    console.error('Erro ao buscar histórico de batalhas:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno ao buscar histórico' 
    });
  }
};

// Retorna batalhas ativas (apenas desenvolvimento)
export const getActiveBattles = async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ 
      success: false,
      error: 'Acesso permitido apenas em desenvolvimento' 
    });
  }

  try {
    const activeBattlesArray = Array.from(activeBattles.entries()).map(([id, battle]) => ({
      id,
      ...battle
    }));

    res.json({
      success: true,
      activeBattles: activeBattlesArray,
      total: activeBattlesArray.length
    });

  } catch (error) {
    console.error('Erro ao buscar batalhas ativas:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno ao buscar batalhas ativas' 
    });
  }
};

// Reseta batalhas (apenas desenvolvimento)
export const resetBattles = async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ 
      success: false,
      error: 'Operação permitida apenas em desenvolvimento' 
    });
  }

  try {
    activeBattles.clear();
    
    if (req.query.clearDatabase === 'true') {
      await Battle.destroy({ where: {} });
    }

    res.json({
      success: true,
      message: 'Batalhas resetadas com sucesso',
      clearedBattles: activeBattles.size
    });

  } catch (error) {
    console.error('Erro ao resetar batalhas:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno ao resetar batalhas' 
    });
  }
};

// Executa turno automático da CPU
export const executeCPUTurn = async (req, res) => {
  try {
    const { battleId } = req.body;

    if (!battleId) {
      return res.status(400).json({ 
        success: false,
        error: 'battleId é obrigatório' 
      });
    }

    const battle = activeBattles.get(battleId);
    if (!battle) {
      return res.status(404).json({ 
        success: false,
        error: 'Batalha não encontrada' 
      });
    }

    if (!battle.isCPU || battle.currentTurn !== 'player2' || battle.battleOver) {
      return res.status(400).json({ 
        success: false,
        error: 'Não é turno da CPU ou batalha já terminou' 
      });
    }

    // Determina ataque da CPU
    const specialAvailable = battle.specials.p2 >= 3;
    const attackType = determineCPUAttack(battle.player2.hero, specialAvailable);

    // Simula o corpo da requisição para executeTurn
    const turnRequest = {
      body: {
        battleId: battleId,
        playerId: battle.player2.id,
        attackType: attackType
      }
    };

    // Cria um objeto response simulado para capturar a resposta
    let responseData;
    const mockResponse = {
      json: (data) => {
        responseData = data;
        return mockResponse;
      },
      status: () => mockResponse
    };

    // Executa o turno da CPU chamando executeTurn diretamente
    await executeTurn(turnRequest, mockResponse);

    // Retorna a resposta para o frontend
    res.json(responseData);

  } catch (error) {
    console.error('Erro ao executar turno da CPU:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno ao executar turno da CPU' 
    });
  }
};