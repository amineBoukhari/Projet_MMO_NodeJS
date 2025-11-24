import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';


const Character = sequelize.define('Character', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50],
      // Interdire les caractères spéciaux
      is: /^[a-zA-ZÀ-ÿ0-9\s-_]+$/
    }
  },
  joueurId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  typeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'character_types',
      key: 'id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  },
  // Stats de base
  hp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
    validate: {
      min: 1,
      max: 9999
    }
  },
  hpMax: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
    validate: {
      min: 1,
      max: 9999
    }
  },
  att: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    validate: {
      min: 1,
      max: 999
    }
  },
  def: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 999
    }
  },
  // Système de progression
  xp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  niveau: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 100
    }
  },
  pointsDisponibles: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // Position sur la map
  positionX: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  positionY: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  mapId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    references: {
      model: 'maps',
      key: 'id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  },
}, {
  tableName: 'characters',
  timestamps: true,
  indexes: [
    {
      fields: ['joueurId']
    },
    {
      fields: ['typeId']
    },
    {
      fields: ['niveau']
    },
    {
      unique: true,
      fields: ['joueurId', 'nom']
    }
  ],
  hooks: {
    // Hook pour calculer l'XP nécessaire au prochain niveau
    beforeCreate: (character) => {
      // Initialiser les HP max égaux aux HP
      if (!character.hpMax) {
        character.hpMax = character.hp;
      }
    },
    beforeUpdate: (character) => {
      // Vérifier que les HP ne dépassent pas les HP max
      if (character.hp > character.hpMax) {
        character.hp = character.hpMax;
      }
    }
  }
});

/**
 * Méthodes d'instance
 */
Character.prototype.getXpForNextLevel = function() {
  // Formule simple: niveau * 100 XP pour passer au niveau suivant
  // Par exemple, niveau 1 -> 100 XP, niveau 2 -> 200 XP ... 
  return this.niveau * 100;
};

Character.prototype.getCurrentLevelXp = function() {
  // XP minimum pour le niveau actuel
  return (this.niveau - 1) * 100;
};

Character.prototype.getXpProgress = function() {
  const currentLevelXp = this.getCurrentLevelXp();
  const nextLevelXp = this.getXpForNextLevel();
  const progressXp = this.xp - currentLevelXp;
  const neededXp = nextLevelXp - currentLevelXp;
  
  return {
    current: progressXp,
    needed: neededXp,
    percentage: Math.floor((progressXp / neededXp) * 100)
  };
};

Character.prototype.canLevelUp = function() {
  return this.xp >= this.getXpForNextLevel();
};

Character.prototype.levelUp = function() {
  if (!this.canLevelUp()) {
    throw new Error('Pas assez d\'XP pour monter de niveau');
  }
  
  this.niveau += 1;
  this.pointsDisponibles += 5; // 5 points par niveau
  this.hpMax += 5; // +5 HP max par niveau
  this.hp = this.hpMax; // Heal complet au level up
  
  return this;
};

Character.prototype.addXp = function(amount) {
  if (amount <= 0) {
    throw new Error('Le montant d\'XP doit être positif');
  }
  
  this.xp += amount;
  
  // Vérifier les level ups multiples
  const levelsGained = [];
  while (this.canLevelUp()) {
    this.levelUp();
    levelsGained.push(this.niveau);
  }
  
  return levelsGained;
};


Character.prototype.allocateStatPoints = function(statDistribution) {
  const { hp, att, def } = statDistribution;
  const totalPoints = (hp || 0) + (att || 0) + (def || 0);
  
  if (totalPoints > this.pointsDisponibles) {
    throw new Error('Pas assez de points disponibles');
  }
  
  if (hp && hp > 0) {
    this.hpMax += hp;
    this.hp += hp;
  }
  if (att && att > 0) {
    this.att += att;
  }
  if (def && def > 0) {
    this.def += def;
  }
  
  this.pointsDisponibles -= totalPoints;
  
  return this;
};
 
export default Character;