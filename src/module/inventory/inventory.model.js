import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

const Inventory = sequelize.define('Inventory', {
    id_equipment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_character: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
},
    {
        tableName: 'inventory',
    })

export default Inventory;