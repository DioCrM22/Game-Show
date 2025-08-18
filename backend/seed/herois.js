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
  {
    nome: 'Superman',
    gif_entrada: '/images/superman/entrada.gif',
    gif_ataque: '/images/superman/luta.gif',
    gif_saida: '/images/superman/saida.gif',
    ataque1_nome: 'Soco supersônico',
    ataque1_dano: 25,
    ataque1_precisao: 90,
    ataque2_nome: 'Visão de calor',
    ataque2_dano: 40,
    ataque2_precisao: 85,
    ataque_especial_nome: 'Voo devastador',
    ataque_especial_dano: 70,
    ataque_especial_precisao: 95,
    defesa: 40,
    velocidade: 55,
    vida_base: 120
  },
  {
    nome: 'Mulher Maravilha',
    gif_entrada: '/images/mulher-maravilha/entrada.gif',
    gif_ataque: '/images/mulher-maravilha/luta.gif',
    gif_saida: '/images/mulher-maravilha/saida.gif',
    ataque1_nome: 'Golpe do escudo',
    ataque1_dano: 23,
    ataque1_precisao: 88,
    ataque2_nome: 'Laço da verdade',
    ataque2_dano: 32,
    ataque2_precisao: 80,
    ataque_especial_nome: 'Fúria amazona',
    ataque_especial_dano: 62,
    ataque_especial_precisao: 92,
    defesa: 35,
    velocidade: 48,
    vida_base: 110
  },
  {
    nome: 'Flash',
    gif_entrada: '/images/flash/entrada.gif',
    gif_ataque: '/images/flash/luta.gif',
    gif_saida: '/images/flash/saida.gif',
    ataque1_nome: 'Rajada veloz',
    ataque1_dano: 18,
    ataque1_precisao: 95,
    ataque2_nome: 'Tornado de velocidade',
    ataque2_dano: 28,
    ataque2_precisao: 85,
    ataque_especial_nome: 'Força da velocidade',
    ataque_especial_dano: 55,
    ataque_especial_precisao: 98,
    defesa: 20,
    velocidade: 70,
    vida_base: 90
  },
  {
    nome: 'Aquaman',
    gif_entrada: '/images/aquaman/entrada.gif',
    gif_ataque: '/images/aquaman/luta.gif',
    gif_saida: '/images/aquaman/saida.gif',
    ataque1_nome: 'Golpe do tridente',
    ataque1_dano: 26,
    ataque1_precisao: 82,
    ataque2_nome: 'Comando dos mares',
    ataque2_dano: 34,
    ataque2_precisao: 78,
    ataque_especial_nome: 'Maremoto',
    ataque_especial_dano: 68,
    ataque_especial_precisao: 88,
    defesa: 38,
    velocidade: 42,
    vida_base: 115
  },
  {
    nome: 'Lanterna Verde',
    gif_entrada: '/images/lanterna-verde/entrada.gif',
    gif_ataque: '/images/lanterna-verde/luta.gif',
    gif_saida: '/images/lanterna-verde/saida.gif',
    ataque1_nome: 'Construto de energia',
    ataque1_dano: 21,
    ataque1_precisao: 87,
    ataque2_nome: 'Barreira verde',
    ataque2_dano: 29,
    ataque2_precisao: 83,
    ataque_especial_nome: 'Poder da vontade',
    ataque_especial_dano: 58,
    ataque_especial_precisao: 90,
    defesa: 32,
    velocidade: 46,
    vida_base: 105
  },
  {
    nome: 'Cyborg',
    gif_entrada: '/images/cyborg/entrada.gif',
    gif_ataque: '/images/cyborg/luta.gif',
    gif_saida: '/images/cyborg/saida.gif',
    ataque1_nome: 'Canhão sônico',
    ataque1_dano: 24,
    ataque1_precisao: 84,
    ataque2_nome: 'Míssil teleguiado',
    ataque2_dano: 36,
    ataque2_precisao: 76,
    ataque_especial_nome: 'Sobrecarga tecnológica',
    ataque_especial_dano: 64,
    ataque_especial_precisao: 86,
    defesa: 42,
    velocidade: 40,
    vida_base: 108
  },
  {
    nome: 'Shazam',
    gif_entrada: '/images/shazam/entrada.gif',
    gif_ataque: '/images/shazam/luta.gif',
    gif_saida: '/images/shazam/saida.gif',
    ataque1_nome: 'Punho do trovão',
    ataque1_dano: 27,
    ataque1_precisao: 81,
    ataque2_nome: 'Raio mágico',
    ataque2_dano: 38,
    ataque2_precisao: 74,
    ataque_especial_nome: 'Poder dos deuses',
    ataque_especial_dano: 72,
    ataque_especial_precisao: 89,
    defesa: 36,
    velocidade: 52,
    vida_base: 112
  },
  {
    nome: 'Arlequina',
    gif_entrada: '/images/arlequina/entrada.gif',
    gif_ataque: '/images/arlequina/luta.gif',
    gif_saida: '/images/arlequina/saida.gif',
    ataque1_nome: 'Taco de baseball',
    ataque1_dano: 19,
    ataque1_precisao: 86,
    ataque2_nome: 'Bomba surpresa',
    ataque2_dano: 31,
    ataque2_precisao: 79,
    ataque_especial_nome: 'Caos total',
    ataque_especial_dano: 56,
    ataque_especial_precisao: 91,
    defesa: 28,
    velocidade: 58,
    vida_base: 98
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
