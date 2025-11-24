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

// PUT /personnages/:id - Mettre à jour un personnage (nom, position, etc.)
router.put('/:id', updateCharacter);

// DELETE /personnages/:id - Supprimer un personnage
router.delete('/:id', deleteCharacter);

export default router;