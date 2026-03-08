import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import algorithmRoutes from './routes/algorithmRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/algorithms', algorithmRoutes);
app.use('/api/history', historyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AlgoVision API is running!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║      AlgoVision API Server            ║
║                                       ║
║  Status: Running                      ║
║  Port: ${PORT}                        ║
║  Environment: ${process.env.NODE_ENV || 'development'}           ║
║                                       ║
║  Endpoints:                           ║
║  - POST /api/auth/register            ║
║  - POST /api/auth/login               ║
║  - GET  /api/algorithms               ║
║  - POST /api/algorithms/execute       ║
║  - GET  /api/history                  ║
║                                       ║
╚═══════════════════════════════════════╝
  `);
});

export default app;
