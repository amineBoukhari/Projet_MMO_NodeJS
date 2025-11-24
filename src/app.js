import express from 'express';
import config from './config/config.js';

// Import des routes

import characterRoutes from './module/character/character.routes.js';
import userRoutes from './module/user/user.route.js';


const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes API
app.use('/api/users', userRoutes);
app.use('/api/personnages', characterRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ MMORPG API Server is running!',
    env: config.NODE_ENV,
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      characters: '/api/personnages',
      characterTypes: '/api/admin/character-types (admin only)'
    }
  });
});

// API Routes
app.use('/api/users', userRoutes);

export default app;
