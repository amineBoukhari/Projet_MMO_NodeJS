import express from 'express';
import config from './config/config.js';
import mapRoutes from './module/map/map.routes.js';

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes Map & Cases
app.use('/api', mapRoutes);

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

export default app;
