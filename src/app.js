import express from 'express';
import config from './config/config.js';
import passport from './config/passport.js';
import characterRoutes from './module/character/character.routes.js';
import mapRoutes from './module/map/map.routes.js';
import caseRoutes from './module/case/case.routes.js';
import userRoutes from './module/user/user.route.js';
import authRoutes from './module/auth/auth.route.js';

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Test route
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

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: '✅ API is healthy'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/personnages', characterRoutes);

export default app;
