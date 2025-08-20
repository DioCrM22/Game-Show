import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BarraDeVida from '../../componentes/BarraDeVida/BarraDeVida';
import './batalha-styles.css';

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
    battleOver: false
  });

  // Inicializa a batalha
  useEffect(() => {
    const initBattle = () => {
      try {
        console.log('Dados recebidos na batalha:', { jogador1, jogador2 });
        
        if (!jogador1 || !jogador1.hero || !jogador2 || !jogador2.hero) {
          throw new Error('Dados dos jogadores inválidos');
        }

        // Formatar jogador 1
        const player1 = {
          id: jogador1.id,
          name: jogador1.nome,
          hero: {
            ...jogador1.hero,
            vida_base: jogador1.hero.vida_base || 100,
            defesa: jogador1.hero.defesa || 10,
            velocidade: jogador1.hero.velocidade || 50,
            ataques: {
              basico: {
                nome: jogador1.hero.ataques?.basico?.nome || 'Ataque Básico',
                dano: jogador1.hero.ataques?.basico?.dano || 20,
                precisao: jogador1.hero.ataques?.basico?.precisao || 80
              },
              rapido: {
                nome: jogador1.hero.ataques?.rapido?.nome || 'Ataque Rápido',
                dano: jogador1.hero.ataques?.rapido?.dano || 15,
                precisao: jogador1.hero.ataques?.rapido?.precisao || 90
              },
              especial: {
                nome: jogador1.hero.ataques?.especial?.nome || 'Ataque Especial',
                dano: jogador1.hero.ataques?.especial?.dano || 30,
                precisao: jogador1.hero.ataques?.especial?.precisao || 100
              }
            },
            gifs: {
              entrada: jogador1.hero.gif_entrada || '/gifs/default/entrada.gif',
              especial: jogador1.hero.gif_ataque_especial || '/gifs/default/especial.gif',
              saida: jogador1.hero.gif_saida || '/gifs/default/saida.gif'
            }
          }
        };

        // Formatar jogador 2 (CPU ou jogador)
        const isCPU = jogador2.id === -1;
        const player2 = {
          id: jogador2.id,
          name: isCPU ? 'CPU' : jogador2.nome,
          hero: {
            ...jogador2.hero,
            vida_base: jogador2.hero.vida_base || 100,
            defesa: jogador2.hero.defesa || 10,
            velocidade: jogador2.hero.velocidade || 50,
            ataques: {
              basico: {
                nome: jogador2.hero.ataques?.basico?.nome || 'Ataque Básico',
                dano: jogador2.hero.ataques?.basico?.dano || 20,  // Adicionado
                precisao: jogador2.hero.ataques?.basico?.precisao || 80  // Adicionado
              },
              rapido: {
                nome: jogador2.hero.ataques?.rapido?.nome || 'Ataque Rápido',
                dano: jogador2.hero.ataques?.rapido?.dano || 15,  // Adicionado
                precisao: jogador2.hero.ataques?.rapido?.precisao || 90  // Adicionado
              },
              especial: {
                nome: jogador2.hero.ataques?.especial?.nome || 'Ataque Especial',
                dano: jogador2.hero.ataques?.especial?.dano || 30,  // Adicionado
                precisao: jogador2.hero.ataques?.especial?.precisao || 100  // Adicionado
              }
            },
            gifs: {
              entrada: jogador2.hero.gif_entrada || '/gifs/default/entrada.gif',
              especial: jogador2.hero.gif_ataque_especial || '/gifs/default/especial.gif',
              saida: jogador2.hero.gif_saida || '/gifs/default/saida.gif'
            }
          }
        };

        setBattleState({
          ...battleState,
          players: { player1, player2 },
          health: {
            p1: player1.hero.vida_base,
            p2: player2.hero.vida_base
          },
          isCPU,
          loading: false
        });

        playEntranceAnimations(player1, player2);
      } catch (error) {
        console.error('Erro ao iniciar batalha:', error);
        navigate('/selecionar-personagem');
      }
    };

    initBattle();
  }, [navigate, jogador1, jogador2]);

  // Turno da CPU
  useEffect(() => {
    if (battleState.isCPU && battleState.turn === 'player2' && !battleState.loading) {
      const timer = setTimeout(() => {
        const specialReady = battleState.specials.p2 >= 3;
        const attackType = determineCPUAttack(battleState.players.player2.hero, specialReady);
        
        if (attackType === 'special') {
          setBattleState(prev => ({
            ...prev,
            animation: battleState.players.player2.hero.gifs.especial,
            isSpecial: true,
            loading: true,
            message: `${battleState.players.player2.name} preparando ataque especial!`
          }));
        }
        
        setTimeout(() => {
          handleAttack(attackType, true);
        }, attackType === 'special' ? 1000 : 0);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [battleState.turn, battleState.loading, battleState.isCPU, battleState.specials.p2]);

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

  const determineCPUAttack = (cpuHero, specialReady) => {
    if (specialReady && Math.random() > 0.3) return 'special';
    return Math.random() > 0.6 ? 'basico' : 'rapido';
  };

  const handleAttack = (attackType, isPlayer2 = false) => {
    if (battleState.loading || battleState.battleOver) return;
    if ((!isPlayer2 && battleState.turn !== 'player1') || 
        (isPlayer2 && battleState.turn !== 'player2')) return;

    const attacker = battleState.players[isPlayer2 ? 'player2' : 'player1'];
    const defender = battleState.players[isPlayer2 ? 'player1' : 'player2'];
    const isSpecial = attackType === 'special';

    // Verificação de dados
    if (!attacker?.hero || !defender?.hero) {
      console.error('Dados do herói faltando!');
      return;
    }

    // Verifica especial
    if (isSpecial && battleState.specials[isPlayer2 ? 'p2' : 'p1'] < 3) {
      setBattleState(prev => ({ ...prev, 
        message: `${attacker.name} tentou usar especial mas não está pronto!`
      }));
      return;
    }

    // Configura estado - SOMENTE especial mostra animação
    setBattleState(prev => ({
      ...prev,
      animation: isSpecial ? attacker.hero.gifs.especial : null,
      isSpecial,
      loading: true,
      message: `${attacker.name} usou ${
      isSpecial ? attacker.hero.ataques.especial.nome :
      attackType === 'basico' ? attacker.hero.ataques.basico.nome : 
      attacker.hero.ataques.rapido.nome
    }!`
    }));

    // Executa o ataque após delay
    setTimeout(() => {
      // Obter dados do ataque com fallbacks
      const getAttackData = (type) => {
        const ataques = attacker.hero.ataques;
        
        switch(type) {
          case 'basico':
            return {
              damage: ataques.basico.dano,
              accuracy: ataques.basico.precisao
            };
          case 'rapido':
            return {
              damage: ataques.rapido.dano,
              accuracy: ataques.rapido.precisao
            };
          case 'special':
            return {
              damage: ataques.especial.dano,
              accuracy: ataques.especial.precisao
            };
          default:
            return {
              damage: 10,
              accuracy: 80
            };
        }
      };

      const { damage, accuracy } = getAttackData(attackType);
      const didHit = isSpecial || Math.random() * 100 <= accuracy;
      const defenseReduction = Math.min(0.5, (defender.hero.defesa || 10) / 200);
      const finalDamage = didHit ? Math.max(1, Math.floor(damage * (1 - defenseReduction))) : 0;

      setBattleState(prev => {
        const newHealth = {
          p1: isPlayer2 ? Math.max(0, prev.health.p1 - finalDamage) : prev.health.p1,
          p2: isPlayer2 ? prev.health.p2 : Math.max(0, prev.health.p2 - finalDamage)
        };

        const battleOver = newHealth.p1 <= 0 || newHealth.p2 <= 0;
        if (battleOver) {
          setTimeout(() => navigate('/resultado', { 
            state: {
              vencedor: newHealth.p1 > 0 ? prev.players.player1 : prev.players.player2,
              perdedor: newHealth.p1 > 0 ? prev.players.player2 : prev.players.player1,
              gifVitoria: (newHealth.p1 > 0 ? prev.players.player1 : prev.players.player2).hero.gifs.saida
            }
          }), 1000);
        }

        return {
          ...prev,
          message: didHit 
            ? `${attacker.name} causou ${finalDamage} de dano!` 
            : `${attacker.name} errou o ataque!`,
          health: newHealth,
          specials: {
            ...prev.specials,
            [isPlayer2 ? 'p2' : 'p1']: isSpecial ? 0 : Math.min(3, prev.specials[isPlayer2 ? 'p2' : 'p1'] + 1)
          },
          loading: false,
          battleOver,
          turn: battleOver ? null : isPlayer2 ? 'player1' : 'player2',
          animation: null,
          isSpecial: false
        };
      });
    }, isSpecial ? 2500 : 1500); 
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
          nome: vencedor.hero.nome, // Garantir que o nome do herói está incluído
          gifs: {
            saida: vencedor.hero.gifs.saida
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
            saida: perdedor.hero.gifs.saida
          }
        }
      },
      gifVitoria: vencedor.hero.gifs.saida,
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
                    <span className="attack-name">
                      {battleState.players.player1?.hero?.ataques.basico.nome || 'Ataque Básico'}
                    </span>
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
                    <span className="attack-name">
                      {battleState.players.player1?.hero?.ataques.rapido.nome || 'Ataque Rápido'}
                    </span>
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
                    <span className="attack-name">
                      {battleState.players.player1?.hero?.ataques.especial.nome || 'Especial'}
                    </span>
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
                        <span className="attack-name">
                          {battleState.players.player2?.hero?.ataques.basico.nome || 'Ataque Básico'}
                        </span>
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
                        <span className="attack-name">
                          {battleState.players.player2?.hero?.ataques.rapido.nome || 'Ataque Rápido'}
                        </span>
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
                        <span className="attack-name">
                          {battleState.players.player2?.hero?.ataques.especial.nome || 'Especial'}
                        </span>
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