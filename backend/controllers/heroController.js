import Hero from '../models/Hero.js';
import { Sequelize } from 'sequelize';

// Campos básicos para consultas rápidas
const BASIC_HERO_ATTRIBUTES = [
  'id', 
  'nome',
  'gif_entrada',
  'gif_ataque_especial',
  'gif_vitoria'
];

// Campos completos para detalhes do herói
const FULL_HERO_ATTRIBUTES = [
  ...BASIC_HERO_ATTRIBUTES,
  'vida_base',
  'defesa',
  'velocidade',
  'ataque1_nome',
  'ataque1_dano',
  'ataque1_precisao',
  'ataque2_nome',
  'ataque2_dano',
  'ataque2_precisao',
  'ataque_especial_nome',
  'ataque_especial_dano',
  'ataque_especial_precisao'
];

//Retorna todos os heróis cadastrados (apenas informações básicas)
export const getAllHeroes = async (req, res) => {
  try {
    const heroes = await Hero.findAll({
      attributes: BASIC_HERO_ATTRIBUTES,
      order: [['nome', 'ASC']] // Ordena por nome
    });
    
    res.json({
      success: true,
      count: heroes.length,
      data: heroes
    });
    
  } catch (err) {
    console.error('Erro ao buscar heróis:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno ao carregar lista de heróis' 
    });
  }
};

//Retorna detalhes completos de um herói específico
export const getHeroById = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id, {
      attributes: FULL_HERO_ATTRIBUTES
    });

    if (!hero) {
      return res.status(404).json({
        success: false,
        error: 'Herói não encontrado'
      });
    }

    res.json({
      success: true,
      data: hero
    });
    
  } catch (err) {
    console.error(`Erro ao buscar herói ${req.params.id}:`, err);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao buscar detalhes do herói'
    });
  }
};

//Retorna um herói aleatório com atributos para batalha
export const getRandomHero = async (req, res) => {
  try {
    const hero = await Hero.findOne({
      order: Sequelize.literal('random()'),
      attributes: FULL_HERO_ATTRIBUTES
    });

    if (!hero) {
      return res.status(404).json({
        success: false,
        error: 'Nenhum herói disponível'
      });
    }

    res.json({
      success: true,
      data: hero
    });
    
  } catch (err) {
    console.error('Erro ao sortear herói:', err);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao selecionar herói aleatório'
    });
  }
};

//Retorna apenas os GIFs de um herói específico
export const getHeroGifs = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id, {
      attributes: [
        'gif_entrada',
        'gif_ataque_especial',
        'gif_vitoria'
      ]
    });

    if (!hero) {
      return res.status(404).json({
        success: false,
        error: 'Herói não encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        entrance: hero.gif_entrada,
        special_attack: hero.gif_ataque_especial,
        victory: hero.gif_vitoria
      }
    });
    
  } catch (err) {
    console.error(`Erro ao buscar GIFs do herói ${req.params.id}:`, err);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao carregar animações'
    });
  }
};