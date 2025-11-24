import sequelize from '../config/sequelize.js';
import User from '../module/user/user.model.js';

// Importer ici tous vos autres modèles quand vous les créerez
// import Character from '../module/character/character.model.js';
// import Item from '../module/item/item.model.js';
// etc...

// Définir les associations ici
const models = {
  User,
  // Character,
  // Item,
};

// Exemple d'associations (à décommenter quand vous aurez d'autres modèles)
// User.hasMany(Character, { 
//   as: 'characters',
//   foreignKey: 'userId'
// });
// 
// Character.belongsTo(User, {
//   as: 'user',
//   foreignKey: 'userId'
// });

export { sequelize };
export default models;
