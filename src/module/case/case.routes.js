import { Router } from 'express';
import {
  createCase,
  getCaseById,
  updateCase,
  deleteCase
} from './case.controller.js';

const router = Router();

// CRUD Case (Admin)
router.post('/', createCase);
router.get('/:id', getCaseById);
router.put('/:id', updateCase);
router.delete('/:id', deleteCase);

export default router;
