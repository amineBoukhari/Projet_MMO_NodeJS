import sequelize from '../config/sequelize.js';
import CharacterType from '../module/characterType/characterType.model.js';
import User from '../module/user/user.model.js';
import RefreshToken from '../module/auth/refreshToken.model.js';

// Import other models here when you create them
// import Character from '../module/character/character.model.js';
// import Item from '../module/item/item.model.js';
// etc...

// Define all models
const models = {
  User,
  CharacterType,
  RefreshToken
  // Character,
  // Item,
};

// Define associations here
// User has many refresh tokens
User.hasMany(RefreshToken, { 
  as: 'refreshTokens',
  foreignKey: 'userId'
});

RefreshToken.belongsTo(User, {
  as: 'user',
  foreignKey: 'userId'
});

// Example associations (uncomment when you have other models)
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
