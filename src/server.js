import http from 'http';
import app from './app.js'; // Application Express
import sequelize from './config/sequelize.js'; // Connexion Sequelize
import './models/associate.js'; // Import des associations
import logger from './config/logger.js'; // Logger Winston
import config from './config/config.js'; // Configuration (PORT, etc.)
import initialData from './config/initialData.js'; // Function to create default data

logger.info("🚀 Server is starting...");

// Create HTTP server
const server = http.createServer(app);

// Normalize port
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(config.PORT || '3000');
app.set('port', port);

// Server error handler
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges.`);
      process.exit(1);
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use.`);
      process.exit(1);
    default:
      throw error;
  }
};

// Server event handling
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : `port ${port}`;
  logger.info(`🚀 Server is running on ${bind}`);
});

// Database synchronization and server startup
(async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');
    
    // Synchronize models with the database
    // force: false => do not drop existing tables
    // alter: true => modify tables to match models
    await sequelize.sync({ alter: true });
    logger.info('✅ Database synchronized successfully.');
    
    // Initialize default data
    await initialData();
    
    // Start the server
    server.listen(port);
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
})();