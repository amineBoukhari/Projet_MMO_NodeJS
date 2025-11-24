import express from 'express';
import passport from 'passport';
import {
  getMyCharacters,
  getCharacterById,
  createCharacter,
  gainExperience,
  allocateStatPoints,
  updateCharacter,
  deleteCharacter
} from './character.controller.js';

const router = express.Router();

// Middleware d'authentification
const requireAuth = passport.authenticate('jwt', { session: false });

/**
 * Routes pour la gestion des personnages
 * Toutes les routes nécessitent une authentification
 */

// GET /personnages - Récupérer tous les personnages du joueur connecté
router.get('/', requireAuth, getMyCharacters);

// GET /personnages/:id - Récupérer un personnage spécifique
router.get('/:id', requireAuth, getCharacterById);

// POST /personnages - Créer un nouveau personnage
router.post('/', requireAuth, createCharacter);

// PATCH /personnages/:id/xp - Faire gagner de l'XP à un personnage
router.patch('/:id/xp', requireAuth, gainExperience);

// PATCH /personnages/:id/stats - Répartir les points de stats
router.patch('/:id/stats', requireAuth, allocateStatPoints);

// PUT /personnages/:id - Mettre à jour un personnage (nom, position, etc.)
router.put('/:id', requireAuth, updateCharacter);

// DELETE /personnages/:id - Supprimer un personnage
router.delete('/:id', requireAuth, deleteCharacter);

export default router;