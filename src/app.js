import express from 'express';
import config from './config/config.js';
import userRoutes from './module/user/user.route.js';

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

export default app;
