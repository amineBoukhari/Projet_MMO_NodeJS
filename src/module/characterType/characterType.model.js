import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

/**
 * Modèle pour les types de personnages (Guerrier, Mage, Archer...)
 * Administration uniquement
 */
const CharacterType = sequelize.define('CharacterType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 500]
    }
  },
  bonusHP: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  bonusAtt: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 50
    }
  },
  bonusDef: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 50
    }
  }
}, {
  tableName: 'character_types',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['nom']
    }
  ]
});

export default CharacterType;