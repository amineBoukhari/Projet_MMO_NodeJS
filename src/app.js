import express from 'express';
import config from './config/config.js';

const app = express();

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Server is running!',
    env: config.NODE_ENV
  });
});

// Route de test de la base de données
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: '✅ API is healthy'
  });
});

export default app;
