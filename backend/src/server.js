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
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173',
    ].filter(Boolean);
    if (allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
app.use('/api/auth',       authRoutes);
app.use('/api/algorithms', algorithmRoutes);
app.use('/api/history',    historyRoutes);

// Health check — Railway uses this to verify the app is alive
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AlgoVision API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════╗
║      AlgoVision API Server            ║
║                                       ║
║  Status: Running                      ║
║  Port: ${PORT}                        ║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(12)}║
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