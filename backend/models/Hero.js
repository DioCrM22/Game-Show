import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Hero = sequelize.define('Hero', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  // GIFs animados
  gif_entrada: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'default_entrada.gif'
  },
  gif_ataque_especial: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'default_ataque_especial.gif'
  },
  gif_saida: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'default_saida.gif'
  },
  // Atributos de combate
  vida_base: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
    validate: {
      min: 1
    }
  },
  defesa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    validate: {
      min: 0,
      max: 100
    }
  },
  velocidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50,
    validate: {
      min: 1,
      max: 100
    }
  },
  // Ataque 1
  ataque_basico_nome: {
    type: DataTypes.STRING,
    defaultValue: 'Ataque Básico'
  },
  ataque_basico_dano: {
    type: DataTypes.INTEGER,
    defaultValue: 15
  },
  ataque_basico_precisao: {
    type: DataTypes.INTEGER,
    defaultValue: 80,
    validate: {
      min: 1,
      max: 100
    }
  },
  // Ataque 2
  ataque_rapido_nome: {
    type: DataTypes.STRING,
    defaultValue: 'Ataque Rápido'
  },
  ataque_rapido_dano: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  ataque_rapido_precisao: {
    type: DataTypes.INTEGER,
    defaultValue: 90
  },
  // Ataque Especial
  ataque_especial_nome: {
    type: DataTypes.STRING,
    defaultValue: 'Super Ataque'
  },
  ataque_especial_dano: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  ataque_especial_precisao: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  }
}, {
  tableName: 'heroes',
  timestamps: false
});

// Relações
Hero.associate = (models) => {
  Hero.hasMany(models.Player, {
    foreignKey: 'heroi_id',
    as: 'Players'
  });
};

export default Hero;