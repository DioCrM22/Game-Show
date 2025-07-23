import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home-styles.css';

export default function Home() {
  const navigate = useNavigate();

      return (
        <div className="character-selection-container dark-theme">
          {/* Efeitos de luz */}
          <div className="light-effect player-1-light"></div>
          <div className="light-effect player-2-light"></div>

          {/* Conteúdo principal */}
          <div className="home-content">
      <div className="logo-wrapper">
        <div className="logo-container">
          <img 
            src="/images/logo.jpg" 
            alt="Game Show Logo" 
            className="game-logo"
          />
        </div>
        <h1 className="game-title">Game Show</h1>
      </div>

      <p className="game-description">O duelo épico de heróis que você esperava!</p>

      {/* Novo container para centralizar o botão */}
      <div className="button-container">
        <button 
          className="start-battle-button pulse-animation"
          onClick={() => navigate('/criar-jogador')}
        >
          ▶️ Começar Jogo
        </button>
      </div>
    </div>
    </div>
  );
}