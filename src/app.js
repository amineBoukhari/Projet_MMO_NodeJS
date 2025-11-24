import express from 'express';
import config from './config/config.js';
import mapRoutes from './module/map/map.routes.js';
import caseRoutes from './module/case/case.routes.js';
import passport from './config/passport.js';
import userRoutes from './module/user/user.route.js';
import authRoutes from './module/auth/auth.route.js';

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes Map & Cases
app.use('/api', mapRoutes);
app.use('/api', caseRoutes);
// Initialize Passport
app.use(passport.initialize());

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Server is running!',
    env: config.NODE_ENV
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

export default app;
