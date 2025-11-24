import express from 'express';
import config from './config/config.js';
import userRoutes from './module/user/user.route.js';
import characterTypeRoutes from './module/characterType/characterType.route.js';
import spellRoutes from './module/spell/spell.route.js';

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Server is running!',
    env: config.NODE_ENV
  });
});

// API Routes
app.use('/api/users', userRoutes);

// Character Types
app.use('/api/characterTypes', characterTypeRoutes)

// Spells
app.use('/api/spells', spellRoutes)

export default app;
