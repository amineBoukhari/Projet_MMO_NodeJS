import express from 'express';
import {
    getAllSpells,
    getSpellById,
    createSpell,
    updateSpell,
    deleteSpell
} from './spell.controller.js'
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware)
router.get('/', getAllSpells);
router.get('/:id', getSpellById);
router.post('/', createSpell);
router.put('/:id', updateSpell);
router.delete('/:id', deleteSpell);

export default router;