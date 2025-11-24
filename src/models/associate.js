import sequelize from '../config/sequelize.js';
import User from '../module/user/user.model.js';
import Character from '../module/character/character.model.js';
import CharacterType from '../module/characterType/characterType.model.js';

// Définir les associations ici
const models = {
  User,
  Character,
  CharacterType,
};

// Relations User <-> Character
User.hasMany(Character, { 
  as: 'characters',
  foreignKey: 'joueurId',
  onDelete: 'CASCADE'
});

Character.belongsTo(User, {
  as: 'joueur',
  foreignKey: 'joueurId'
});

// Relations CharacterType <-> Character
CharacterType.hasMany(Character, {
  as: 'characters',
  foreignKey: 'typeId',
  onDelete: 'RESTRICT'
});

Character.belongsTo(CharacterType, {
  as: 'type',
  foreignKey: 'typeId'
});

export { sequelize };
export default models;
