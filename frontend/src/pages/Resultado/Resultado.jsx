import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './resultado-styles.css';

export default function Resultado() {
  const location = useLocation();
  const navigate = useNavigate();
  const { vencedor, perdedor, gifVitoria, jogador1, jogador2 } = location.state || {};
  
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [vencedor, perdedor]);

  const handleVoltarMenu = () => {
    navigate('/', { replace: true });
  };

  const handleSelecionarPersonagens = () => {
    const isAgainstCPU = perdedor.id === -1 || vencedor.id === -1;
    
    if (isAgainstCPU) {
      // MODO CPU: Jogador humano sempre como jogador1, CPU como jogador2
      const jogadorHumano = vencedor.id !== -1 ? vencedor : perdedor;
      
      navigate('/selecionar-personagem', {
        state: {
          modoJogo: 'singleplayer',
          jogadores: {
            jogador1: {
              id: jogadorHumano.id,
              nome: jogadorHumano.name || jogadorHumano.nome
            },
            jogador2: {
              id: -1,
              nome: 'CPU'
            }
          },
          manterJogadores: true
        }
      });
    } else {
      // MODO MULTIPLAYER: Manter a mesma ordem dos jogadores
      navigate('/selecionar-personagem', {
        state: {
          modoJogo: 'multiplayer',
          jogadores: {
            jogador1: {
              id: vencedor.id,
              nome: vencedor.name || vencedor.nome
            },
            jogador2: {
              id: perdedor.id,
              nome: perdedor.name || perdedor.nome
            }
          },
          manterJogadores: true
        }
      });
    }
  };

  const handleJogarNovamente = () => {
    // CORREÇÃO: Enviar jogador1 e jogador2 diretamente (não dentro de "jogadores")
    navigate('/batalha', {
      state: {
        jogador1: {
          id: vencedor.id,
          nome: vencedor.name || vencedor.nome,
          hero: {
            ...vencedor.hero,
            gifs: {
              entrada: vencedor.hero.gif_entrada || vencedor.hero.gifs?.entrada,
              especial: vencedor.hero.gif_ataque_especial || vencedor.hero.gifs?.especial,
              saida: vencedor.hero.gif_saida || vencedor.hero.gifs?.saida
            }
          }
        },
        jogador2: {
          id: perdedor.id,
          nome: perdedor.name || perdedor.nome,
          hero: {
            ...perdedor.hero,
            gifs: {
              entrada: perdedor.hero.gif_entrada || perdedor.hero.gifs?.entrada,
              especial: perdedor.hero.gif_ataque_especial || perdedor.hero.gifs?.especial,
              saida: perdedor.hero.gif_saida || perdedor.hero.gifs?.saida
            }
          }
        }
      }
    });
  };

  if (!vencedor) {
    return (
      <div className="result-container">
        <div className="result-content">
          <h1>Nenhum resultado disponível</h1>
          <button 
            onClick={() => navigate('/')}
            className="btn-main-menu"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const isAgainstCPU = perdedor.id === -1 || vencedor.id === -1;

  return (
    <div className="result-container">
      <div className="light-effect player-1-light"></div>
      <div className="light-effect player-2-light"></div>

      {showAnimation ? (
        <div className="victory-animation">
          <img 
            src={gifVitoria || vencedor.hero.gifs?.saida || vencedor.hero.gif_saida} 
            alt={`${vencedor.name || vencedor.nome} venceu`}
            className="victory-gif"
          />
          <div className="victory-overlay">
            <h2 className="victory-title pulse-animation">{vencedor.name || vencedor.nome} VENCEU!</h2>
          </div>
        </div>
      ) : (
        <div className="result-content">
          <div className="result-header">
            <h1 className="result-title">🏆 RESULTADO DA BATALHA 🏆</h1>
            <div className="game-mode-badge">
              {isAgainstCPU ? '👤 Jogador vs CPU 🖥️' : '👤 Jogador vs Jogador 👤'}
            </div>
          </div>

          <div className="winner-section">
            <div className="winner-card glow-effect">
              <div className="winner-info">
                <div className="winner-badge">
                  <span className="trophy-icon">🏆</span>
                  <h2 className="winner-name">{vencedor.name || vencedor.nome}</h2>
                </div>
                <p className="winner-subtitle">foi VITORIOSO com</p>
                <h3 className="winner-hero">{vencedor.hero.nome}</h3>
                
                <div className="winner-stats">
                  <div className="stat-item">
                    <span className="stat-icon">❤️</span>
                    <span className="stat-value">{vencedor.hero.vida_base || 100} HP</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">⚡</span>
                    <span className="stat-value">{vencedor.hero.velocidade || 50} SPD</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">🛡️</span>
                    <span className="stat-value">{vencedor.hero.defesa || 30} DEF</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">💪</span>
                    <span className="stat-value">{vencedor.hero.forca || 
                      Math.round((
                        (vencedor.hero.ataques?.basico?.dano || 15) +
                        (vencedor.hero.ataques?.rapido?.dano || 10) +
                        (vencedor.hero.ataques?.especial?.dano || 30)
                      ) / 3)} STR</span>
                  </div>
                </div>
              </div>
              
              <div className="winner-image-container">
                <img 
                  src={`/images/${vencedor.hero.nome.toLowerCase()}.jpg`} 
                  alt={vencedor.hero.nome}
                  className="winner-image"
                />
                <div className="winner-image-border"></div>
              </div>
            </div>
            
            <div className="versus-info">
              <p className="versus-text">
                Derrotou <strong>{perdedor.name || perdedor.nome}</strong> com <strong>{perdedor.hero.nome}</strong>
              </p>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              onClick={handleVoltarMenu}
              className="action-button menu-button"
            >
              🏠 Voltar ao Menu
            </button>
            
            <button 
              onClick={handleSelecionarPersonagens}
              className="action-button select-button"
            >
              🔄 Selecionar Novos Personagens
            </button>
            
            <button 
              onClick={handleJogarNovamente}
              className="action-button play-button"
              disabled={!vencedor}
            >
              ⚔️ Jogar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}