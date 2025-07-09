import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Battle = sequelize.define('Battle', {
  player1_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'players',
      key: 'id'
    }
  },
  player2_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'players',
      key: 'id'
    }
  },
  vencedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  player1_heroi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  player2_heroi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rounds: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  dano_total: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'battles',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

// Relações
Battle.associate = (models) => {
  Battle.belongsTo(models.Player, {
    foreignKey: 'player1_id',
    as: 'Player1'
  });
  
  Battle.belongsTo(models.Player, {
    foreignKey: 'player2_id',
    as: 'Player2'
  });
  
  Battle.belongsTo(models.Player, {
    foreignKey: 'vencedor_id',
    as: 'Winner'
  });
};

export default Battle;