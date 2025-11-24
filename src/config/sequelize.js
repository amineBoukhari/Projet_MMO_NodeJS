import { Sequelize } from 'sequelize';
import config from './config.js';
import logger from './logger.js';

// Create Sequelize instance
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

// Function to connect to the database
const sequelizeConnect = async () => {
  try {
    await sequelize.authenticate();
    logger.info('🚀 Connected to SQL Database!');
  } catch (error) {
    logger.error(`❌ Database connection error: ${error}`);
    process.exit(1);
  }
};

// Function to synchronize models with the database
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
