import { Sequelize } from 'sequelize';
import config from './config.js';
import logger from './logger.js';

// Créer l'instance Sequelize
const sequelize = new Sequelize(config.DATABASE_URI, {
  dialect: config.DATABASE_DIALECT,
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Fonction de connexion à la base de données
const sequelizeConnect = async () => {
  try {
    await sequelize.authenticate();
    logger.info('🚀 Connected to SQL Database!');
  } catch (error) {
    logger.error(`❌ Database connection error: ${error}`);
    process.exit(1);
  }
};

// Fonction pour synchroniser les modèles avec la base de données
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    logger.info('🔄 Database synchronized!');
  } catch (error) {
    logger.error(`❌ Database sync error: ${error}`);
    throw error;
  }
};

export { sequelize, sequelizeConnect, syncDatabase };
export default sequelize;
