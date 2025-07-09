import sequelize from '../config/database.js';
import Hero from '../models/Hero.js';
import dotenv from 'dotenv';

dotenv.config();

const herois = [
  {
    nome: 'Batman',
    gif_entrada: '/images/batman/entrada.gif',
    gif_ataque: '/images/batman/luta.gif',
    gif_saida: '/images/batman/saida.gif',
    ataque1_nome: 'Soco rápido',
    ataque1_dano: 20,
    ataque1_precisao: 85,
    ataque2_nome: 'Batarangue explosivo',
    ataque2_dano: 35,
    ataque2_precisao: 70,
    ataque_especial_nome: 'Chuva de Morcegos',
    ataque_especial_dano: 60,
    ataque_especial_precisao: 90,
    defesa: 30,
    velocidade: 45,
    vida_base: 100
  },
  {
    nome: 'Coringa',
    gif_entrada: '/images/coringa/entrada.gif',
    gif_ataque: '/images/coringa/luta.gif',
    gif_saida: '/images/coringa/saida.gif',
    ataque1_nome: 'Tiro de brinquedo',
    ataque1_dano: 22,
    ataque1_precisao: 80,
    ataque2_nome: 'Piada mortal',
    ataque2_dano: 30,
    ataque2_precisao: 75,
    ataque_especial_nome: 'Riso insano',
    ataque_especial_dano: 65,
    ataque_especial_precisao: 85,
    defesa: 25,
    velocidade: 50,
    vida_base: 95
  },
  // 👉 Adicione mais 8 heróis com variações aqui...
];

const seedHeroes = async () => {
  try {
    await sequelize.sync({ force: true });
    await Hero.bulkCreate(herois);
    console.log('✅ Heróis inseridos com sucesso!');
    process.exit();
  } catch (error) {
    console.error('❌ Erro ao inserir heróis:', error);
    process.exit(1);
  }
};

seedHeroes();
