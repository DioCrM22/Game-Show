import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './resultado-styles.css';

export default function Resultado() {
  const location = useLocation();
  const navigate = useNavigate();
  const { vencedor, perdedor, gifVitoria } = location.state || {};
  
  const [historicoBatalhas, setHistoricoBatalhas] = useState([]);
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
  const carregarHistorico = async () => {
      const data = await response.json();
      
      const historicoFormatado = data.map(batalha => ({
        id: batalha.id,
        jogador1: { 
          nome: batalha.Player1?.nome || 'CPU', 
          heroi: { nome: batalha.player1_hero } 
        },
        jogador2: { 
          nome: batalha.Player2?.nome || 'CPU', 
          heroi: { nome: batalha.player2_hero } 
        },
        vencedor: batalha.Player1?.id === batalha.winner_id 
          ? batalha.Player1.nome 
          : (batalha.Player2?.id === batalha.winner_id ? batalha.Player2.nome : 'CPU'),
        data: new Date(batalha.createdAt).toLocaleString(),
        rounds: batalha.rounds
      }));
  };

  const timer = setTimeout(() => {
    setShowAnimation(false);
  }, 3500);

  return () => clearTimeout(timer);
}, [vencedor, perdedor]);

  const handleVoltarMenu = () => {
  setHistoricoBatalhas([]);
  navigate('/', { replace: true });
};

  const handleSelecionarPersonagens = () => {
  // Verifica se o jogo era contra a CPU (quando um dos jogadores tem ID -1)
  const isAgainstCPU = perdedor.id === -1 || vencedor.id === -1;
  
  navigate('/selecionar-personagem', {
    state: {
      ...location.state,
      jogador1: {
        id: vencedor.id === -1 ? perdedor.id : vencedor.id,
        nome: vencedor.id === -1 ? perdedor.name : vencedor.name
      },
      jogador2: {
        id: isAgainstCPU ? -1 : perdedor.id,
        nome: isAgainstCPU ? 'CPU' : perdedor.name
      },
      // Mantém o modo de jogo baseado na presença da CPU
      modoJogo: isAgainstCPU ? 'singleplayer' : 'multiplayer',
      // Indica que deve manter os jogadores
      manterJogadores: true
    }
  });
};

  const handleJogarNovamente = () => {
  navigate('/batalha', {
    state: {
      jogador1: {
        id: vencedor.id,
        nome: vencedor.name,
        hero: {
          ...vencedor.hero,
          gifs: {
            entrada: vencedor.hero.gif_entrada,
            especial: vencedor.hero.gif_ataque_especial,
            saida: vencedor.hero.gif_saida
          }
        }
      },
      jogador2: {
        id: perdedor.id,
        nome: perdedor.name,
        hero: {
          ...perdedor.hero,
          gifs: {
            entrada: perdedor.hero.gif_entrada,
            especial: perdedor.hero.gif_ataque_especial,
            saida: perdedor.hero.gif_saida
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

  return (
    <div className="result-container">
      {/* Efeitos de luz */}
      <div className="light-effect player-1-light"></div>
      <div className="light-effect player-2-light"></div>

      {showAnimation ? (
        <div className="victory-animation">
          <img 
            src={gifVitoria || vencedor.hero.gifs.saida} 
            alt={`${vencedor.name} venceu`}
            className="victory-gif"
          />
          <div className="victory-overlay">
            <h2 className="victory-title pulse-animation">{vencedor.name} VENCEU!</h2>
          </div>
        </div>
      ) : (
        <div className="result-content">
          {/* Cabeçalho */}
          <div className="result-header">
            <h1 className="result-title">🏆 RESULTADO DA BATALHA 🏆</h1>
            <div className="game-mode-badge">{vencedor.id === -1 || perdedor.id === -1 ? '👤 Jogador vs CPU 🖥️' : '👤 Jogador vs Jogador 👤'}</div>
          </div>

          {/* Card do Vencedor */}
          <div className="winner-section">
            <div className="winner-card glow-effect">
              <div className="winner-info">
                <div className="winner-badge">
                  <span className="trophy-icon">🏆</span>
                  <h2 className="winner-name">{vencedor.name}</h2>
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
                Derrotou <strong>{perdedor.name}</strong> com <strong>{perdedor.hero.nome}</strong> em <strong>{historicoBatalhas[0]?.rounds || 5}</strong> rodadas
              </p>
            </div>
          </div>
          
          {/* Botões de Ação */}
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
              ✅ Selecionar Personagens
            </button>
            
            <button 
              onClick={handleJogarNovamente}
              className="action-button play-button"
              disabled={!vencedor}
            >
              🔄 Jogar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}