import express from 'express';
import {
    getAllSpells,
    getSpellById,
    createSpell,
    updateSpell,
    deleteSpell
} from './spell.controller.js'
const router = express.Router();

router.get('/', getAllSpells);
router.get('/:id', getSpellById);
router.post('/', createSpell);
router.put('/:id', updateSpell);
router.delete('/:id', deleteSpell);

export default router;