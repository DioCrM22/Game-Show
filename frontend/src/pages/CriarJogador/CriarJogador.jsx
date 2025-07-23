import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import './criarJogador-styles.css';

export default function CriarJogador() {
  const navigate = useNavigate();
  const [modoJogo, setModoJogo] = useState('singleplayer');
  const [jogador1, setJogador1] = useState('');
  const [jogador2, setJogador2] = useState('');
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [tema, setTema] = useState('dark');

  // Efeito para alternar tema
  useEffect(() => {
    document.body.className = `${tema}-theme`;
  }, [tema]);

  // Formatação em tempo real
  const formatarNome = (valor) => {
    return valor
      .replace(/[^a-zA-ZÀ-ÿ ]/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleChangeJogador = (setter) => (e) => {
    const valorFormatado = formatarNome(e.target.value);
    setter(valorFormatado);
  };

  // Validação completa
  const validarNomes = async () => {
    setErro(null);
    
    // Validação Jogador 1
    if (!jogador1.trim()) {
      setErro('Nome do Jogador 1 é obrigatório');
      return false;
    }

    if (jogador1.trim().length < 2) {
      setErro('Nome deve ter pelo menos 2 caracteres');
      return false;
    }

    // Validação Jogador 2 (se multiplayer)
    if (modoJogo === 'multiplayer') {
      if (!jogador2.trim()) {
        setErro('Nome do Jogador 2 é obrigatório');
        return false;
      }

      if (jogador2.trim().length < 2) {
        setErro('Nome do Jogador 2 deve ter pelo menos 2 caracteres');
        return false;
      }

      if (jogador1.toLowerCase() === jogador2.toLowerCase()) {
        setErro('Os jogadores não podem ter o mesmo nome');
        return false;
      }
    }

    // Verificar nomes existentes na API
    try {
      const [existente1, existente2] = await Promise.all([
        verificarNomeExistente(jogador1),
        modoJogo === 'multiplayer' ? verificarNomeExistente(jogador2) : Promise.resolve(false)
      ]);

      if (existente1) {
        setErro('Nome do Jogador 1 já está em uso');
        return false;
      }

      if (existente2) {
        setErro('Nome do Jogador 2 já está em uso');
        return false;
      }
    } catch (error) {
      setErro('Erro ao verificar nomes. Tente novamente.');
      return false;
    }

    return true;
  };

  const verificarNomeExistente = async (nome) => {
    try {
      const response = await api.get('/players/check', {
        params: { 
          nome: nome.trim() 
        },
        paramsSerializer: params => {
          return Object.entries(params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro na verificação');
      }
      
      return response.data.existe;
      
    } catch (error) {
      console.error("Falha ao verificar nome:", {
        error: error.message,
        response: error.response?.data
      });
      return false;
    }
  };

  const criarJogador = async (nome) => {
    try {
      const nomeFormatado = formatarNome(nome);
      const response = await api.post('/players', { 
        nome: nomeFormatado 
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao criar jogador');
      }
      
      return { 
        ...response.data.data,
        nome: nomeFormatado
      };
      
    } catch (error) {
      console.error("Falha ao criar jogador:", {
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      // Validação local primeiro
      if (!jogador1.trim() || (modoJogo === 'multiplayer' && !jogador2.trim())) {
        throw new Error('Preencha todos os nomes');
      }

      // Cria jogadores
      const [jogador1Data, jogador2Data] = await Promise.all([
        criarJogador(jogador1),
        modoJogo === 'multiplayer' ? criarJogador(jogador2) : Promise.resolve({ 
          id: -1, 
          nome: 'CPU',
          hero: null 
        })
      ]);

      // Navega com os dados completos
      navigate('/selecionar-personagem', {
        state: {
          modoJogo,
          jogador1: {
            ...jogador1Data,
            nome: formatarNome(jogador1Data.nome) // Garante formatação
          },
          jogador2: modoJogo === 'multiplayer' ? {
            ...jogador2Data,
            nome: formatarNome(jogador2Data.nome)
          } : {
            id: -1,
            nome: 'CPU',
            hero: null
          }
        },
        replace: true
      });

    } catch (error) {
      setErro(error.message || 'Erro ao processar jogadores');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={`character-selection-container`}>
      <div className="split-card-container">
        <div className="split-card">
          <div className="card-left">
            <img 
              src="/images/logo.jpg" 
              alt="Personagens do Game" 
              className="card-image"
            />
          </div>

          <div className="card-right">
            <div className="card-header">
              <h1>Criar Jogadores</h1>
              <div className="game-mode-badge">
                {modoJogo === 'singleplayer' ? '👤 Jogador vs CPU 🖥️' : '👤 Jogador vs Jogador 👤'}
              </div>
            </div>

            <div className="game-mode-selector">
              <h2>Selecione o modo de jogo:</h2>
              <div className="mode-options">
                <button
                  type="button"
                  className={`mode-option ${modoJogo === 'singleplayer' ? 'active' : ''}`}
                  onClick={() => setModoJogo('singleplayer')}
                >
                  <span>👤 Jogador vs CPU 🖥️</span>
                </button>
                <button
                  type="button"
                  className={`mode-option ${modoJogo === 'multiplayer' ? 'active' : ''}`}
                  onClick={() => setModoJogo('multiplayer')}
                >
                  <span>👤 Jogador vs Jogador 👤</span>
                </button>
              </div>
            </div>

            <form className="player-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="jogador1">Nome do Jogador 1:</label>
                <input
                  id="jogador1"
                  type="text"
                  value={jogador1}
                  onChange={handleChangeJogador(setJogador1)}
                  placeholder="Digite seu nome"
                  maxLength="20"
                  required
                  autoFocus
                />
                <small className="hint">Ex: Natasha Romanoff (mínimo 2 caracteres)</small>
              </div>

              {modoJogo === 'multiplayer' && (
                <div className="form-group">
                  <label htmlFor="jogador2">Nome do Jogador 2:</label>
                  <input
                    id="jogador2"
                    type="text"
                    value={jogador2}
                    onChange={handleChangeJogador(setJogador2)}
                    placeholder="Digite o nome do segundo jogador"
                    maxLength="20"
                    required
                  />
                  <small className="hint">Ex: Bruce Wayne (mínimo 2 caracteres)</small>
                </div>
              )}

              {erro && <div className="error-message">{erro}</div>}

              <button 
                type="submit" 
                className="confirm-button" 
                disabled={carregando}
              >
                {carregando ? (
                  <>
                    <span className="spinner"></span>
                    Carregando...
                  </>
                ) : (
                  '✅ Confirmar e Selecionar Personagens'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}