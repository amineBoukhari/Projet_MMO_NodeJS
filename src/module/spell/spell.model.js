import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

const Spell = sequelize.define('Spell',{
    name: {
        type: DataTypes.STRING(255),
        unique: true
    },
    description: {
        type: DataTypes.STRING(255)
    },
    power: {
        type: DataTypes.INTEGER()
    },
    type: {
        type: DataTypes.STRING(255)
    },
    minLevel: {
        type: DataTypes.INTEGER()
    }
}, {
    tableName: 'spells'
})

export default Spell;