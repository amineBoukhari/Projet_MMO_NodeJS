import express from 'express';
import {
    getAllCharacterTypes,
    getCharacterTypeById,
    createCharacterType,
    updateCharacterType,
    deleteCharacterType
} from './characterType.controller.js'
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);
router.get('/', getAllCharacterTypes);
router.get('/:id', getCharacterTypeById);
router.post('/', createCharacterType);
router.put('/:id', updateCharacterType);
router.delete('/:id', deleteCharacterType);

export default router;