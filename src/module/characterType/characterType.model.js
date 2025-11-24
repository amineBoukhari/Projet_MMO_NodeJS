import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

const CharacterType = sequelize.define('CharacterType',{
    name: {
        type: DataTypes.STRING(255),
        unique: true
    },
    description: {
        type: DataTypes.STRING(255)
    },
    bonusHP: {
        type: DataTypes.INTEGER()
    },
    bonusATT: {
        type: DataTypes.INTEGER()
    },
    bonusDEF: {
        type: DataTypes.INTEGER()
    }
},
{
  tableName: 'character_types',
})

export default CharacterType;