import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';
import Map from '../map/map.model.js';

// Define the Case model for grid cells within a map
const Case = sequelize.define('Case', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mapId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'map_id',
    references: {
      model: 'maps',
      key: 'id'
    }
  },
  x: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  y: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  terrainType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'terrain_type'
  },
  blocked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'cases',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

Map.hasMany(Case, {
  as: 'cases',
  foreignKey: 'mapId'
});

Case.belongsTo(Map, {
  as: 'map',
  foreignKey: 'mapId'
});

export default Case;
