import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BarraDeVida from '../../componentes/BarraDeVida/BarraDeVida';
import './batalha-styles.css';

const API_BASE_URL = 'http://localhost:3001/api';

export default function Batalha() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jogador1, jogador2 } = location.state || {};

  const [battleState, setBattleState] = useState({
    animation: null,
    characterDisplay: {
      player1: null,
      player2: null
    },
    message: 'A batalha vai começar!',
    loading: true,
    turn: 'player1',
    players: {
      player1: null,
      player2: null
    },
    health: {
      p1: 100,
      p2: 100
    },
    specials: {
      p1: 0,
      p2: 0
    },
    isSpecial: false,
    battleOver: false,
    isCPU: false
  });

  const [currentBattleId, setCurrentBattleId] = useState(null);

  // Inicializa a batalha no backend
  useEffect(() => {
    const initBattle = async () => {
      try {
        console.log('Iniciando batalha no backend...', { jogador1, jogador2 });
        
        if (!jogador1 || !jogador1.hero) {
          throw new Error('Dados do jogador 1 inválidos');
        }

        const response = await fetch(`${API_BASE_URL}/battle/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            player1Id: jogador1.id,
            player2Id: jogador2.id === -1 ? null : jogador2.id
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao iniciar batalha');
        }

        console.log('Batalha iniciada no backend:', data);

        setCurrentBattleId(data.battleId);

        // Formatar jogadores para o estado local
        const player1 = {
          id: data.players.player1.id,
          name: data.players.player1.name,
          hero: {
            ...data.players.player1.hero,
            gifs: {
              entrada: data.players.player1.hero.gif_entrada,
              especial: data.players.player1.hero.gif_ataque_especial,
              saida: data.players.player1.hero.gif_saida
            }
          }
        };

        const player2 = {
          id: data.players.player2.id,
          name: data.players.player2.name,
          hero: {
            ...data.players.player2.hero,
            gifs: {
              entrada: data.players.player2.hero.gif_entrada,
              especial: data.players.player2.hero.gif_ataque_especial,
              saida: data.players.player2.hero.gif_saida
            }
          }
        };

        setBattleState(prev => ({
          ...prev,
          players: { player1, player2 },
          health: data.health,
          specials: data.specials,
          isCPU: data.players.player2.id === -1,
          loading: false
        }));

        playEntranceAnimations(player1, player2);

      } catch (error) {
        console.error('Erro ao iniciar batalha:', error);
        alert(`Erro ao iniciar batalha: ${error.message}`);
        navigate('/selecionar-personagem');
      }
    };

    if (jogador1 && jogador2) {
      initBattle();
    }
  }, [navigate, jogador1, jogador2]);

  // Turno da CPU
  useEffect(() => {
    if (battleState.isCPU && battleState.turn === 'player2' && !battleState.loading && currentBattleId) {
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/battle/cpu-turn`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              battleId: currentBattleId
            })
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Erro no turno da CPU');
          }

          // Atualiza estado com resultado da CPU
          processBattleResult(data, true);

        } catch (error) {
          console.error('Erro no turno da CPU:', error);
          setBattleState(prev => ({
            ...prev,
            message: 'Erro na CPU',
            loading: false
          }));
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [battleState.turn, battleState.loading, battleState.isCPU, currentBattleId]);

  const playEntranceAnimations = (player1, player2) => {
    // Animação de entrada do jogador 1
    setBattleState(prev => ({
      ...prev,
      characterDisplay: {
        player1: player1.hero.gifs.entrada,
        player2: null
      },
      animation: player1.hero.gifs.entrada,
      message: `${player1.name} entrou na batalha!`
    }));

    // Animação de entrada do jogador 2/CPU
    setTimeout(() => {
      setBattleState(prev => ({
        ...prev,
        characterDisplay: {
          player1: player1.hero.gifs.entrada,
          player2: player2.hero.gifs.entrada
        },
        animation: player2.hero.gifs.entrada,
        message: `${player2.name} entrou na batalha!`
      }));

      // Fim das animações de entrada
      setTimeout(() => {
        setBattleState(prev => ({
          ...prev,
          characterDisplay: {
            player1: `/images/${player1.hero.nome.toLowerCase()}.jpg`,
            player2: `/images/${player2.hero.nome.toLowerCase()}.jpg`
          },
          animation: null,
          message: `${player1.name} vs ${player2.name}!`,
          loading: false
        }));
      }, 2000);
    }, 2000);
  };

  const handleAttack = async (attackType, isPlayer2 = false) => {
    if (battleState.loading || battleState.battleOver || !currentBattleId) return;
    
    const playerId = isPlayer2 ? battleState.players.player2.id : battleState.players.player1.id;
    const attacker = battleState.players[isPlayer2 ? 'player2' : 'player1'];

    // Verificação de dados
    if (!attacker?.hero) {
      console.error('Dados do herói faltando!');
      return;
    }

    // Configura estado visual inicial
    const isSpecial = attackType === 'special';
    setBattleState(prev => ({
      ...prev,
      animation: isSpecial ? attacker.hero.gifs.especial : null,
      isSpecial,
      loading: true,
      message: `${attacker.name} usou ${getAttackName(attackType, attacker)}!`
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/battle/turn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          battleId: currentBattleId,
          playerId: playerId,
          attackType: attackType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao executar ataque');
      }

      processBattleResult(data, isPlayer2);

    } catch (error) {
      console.error('Erro ao executar ataque:', error);
      setBattleState(prev => ({
        ...prev,
        message: 'Erro de conexão',
        loading: false,
        animation: null,
        isSpecial: false
      }));
    }
  };

  const processBattleResult = (data, isPlayer2 = false) => {
    const attacker = battleState.players[isPlayer2 ? 'player2' : 'player1'];
    
    // Atualiza estado com resultado do backend
    setBattleState(prev => ({
      ...prev,
      health: {
        p1: data.health.p1,
        p2: data.health.p2
      },
      specials: data.specials,
      message: data.message,
      animation: data.animation || null,
      loading: false,
      battleOver: data.battleOver,
      turn: data.nextTurn || null,
      isSpecial: data.animation ? true : false
    }));

    // Se batalha terminou, navega para resultado
    if (data.battleOver && data.winner && data.loser) {
      setTimeout(() => {
        finalizarBatalha(data.winner, data.loser);
      }, 2000);
    }
  };

  const getAttackName = (attackType, attacker) => {
    switch(attackType) {
      case 'basico':
        return 'Ataque Básico';
      case 'rapido':
        return 'Ataque Rápido';
      case 'special':
        return 'Ataque Especial';
      default:
        return 'Ataque';
    }
  };

  // Listener de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (battleState.loading || battleState.battleOver) return;
      
      // Jogador 1
      if (battleState.turn === 'player1') {
        switch(e.key) {
          case 'ArrowLeft': 
            handleAttack('basico', false); 
            break;
          case 'ArrowRight': 
            handleAttack('rapido', false); 
            break;
          case 'ArrowUp': 
            handleAttack('special', false); 
            break;
          default: return;
        }
      }
      // Jogador 2 (se humano)
      else if (battleState.turn === 'player2' && !battleState.isCPU) {
        switch(e.key.toLowerCase()) {
          case 'a': 
            handleAttack('basico', true); 
            break;
          case 'd': 
            handleAttack('rapido', true); 
            break;
          case 'w': 
            handleAttack('special', true); 
            break;
          default: return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [battleState.turn, battleState.loading, battleState.battleOver, battleState.isCPU]);

  const finalizarBatalha = (vencedor, perdedor) => {
    navigate('/resultado', {
      state: {
        vencedor: {
          id: vencedor.id,
          name: vencedor.name,
          hero: {
            ...vencedor.hero,
            nome: vencedor.hero.nome,
            gifs: {
              saida: vencedor.hero.gif_saida
            }
          }
        },
        perdedor: {
          id: perdedor.id,
          name: perdedor.name,
          hero: {
            ...perdedor.hero,
            nome: perdedor.hero.nome,
            gifs: {
              saida: perdedor.hero.gif_saida
            }
          }
        },
        gifVitoria: vencedor.hero.gif_saida,
        jogador1: battleState.players.player1,
        jogador2: battleState.players.player2
      }
    });
  };

  return (
    <div className="batalha-container">
      <h1 className="titulo">⚔️ Batalha</h1>
      
      <div className="combat-area">
        {/* Jogador 1 */}
        <div className={`character player1 ${battleState.isSpecial ? 'dimmed' : ''}`}>
          <div className="character-image-container">
            {battleState.characterDisplay.player1 && (
              <img 
                src={battleState.characterDisplay.player1} 
                alt={battleState.players.player1?.name}
                className={`character-image ${battleState.turn === 'player1' ? 'active-turn' : ''}`}
              />
            )}
          </div>
          <h2>🎮 {battleState.players.player1?.name || 'Jogador 1'}</h2>
          
          <div className="health-bars">
            <div className="barra-label">❤️ Vida</div>
            <BarraDeVida 
              vida={Math.round(battleState.health.p1)} 
              maxVida={battleState.players.player1?.hero.vida_base || 100}
              cor="#4caf50"
            />
            <div className="barra-label">💥 Especial</div>
            <BarraDeVida 
              vida={battleState.specials.p1} 
              maxVida={3}
              cor="#2196f3"
            />
          </div>
          
          {battleState.turn === 'player1' && !battleState.loading && !battleState.battleOver && (
            <div className="attack-buttons">
              <button 
                onClick={() => handleAttack('basico', false)}
                className="attack-button basico"
              >
                <div className="attack-content">
                  <span className="attack-key">←</span>
                  <span className="attack-info">
                    <span className="attack-name">Ataque Básico</span>
                  </span>
                </div>
              </button>

              <button 
                onClick={() => handleAttack('rapido', false)}
                className="attack-button rapido"
              >
                <div className="attack-content">
                  <span className="attack-key">→</span>
                  <span className="attack-info">
                    <span className="attack-name">Ataque Rápido</span>
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleAttack('special', false)}
                disabled={battleState.specials.p1 < 3}
                className={`attack-button special ${battleState.specials.p1 < 3 ? 'disabled' : ''}`}
              >
                <div className="attack-content">
                  <span className="attack-key">↑</span>
                  <span className="attack-info">
                    <span className="attack-name">Especial</span>
                  </span>
                  <span className="special-required">{battleState.specials.p1}/3</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Área central */}
        <div className="animation-area">
          {battleState.animation && (
            <div className={`animation-wrapper ${battleState.isSpecial ? 'special-animation' : ''}`}>
              <img 
                src={battleState.animation} 
                alt="Ataque especial"
                className={`battle-animation ${battleState.isSpecial ? 'special-attack' : ''}`}
              />
              {battleState.isSpecial && (
                <>
                  <div className="glow-effect"></div>
                  <div className="special-overlay"></div>
                </>
              )}
            </div>
          )}
          <div className="battle-message">{battleState.message}</div>
          {battleState.battleOver && (
            <div className="battle-over-message">
              {battleState.health.p1 <= 0 ? 
                `${battleState.players.player2?.name} venceu!` : 
                `${battleState.players.player1?.name} venceu!`}
            </div>
          )}
        </div>

        {/* Jogador 2/CPU */}
        <div className={`character player2 ${battleState.isCPU ? 'cpu' : ''} ${battleState.isSpecial ? 'dimmed' : ''}`}>
          <div className="character-image-container">
            {battleState.characterDisplay.player2 && (
              <img 
                src={battleState.characterDisplay.player2} 
                alt={battleState.players.player2?.name}
                className={`character-image ${battleState.turn === 'player2' ? 'active-turn' : ''}`}
              />
            )}
          </div>
          <h2>🎮 {battleState.players.player2?.name || 'CPU'}</h2>
          
          <div className="health-bars">
            <div className="barra-label">❤️ Vida</div>
            <BarraDeVida 
              vida={Math.round(battleState.health.p2)} 
              maxVida={battleState.players.player2?.hero.vida_base || 100}
              cor="#4caf50"
            />
            <div className="barra-label">💥 Especial</div>
            <BarraDeVida 
              vida={battleState.specials.p2} 
              maxVida={3}
              cor="#2196f3"
            />
          </div>
          
          {battleState.turn === 'player2' && !battleState.loading && !battleState.battleOver && (
            <div className="attack-buttons">
              {!battleState.isCPU ? (
                <>
                  <button 
                    onClick={() => handleAttack('basico', true)}
                    className="attack-button basico"
                  >
                    <div className="attack-content">
                      <span className="attack-key">A</span>
                      <span className="attack-info">
                        <span className="attack-name">Ataque Básico</span>
                      </span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleAttack('rapido', true)}
                    className="attack-button rapido"
                  >
                    <div className="attack-content">
                      <span className="attack-key">D</span>
                      <span className="attack-info">
                        <span className="attack-name">Ataque Rápido</span>
                      </span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleAttack('special', true)}
                    disabled={battleState.specials.p2 < 3}
                    className={`attack-button special ${battleState.specials.p2 < 3 ? 'disabled' : ''}`}
                  >
                    <div className="attack-content">
                      <span className="attack-key">W</span>
                      <span className="attack-info">
                        <span className="attack-name">Especial</span>
                      </span>
                      <span className="special-required">{battleState.specials.p2}/3</span>
                    </div>
                  </button>
                </>
              ) : (
                <div className="waiting-message">
                  <p>Aguardando ação da CPU...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}