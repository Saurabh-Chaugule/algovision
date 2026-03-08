import express from 'express';
import {
  getAlgorithms,
  executeAlgorithm,
  saveAlgorithm,
  getSavedAlgorithms,
  getSavedAlgorithm,
  updateSavedAlgorithm,
  deleteSavedAlgorithm
} from '../controllers/algorithmController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getAlgorithms);

// Execute: optional auth — guests can run, logged-in users get history saved
router.post('/execute', optionalAuthenticate, executeAlgorithm);

// Protected
router.post('/save',         authenticate, saveAlgorithm);
router.get('/saved',         authenticate, getSavedAlgorithms);
router.get('/saved/:id',     authenticate, getSavedAlgorithm);
router.put('/saved/:id',     authenticate, updateSavedAlgorithm);
router.delete('/saved/:id',  authenticate, deleteSavedAlgorithm);

export default router;