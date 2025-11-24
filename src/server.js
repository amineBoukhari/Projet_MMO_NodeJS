import http from 'http';
import app from './app.js'; // Application Express
import sequelize from './config/sequelize.js'; // Connexion Sequelize
import './models/associate.js'; // Import des associations
import logger from './config/logger.js'; // Logger Winston
import config from './config/config.js'; // Configuration (PORT, etc.)
import initialData from './config/initialData.js'; // Fonction pour initialiser les données

logger.info("🚀 Server is starting...");

// Créer le serveur HTTP
const server = http.createServer(app);

// Normaliser le port
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

// Gestionnaire d'erreurs du serveur
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

// Gestion des événements du serveur
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : `port ${port}`;
  logger.info(`🚀 Server is running on ${bind}`);
});

// Synchronisation de la base de données et démarrage du serveur
(async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');
    
    // Synchroniser les modèles avec la base de données
    // force: false => ne supprime pas les tables existantes
    // alter: true => modifie les tables pour correspondre aux modèles
    await sequelize.sync({ alter: true });
    logger.info('✅ Database synchronized successfully.');
    
    // Initialiser les données par défaut
    await initialData();
    
    // Démarrer le serveur
    server.listen(port);
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
})();