import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../services/api';
import './selecionarpersonagem-styles.css';

const getDefaultHero = () => ({
  id: -1,
  nome: 'Herói Desconhecido',
  imagem_url: '/images/default-hero.jpg',
  vida_base: 100,
  defesa: 10,
  velocidade: 50,
  forca: 18,
  ataque_basico_nome: 'Ataque Básico',
  ataque_basico_dano: 15,
  ataque_basico_precisao: 80,
  ataque_rapido_nome: 'Ataque Rápido',
  ataque_rapido_dano: 10,
  ataque_rapido_precisao: 90,
  ataque_especial_nome: 'Ataque Especial',
  ataque_especial_dano: 30,
  ataque_especial_precisao: 70,
  gif_entrada: '/gifs/default/entrada.gif',
  gif_ataque_especial: '/gifs/default/especial.gif',
  gif_saida: '/gifs/default/saida.gif'
});

export default function SelecionarPersonagem() {
  const location = useLocation();
  const navigate = useNavigate();
  const { modoJogo, jogador1, jogador2, manterJogadores = false } = location.state || {};
  
  const [nomeJogador1, setNomeJogador1] = useState(jogador1?.nome || '');
  const [nomeJogador2, setNomeJogador2] = useState(jogador2?.nome || '');
  const [modoJogoAtual, setModoJogoAtual] = useState(modoJogo || 'multiplayer');
  const [herois, setHerois] = useState([]);
  const [heroiJogador1, setHeroiJogador1] = useState(null);
  const [heroiJogador2, setHeroiJogador2] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [detalhesHeroi, setDetalhesHeroi] = useState(null);
  const [heroisDisponiveis, setHeroisDisponiveis] = useState([]);

  useEffect(() => {
  if (manterJogadores) {
    setNomeJogador1(jogador1?.nome || '');
    setNomeJogador2(jogador2?.nome || '');
    setModoJogoAtual(modoJogo || 'multiplayer');
    
    // Log para debug
    console.log('Preservando jogadores:', {
      jogador1: jogador1?.nome,
      jogador2: jogador2?.nome,
      modoJogo
    });
  }
}, [manterJogadores, jogador1, jogador2, modoJogo]);

    useEffect(() => {
  const carregarHerois = async () => {
    try {
      setCarregando(true);
      const response = await api.get('/hero');
      console.log('🎯 Dados brutos da API:', response.data);
      
      // DEBUG: Verificar a estrutura real da resposta
      let heroesData = null;
      
      if (Array.isArray(response.data)) {
        // Caso 1: A API retorna array diretamente
        console.log('✅ Estrutura: Array direto');
        heroesData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        // Caso 2: A API retorna { data: [...] }
        console.log('✅ Estrutura: response.data.data');
        heroesData = response.data.data;
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Caso 3: A API retorna { success: true, data: [...] }
        console.log('✅ Estrutura: response.data.success.data');
        heroesData = response.data.data;
      } else {
        console.error('❌ Estrutura desconhecida:', response.data);
        throw new Error('Estrutura de dados inválida da API');
      }
      
      if (!heroesData || heroesData.length === 0) {
        console.warn('⚠️ Nenhum herói retornado pela API');
        setHerois([getDefaultHero()]);
        setHeroisDisponiveis([getDefaultHero()]);
        return;
      }

      console.log('📋 Quantidade de heróis recebidos:', heroesData.length);
      
      const heroesComAtaquesFormatados = heroesData.map(hero => {
        // DEBUG DETALHADO: Verificar TODOS os campos de cada herói
        console.log('🦸 Herói completo recebido:', hero);
        console.log('🎯 Campos de ataque verificados:', {
          id: hero.id,
          nome: hero.nome,
          basico_nome: hero.ataque_basico_nome,
          basico_dano: hero.ataque_basico_dano,
          basico_precisao: hero.ataque_basico_precisao,
          rapido_nome: hero.ataque_rapido_nome,
          rapido_dano: hero.ataque_rapido_dano,
          rapido_precisao: hero.ataque_rapido_precisao,
          especial_nome: hero.ataque_especial_nome,
          especial_dano: hero.ataque_especial_dano,
          especial_precisao: hero.ataque_especial_precisao
        });

        // Calcular força baseada nos danos reais ou defaults
        const danoBasico = hero.ataque_basico_dano || 15;
        const danoRapido = hero.ataque_rapido_dano || 10;
        const danoEspecial = hero.ataque_especial_dano || 30;
        const forcaCalculada = Math.round((danoBasico + danoRapido + danoEspecial) / 3);

        return {
          ...hero,
          vida_base: hero.vida_base || 100,
          defesa: hero.defesa || 10,
          velocidade: hero.velocidade || 50,
          ataque_basico_nome: hero.ataque_basico_nome || 'Ataque Básico',
          ataque_basico_dano: danoBasico,
          ataque_basico_precisao: hero.ataque_basico_precisao || 80,
          ataque_rapido_nome: hero.ataque_rapido_nome || 'Ataque Rápido',
          ataque_rapido_dano: danoRapido,
          ataque_rapido_precisao: hero.ataque_rapido_precisao || 90,
          ataque_especial_nome: hero.ataque_especial_nome || 'Ataque Especial',
          ataque_especial_dano: danoEspecial,
          ataque_especial_precisao: hero.ataque_especial_precisao || 70,
          
          ataques: {
            basico: {
              nome: hero.ataque_basico_nome || 'Ataque Básico',
              dano: danoBasico,
              precisao: hero.ataque_basico_precisao || 80
            },
            rapido: {
              nome: hero.ataque_rapido_nome || 'Ataque Rápido',
              dano: danoRapido,
              precisao: hero.ataque_rapido_precisao || 90
            },
            especial: {
              nome: hero.ataque_especial_nome || 'Ataque Especial',
              dano: danoEspecial,
              precisao: hero.ataque_especial_precisao || 70
            }
          },
          forca: forcaCalculada
        };
      });

      console.log('✨ Heróis processados:', heroesComAtaquesFormatados);
      
      setHerois(heroesComAtaquesFormatados);
      setHeroisDisponiveis(heroesComAtaquesFormatados);
      
    } catch (error) {
      console.error('❌ Erro crítico ao carregar heróis:', error);
      setErro('Falha ao carregar personagens: ' + error.message);
      setHerois([getDefaultHero()]);
      setHeroisDisponiveis([getDefaultHero()]);
    } finally {
      setCarregando(false);
    }
  };

  if (!jogador1) {
    navigate('/criar-jogador', { replace: true });
    return;
  }

  carregarHerois();
}, [navigate, jogador1]);

const atualizarJogadorComHeroi = async (jogadorId, heroiId) => {
  if (jogadorId <= 0) return; // Não atualiza CPU
  
  try {
    console.log('📝 Atualizando jogador', jogadorId, 'com herói', heroiId);
    
    const response = await api.put(`/players/${jogadorId}`, { 
      heroi_id: heroiId 
    });
    
    console.log('📋 Resposta da atualização:', response.data);
    
    if (response.data && response.data.success) {
      console.log('✅ Jogador atualizado com sucesso');
    } else {
      console.warn('⚠️ Atualização do jogador retornou success: false');
    }
    
  } catch (error) {
    console.error('❌ Erro ao atualizar jogador:', error.response?.data || error.message);
    // Não interrompe o fluxo - apenas loga o erro
  }
};

const handleHeroSelection = async (jogadorNumero, heroi) => {
  if (jogadorNumero === 1) {
    setHeroiJogador1(heroi);
    if (jogador1?.id) {
      await atualizarJogadorComHeroi(jogador1.id, heroi.id);
    }
  } else {
    setHeroiJogador2(heroi);
    if (jogador2?.id && jogador2.id > 0) { // Só atualiza se não for CPU
      await atualizarJogadorComHeroi(jogador2.id, heroi.id);
    }
  }
};

  const mostrarDetalhesHeroi = useCallback((heroi) => {
    setDetalhesHeroi(heroi);
  }, []);


  useEffect(() => {
    if (modoJogo === 'multiplayer') {
      setHeroisDisponiveis(herois.filter(heroi => 
        heroi.id !== heroiJogador1?.id && heroi.id !== heroiJogador2?.id
      ));
    } else {
      setHeroisDisponiveis(herois.filter(heroi => 
        heroi.id !== heroiJogador1?.id
      ));
    }
  }, [herois, heroiJogador1, heroiJogador2, modoJogo]);

  const selecionarAleatorio = useCallback(async (jogador) => {
    try {
      setCarregando(true);
      let disponiveis = [...herois];
      
      if (modoJogo === 'multiplayer') {
        disponiveis = herois.filter(heroi => 
          heroi.id !== (jogador === 1 ? heroiJogador2?.id : heroiJogador1?.id)
        );
      } else {
        disponiveis = herois.filter(heroi => 
          heroi.id !== heroiJogador1?.id
        );
      }

      if (disponiveis.length === 0) return;

      const randomIndex = Math.floor(Math.random() * disponiveis.length);
      const heroiSelecionado = disponiveis[randomIndex];
      
      if (jogador === 1) {
        setHeroiJogador1(heroiSelecionado);
      } else {
        setHeroiJogador2(heroiSelecionado);
      }
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, [herois, heroiJogador1, heroiJogador2, modoJogo]);

  const resetarSelecao = useCallback((jogador) => {
    if (jogador === 1) {
      setHeroiJogador1(null);
    } else {
      setHeroiJogador2(null);
    }
  }, []);

const iniciarBatalha = useCallback(async () => {
  try {
    setCarregando(true);
    
    if (!heroiJogador1) throw new Error('Selecione um herói para o Jogador 1');
    if (modoJogoAtual === 'multiplayer' && !heroiJogador2) {
      throw new Error('Selecione um herói para o Jogador 2');
    }

    const dadosBatalha = {
      modoJogo: modoJogoAtual,
      jogador1: {
        id: jogador1?.id || Date.now(),
        nome: nomeJogador1,
        hero: heroiJogador1 // ✅ Dados diretos do banco
      },
      jogador2: modoJogoAtual === 'multiplayer' ? {
        id: jogador2?.id || Date.now() + 1,
        nome: nomeJogador2,
        hero: heroiJogador2 // ✅ Dados diretos do banco
      } : {
        id: -1,
        nome: 'CPU',
        hero: heroiJogador2 // ✅ Dados diretos do banco
      }
    };

    console.log('🚀 Dados enviados para batalha:', dadosBatalha);
    navigate('/batalha', { state: dadosBatalha });
  } catch (error) {
    setErro(error.message);
  } finally {
    setCarregando(false);
  }
}, [heroiJogador1, heroiJogador2, nomeJogador1, nomeJogador2, modoJogoAtual, navigate, jogador1, jogador2]);

  const corrigirCaminhoImagem = (url, nome) => {
    if (!url) return `/images/${nome.toLowerCase()}.jpg`;
    return url.replace('/hero/', '/').replace(/\.(png|jpeg|gif)$/, '.jpg');
  };

  if (carregando) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Carregando personagens...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="error-screen">
        <h2>Erro</h2>
        <p>{erro}</p>
        <button onClick={() => window.location.reload()}>Recarregar</button>
      </div>
    );
  }

  return (
    <div className="character-selection-container">
      {/* Efeitos de luz para os jogadores */}
      <div className="light-effect player-1-light"></div>
      <div className="light-effect player-2-light"></div>

      {/* Cabeçalho */}
        <header className="selection-header">
        <h1>Selecione Seu Personagem</h1>
        <div className="game-mode-badge"> 
            <button>
              {modoJogoAtual === 'singleplayer' ? '👤 Jogador vs CPU 🖥️' : '👤 Jogador vs Jogador 👤'}
            </button>
        </div>
        <button 
          className="back-button"
          onClick={() => navigate('/criar-jogador')}
        >
          ⬅️ Voltar
        </button>
      </header>

      {/* Área principal de seleção */}
      <div className="selection-main-area">
        {/* Jogador 1 - Lado esquerdo */}
        <div className="player-area player-1-area">
          <div className={`player-card ${heroiJogador1 ? 'selected' : ''}`}>
            <div className="player-info">
              <h2>👤 {nomeJogador1  || 'Jogador 1'}</h2>
              {heroiJogador1 && (
                <div className="selected-indicator">
                  <span className="lock-icon">🔒</span>
                  <span className="hero-name">{heroiJogador1.nome}</span>
                </div>
              )}
            </div>
            
            <div className="player-actions">
              {heroiJogador1 ? (
                <button className="action-button change-button" onClick={() => resetarSelecao(1)}>
                  🔄 Trocar
                </button>
              ) : (
                <button 
                  className="action-button random-button"
                  onClick={() => selecionarAleatorio(1)}
                  disabled={heroisDisponiveis.length === 0}
                >
                  🎲 Aleatório
                </button>
              )}
            </div>
          </div>

          {/* Painel de detalhes do jogador 1 */}
          <div className={`player-details-panel ${detalhesHeroi && !heroiJogador1 ? 'visible' : ''}`}>
            {detalhesHeroi && !heroiJogador1 && (
              <div className="details-content">
                <div className="details-header">
                  <h3>{detalhesHeroi.nome}</h3>
                </div>
                <div className="details-body">
                  <div className="character-image-preview">
                    <img
                      src={corrigirCaminhoImagem(detalhesHeroi.imagem_url, detalhesHeroi.nome)}
                      alt={detalhesHeroi.nome}
                      onError={(e) => e.target.src = '/images/default-hero.jpg'}
                    />
                  </div>
                  <div className="character-stats">
                    <div className="stat-item">
                      <span className="stat-icon">❤️</span>
                      <span className="stat-value">{detalhesHeroi.vida_base}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">🛡️</span>
                      <span className="stat-value">{detalhesHeroi.defesa}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">⚡</span>
                      <span className="stat-value">{detalhesHeroi.velocidade}</span>
                    </div>
                     <div className="stat-item">
                      <span className="stat-icon">💪</span>
                      <span className="stat-value">{detalhesHeroi.forca}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grade central de personagens */}
        <div className="characters-grid-container">
          <div className="characters-grid">
            {herois.map(heroi => ( 
              <div 
                key={heroi.id}
                className={`character-card ${
                  heroiJogador1?.id === heroi.id ? 'selected-by-player1' : 
                  heroiJogador2?.id === heroi.id ? 'selected-by-player2' : ''
                } ${
                  (heroiJogador1?.id === heroi.id || heroiJogador2?.id === heroi.id) ? 
                  'locked' : ''
                }`}
                onClick={() => handleHeroSelection(
                  !heroiJogador1 ? 1 : 2, 
                  heroi
                )}
                onMouseEnter={() => {
                  if (!(heroiJogador1?.id === heroi.id || heroiJogador2?.id === heroi.id)) {
                    setDetalhesHeroi(heroi);
                  }
                }}
              >
                <div className="character-image-container">
                  <img
                    src={corrigirCaminhoImagem(heroi.imagem_url, heroi.nome)}
                    alt={heroi.nome}
                    onError={(e) => e.target.src = '/images/default-hero.jpg'}
                  />
                  {(heroiJogador1?.id === heroi.id || heroiJogador2?.id === heroi.id) && (
                    <div className="character-lock-overlay">
                      <span className="lock-icon">🔒</span>
                    </div>
                  )}
                </div>
                <div className="character-info">
                  <h3>{heroi.nome}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jogador 2 ou CPU - Lado direito */}
        <div className="player-area player-2-area">
          <div className={`player-card ${heroiJogador2 ? 'selected' : ''}`}>
            <div className="player-info">
              <h2> {modoJogoAtual === 'multiplayer' ? (<>👤 {nomeJogador2 || 'Jogador 2'}</>) : ('🖥️ CPU')}</h2>
              {heroiJogador2 && (
                <div className="selected-indicator">
                  <span className="lock-icon">🔒</span>
                  <span className="hero-name">{heroiJogador2.nome}</span>
                </div>
              )}
            </div>
            
            <div className="player-actions">
              {heroiJogador2 ? (
                <button className="action-button change-button" onClick={() => resetarSelecao(2)}>
                  🔄 Trocar
                </button>
              ) : (
                <button 
                  className="action-button random-button"
                  onClick={() => selecionarAleatorio(2)}
                  disabled={heroisDisponiveis.length === 0}
                >
                  🎲 Aleatório
                </button>
              )}
            </div>
          </div>

          {/* Painel de detalhes do jogador 2/CPU */}
          <div className={`player-details-panel ${detalhesHeroi && heroiJogador1 && !heroiJogador2 ? 'visible' : ''}`}>
            {detalhesHeroi && heroiJogador1 && !heroiJogador2 && (
              <div className="details-content">
                <div className="details-header">
                  <h3>{detalhesHeroi.nome}</h3>
                </div>
                <div className="details-body">
                  <div className="character-image-preview">
                    <img
                      src={corrigirCaminhoImagem(detalhesHeroi.imagem_url, detalhesHeroi.nome)}
                      alt={detalhesHeroi.nome}
                      onError={(e) => e.target.src = '/images/default-hero.jpg'}
                    />
                  </div>
                  <div className="character-stats">
                    <div className="stat-item">
                      <span className="stat-icon">❤️</span>
                      <span className="stat-value">{detalhesHeroi.vida_base}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">🛡️</span>
                      <span className="stat-value">{detalhesHeroi.defesa}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">⚡</span>
                      <span className="stat-value">{detalhesHeroi.velocidade}</span>
                    </div>
                      <div className="stat-item">
                      <span className="stat-icon">💪</span>
                      <span className="stat-value">{detalhesHeroi.forca}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botão de iniciar batalha (flutuante) */}
       <div className="floating-battle-controls">
        <button
          className={`start-battle-button ${
            (!heroiJogador1 || (modoJogoAtual === 'multiplayer' && !heroiJogador2)) ? 
            'disabled' : 'pulse-animation'
          }`}
          onClick={iniciarBatalha}
          disabled={!heroiJogador1 || (modoJogoAtual === 'multiplayer' && !heroiJogador2)}
        >
          {carregando ? (
            <>
              <span className="spinner"></span>
              Preparando...
            </>
          ) : (
            'Iniciar Batalha ⚔️'
          )}
        </button>
      </div>
    </div>
  );
}