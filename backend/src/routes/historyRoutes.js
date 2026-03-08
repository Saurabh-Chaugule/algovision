import express from 'express';
import {
  getHistory,
  getHistoryItem,
  deleteHistoryItem,
  clearHistory,
  getHistoryStats
} from '../controllers/historyController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All history routes require authentication
router.use(authenticate);

router.get('/', getHistory);
router.get('/stats', getHistoryStats);
router.get('/:id', getHistoryItem);
router.delete('/:id', deleteHistoryItem);
router.delete('/', clearHistory);

export default router;
