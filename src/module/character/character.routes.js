import express from 'express';
import passport from 'passport';

import {
  getMyCharacters,
  getCharacterById,
  createCharacter,
  gainExperience,
  allocateStatPoints,
  updateCharacter,
  deleteCharacter,
  moveCharacter
} from './character.controller.js';

import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

/**
 * Toutes les routes personnages doivent être protégées.
 * Le joueur doit être connecté pour accéder aux personnages.
 */
router.use(authMiddleware);

// GET /personnages - Récupérer tous les personnages du joueur connecté
router.get('/', getMyCharacters);

// GET /personnages/:id - Récupérer un personnage spécifique
router.get('/:id', getCharacterById);

// POST /personnages - Créer un nouveau personnage
router.post('/', createCharacter);

// PATCH /personnages/:id/xp - Faire gagner de l'XP à un personnage
router.patch('/:id/xp', gainExperience);

// PATCH /personnages/:id/stats - Répartir les points de stats
router.patch('/:id/stats', allocateStatPoints);

// POST /personnages/:id/deplacement - Déplacer un personnage sur la map (A*)
router.post('/:id/deplacement', moveCharacter);

// PUT /personnages/:id - Mettre à jour un personnage (nom, position, etc.)
router.put('/:id', updateCharacter);

// DELETE /personnages/:id - Supprimer un personnage (admin ou propriétaire)
router.delete('/:id', deleteCharacter);
// si tu veux restreindre aux admins :
// router.delete('/:id', adminMiddleware, deleteCharacter);

export default router;
