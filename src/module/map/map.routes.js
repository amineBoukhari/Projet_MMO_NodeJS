import { Router } from 'express';
import {
	createMap,
	getMaps,
	getMapById,
	getMapCases,
	seedOneMapWithGrid
} from './map.controller.js';

const router = Router();

// POST /maps (admin) - ici pas encore de middleware d'auth, on laisse simple
router.post('/maps', createMap);

// GET /maps
router.get('/maps', getMaps);

// GET /maps/:id
router.get('/maps/:id', getMapById);

// GET /maps/:id/cases
router.get('/maps/:id/cases', getMapCases);

// Route pratique pour générer une map 10x10 et ses cases
router.post('/maps/seed/demo', seedOneMapWithGrid);

export default router;

