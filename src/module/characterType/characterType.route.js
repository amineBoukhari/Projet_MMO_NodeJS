import express from 'express';
import {
    getAllCharacterTypes,
    getCharacterTypeById,
    createCharacterType,
    updateCharacterType,
    deleteCharacterType
} from './characterType.controller.js'
const router = express.Router();

router.get('/', getAllCharacterTypes);
router.get('/:id', getCharacterTypeById);
router.post('/', createCharacterType);
router.put('/:id', updateCharacterType);
router.delete('/:id', deleteCharacterType);

export default router;