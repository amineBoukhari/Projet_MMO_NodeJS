import { Router } from 'express';
import {
	createMap,
	getMaps,
	getMapById,
	getMapCases,
	seedOneMapWithGrid,
	seedRealisticMap
} from './map.controller.js';

const router = Router();

// POST /maps (admin) - ici pas encore de middleware d'auth, on laisse simple
router.post('/', createMap);

// GET /maps
router.get('/', getMaps);

// GET /maps/:id
router.get('/:id', getMapById);

// GET /maps/:id/cases
router.get('/:id/cases', getMapCases);

// Route pratique pour générer une map 10x10 et ses cases
router.post('/seed/demo', seedOneMapWithGrid);

// Route pour générer une map réaliste 20x20 avec murs/obstacles
router.post('/seed/realistic', seedRealisticMap);

export default router;

