import { Router } from 'express';
import {
  createCase,
  getCaseById,
  updateCase,
  deleteCase
} from './case.controller.js';

const router = Router();

// CRUD Case (Admin)
router.post('/cases', createCase);
router.get('/cases/:id', getCaseById);
router.put('/cases/:id', updateCase);
router.delete('/cases/:id', deleteCase);

export default router;
