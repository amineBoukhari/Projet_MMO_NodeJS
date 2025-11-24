import express from 'express';
import passport from 'passport';
import {
  getAllCharacterTypes,
  getCharacterTypeById,
  createCharacterType,
  updateCharacterType,
  deleteCharacterType
} from './characterType.controller.js';

const router = express.Router();

// Middleware d'authentification
const requireAuth = passport.authenticate('jwt', { session: false });

// Middleware pour vérifier les droits admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Accès refusé. Droits administrateur requis.'
  });
};

/**
 * Routes pour la gestion des types de personnages
 * Toutes les routes nécessitent une authentification et des droits admin
 */

// GET /admin/character-types - Récupérer tous les types
router.get('/', requireAuth, requireAdmin, getAllCharacterTypes);

// GET /admin/character-types/:id - Récupérer un type spécifique
router.get('/:id', requireAuth, requireAdmin, getCharacterTypeById);

// POST /admin/character-types - Créer un nouveau type
router.post('/', requireAuth, requireAdmin, createCharacterType);

// PUT /admin/character-types/:id - Mettre à jour un type
router.put('/:id', requireAuth, requireAdmin, updateCharacterType);

// DELETE /admin/character-types/:id - Supprimer un type
router.delete('/:id', requireAuth, requireAdmin, deleteCharacterType);

export default router;