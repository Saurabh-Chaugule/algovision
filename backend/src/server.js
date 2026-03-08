import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import algorithmRoutes from './routes/algorithmRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 5000;

// CORS (only needed for local dev — in production frontend is served from same origin)
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ── API Routes ──
app.use('/api/auth',       authRoutes);
app.use('/api/algorithms', algorithmRoutes);
app.use('/api/history',    historyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'AlgoVision API is running!', timestamp: new Date().toISOString() });
});

// ── Serve React frontend in production ──
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));

  // All non-API routes go to React
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// 404 for API
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════╗
║      AlgoVision API Server            ║
║  Port: ${PORT}                        ║
║  Mode: ${(process.env.NODE_ENV || 'development').padEnd(12)}         ║
╚═══════════════════════════════════════╝
  `);
});

export default app;