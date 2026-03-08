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

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ── API Routes ──
app.use('/api/auth',       authRoutes);
app.use('/api/algorithms', algorithmRoutes);
app.use('/api/history',    historyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'AlgoVision API is running!', timestamp: new Date().toISOString() });
});

// ── Serve React frontend ──
// Try multiple possible paths for Railway
const possiblePaths = [
  path.join(__dirname, '../../frontend/dist'),   // local dev
  path.join(process.cwd(), 'frontend/dist'),     // Railway root
  path.join(process.cwd(), '../frontend/dist'),  // Railway alt
];

import fs from 'fs';
const frontendPath = possiblePaths.find(p => fs.existsSync(p));

if (frontendPath) {
  console.log('Serving frontend from:', frontendPath);
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  console.log('Frontend dist not found. Paths tried:', possiblePaths);
  app.get('*', (req, res) => {
    res.json({ message: 'API is running. Frontend not found.', triedPaths: possiblePaths });
  });
}

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  AlgoVision API Server\n  Port: ${PORT}\n  Mode: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;