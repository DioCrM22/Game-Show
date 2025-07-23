import React from 'react';
import './barradevida-styles.css';

const BarraDeVida = ({ vida, maxVida, cor = '#4CAF50', label }) => {
  // Garante que os valores sejam números e evita divisão por zero
  const vidaAtual = Number(vida) || 0;
  const vidaMaxima = Number(maxVida) || 1; // Evita divisão por zero
  
  const porcentagem = Math.min(100, Math.max(0, (vidaAtual / vidaMaxima) * 100));

  return (
    <div className="barra-de-vida-container">
      {label && <span className="barra-de-vida-label">{label}</span>}
      <div className="barra-de-vida-wrapper">
        <div 
          className="barra-de-vida-fill"
          style={{ 
            width: `${porcentagem}%`,
            backgroundColor: cor
          }}
        />
        <div className="barra-de-vida-text">
          {vidaAtual}/{vidaMaxima}
        </div>
      </div>
    </div>
  );
};

export default BarraDeVida;