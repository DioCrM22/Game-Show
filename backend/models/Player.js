import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Hero from './Hero.js';

const Player = sequelize.define('Player', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  heroi_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Hero,
      key: 'id'
    },
    allowNull: false
  },
  vitorias: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  derrotas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'players',
  timestamps: false
});

// Relações
Player.associate = (models) => {
  Player.belongsTo(models.Hero, { 
    foreignKey: 'heroi_id',
    as: 'Hero' 
  });
  
  Player.hasMany(models.Battle, {
    foreignKey: 'player1_id',
    as: 'BattlesAsPlayer1'
  });
  
  Player.hasMany(models.Battle, {
    foreignKey: 'player2_id',
    as: 'BattlesAsPlayer2'
  });
  
  Player.hasMany(models.Battle, {
    foreignKey: 'vencedor_id',
    as: 'Victories'
  });
};

export default Player;
