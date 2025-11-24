import Character from './character.model.js';
import CharacterType from '../characterType/characterType.model.js';
import User from '../user/user.model.js';
import { Op } from 'sequelize';
import logger from '../../config/logger.js';

/**
 * Contrôleur pour la gestion des personnages
 */

/**
 * GET /personnages
 * Récupérer tous les personnages du joueur connecté
 */
export const getMyCharacters = async (req, res) => {
  try {
    const userId = req.user.id;

    const characters = await Character.findAll({
      where: { joueurId: userId },
      include: [
        {
          model: CharacterType,
          as: 'type',
          attributes: ['nom', 'description']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: characters,
      count: characters.length
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des personnages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des personnages'
    });
  }
};

/**
 * GET /personnages/:id
 * Récupérer un personnage spécifique du joueur connecté
 */
export const getCharacterById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const character = await Character.findOne({
      where: { 
        id, 
        joueurId: userId 
      },
      include: [
        {
          model: CharacterType,
          as: 'type',
          attributes: ['nom', 'description', 'bonusHP', 'bonusAtt', 'bonusDef']
        }
      ]
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Personnage non trouvé'
      });
    }

    // Ajouter les informations de progression
    const xpProgress = character.getXpProgress();
    const characterData = character.toJSON();
    characterData.progression = {
      xpProgress,
      canLevelUp: character.canLevelUp(),
      xpForNextLevel: character.getXpForNextLevel()
    };

    res.status(200).json({
      success: true,
      data: characterData
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du personnage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du personnage'
    });
  }
};

/**
 * POST /personnages
 * Créer un nouveau personnage
 */
export const createCharacter = async (req, res) => {
  try {
    const { nom, typeId } = req.body;
    const userId = req.user.id;

    // Validation des données
    if (!nom || !typeId) {
      return res.status(400).json({
        success: false,
        message: 'Le nom et le type de personnage sont obligatoires'
      });
    }

    // Vérifier que le type de personnage existe
    const characterType = await CharacterType.findByPk(typeId);
    if (!characterType) {
      return res.status(404).json({
        success: false,
        message: 'Type de personnage non trouvé'
      });
    }

    // Vérifier que le joueur n'a pas déjà un personnage avec ce nom
    const existingCharacter = await Character.findOne({
      where: { 
        nom, 
        joueurId: userId 
      }
    });

    if (existingCharacter) {
      return res.status(409).json({
        success: false,
        message: 'Vous avez déjà un personnage avec ce nom'
      });
    }

    // Calculer les stats de base avec les bonus du type
    const baseStats = {
      hp: 100 + characterType.bonusHP,
      att: 10 + characterType.bonusAtt,
      def: 5 + characterType.bonusDef
    };

    const character = await Character.create({
      nom,
      joueurId: userId,
      typeId,
      hp: baseStats.hp,
      hpMax: baseStats.hp,
      att: baseStats.att,
      def: baseStats.def,
      xp: 0,
      niveau: 1,
      pointsDisponibles: 0,
      positionX: 0,
      positionY: 0,
      inventaire: []
    });

    // Recharger avec les associations
    await character.reload({
      include: [
        {
          model: CharacterType,
          as: 'type',
          attributes: ['nom', 'description']
        }
      ]
    });

    logger.info(`Personnage créé: ${character.nom} (${characterType.nom}) pour l'utilisateur ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Personnage créé avec succès',
      data: character
    });
  } catch (error) {
    logger.error('Erreur lors de la création du personnage:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du personnage'
    });
  }
};

/**
 * PATCH /personnages/:id/xp
 * Faire gagner de l'XP à un personnage
 */
export const gainExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Le montant d\'XP doit être un nombre positif'
      });
    }

    const character = await Character.findOne({
      where: { 
        id, 
        joueurId: userId 
      }
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Personnage non trouvé'
      });
    }

    const previousLevel = character.niveau;
    const levelsGained = character.addXp(amount);
    
    await character.save();

    const response = {
      success: true,
      message: `${amount} XP gagnés`,
      data: {
        character: character.toJSON(),
        xpGained: amount,
        previousLevel,
        currentLevel: character.niveau,
        levelsGained: levelsGained.length,
        newPointsAvailable: levelsGained.length * 5
      }
    };

    if (levelsGained.length > 0) {
      response.message += ` - Niveau ${levelsGained.length > 1 ? 'x' : ''}${levelsGained.join(', ')} atteint !`;
      logger.info(`Personnage ${character.nom} (ID: ${character.id}) a gagné ${levelsGained.length} niveau(x)`);
    }

    res.status(200).json(response);
  } catch (error) {
    logger.error('Erreur lors du gain d\'XP:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur lors du gain d\'XP'
    });
  }
};

/**
 * PATCH /personnages/:id/stats
 * Répartir les points de stats d'un personnage
 */
export const allocateStatPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { hp, att, def } = req.body;
    const userId = req.user.id;

    // Validation des données
    const statDistribution = { hp: hp || 0, att: att || 0, def: def || 0 };
    const totalPoints = statDistribution.hp + statDistribution.att + statDistribution.def;

    if (totalPoints <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Vous devez allouer au moins un point'
      });
    }

    if (Object.values(statDistribution).some(val => val < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Les points alloués ne peuvent pas être négatifs'
      });
    }

    const character = await Character.findOne({
      where: { 
        id, 
        joueurId: userId 
      }
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Personnage non trouvé'
      });
    }

    if (character.pointsDisponibles < totalPoints) {
      return res.status(400).json({
        success: false,
        message: `Pas assez de points disponibles. Disponibles: ${character.pointsDisponibles}, Demandés: ${totalPoints}`
      });
    }

    const previousStats = {
      hp: character.hp,
      hpMax: character.hpMax,
      att: character.att,
      def: character.def,
      pointsDisponibles: character.pointsDisponibles
    };

    character.allocateStatPoints(statDistribution);
    await character.save();

    logger.info(`Points répartis pour ${character.nom}: +${hp || 0} HP, +${att || 0} ATT, +${def || 0} DEF`);

    res.status(200).json({
      success: true,
      message: 'Points répartis avec succès',
      data: {
        character: character.toJSON(),
        pointsAllocated: {
          hp: hp || 0,
          att: att || 0,
          def: def || 0,
          total: totalPoints
        },
        previousStats,
        newStats: {
          hp: character.hp,
          hpMax: character.hpMax,
          att: character.att,
          def: character.def,
          pointsDisponibles: character.pointsDisponibles
        }
      }
    });
  } catch (error) {
    logger.error('Erreur lors de la répartition des points:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de la répartition des points'
    });
  }
};

/**
 * PUT /personnages/:id
 * Mettre à jour un personnage (nom, position, etc.)
 */
export const updateCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, positionX, positionY } = req.body;
    const userId = req.user.id;

    const character = await Character.findOne({
      where: { 
        id, 
        joueurId: userId 
      }
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Personnage non trouvé'
      });
    }

    // Préparer les données à mettre à jour
    const updateData = {};
    if (nom !== undefined) {
      // Vérifier l'unicité du nom pour ce joueur
      if (nom !== character.nom) {
        const existingCharacter = await Character.findOne({
          where: { 
            nom, 
            joueurId: userId,
            id: { [Op.ne]: id }
          }
        });

        if (existingCharacter) {
          return res.status(409).json({
            success: false,
            message: 'Vous avez déjà un personnage avec ce nom'
          });
        }
      }
      updateData.nom = nom;
    }
    if (positionX !== undefined) updateData.positionX = positionX;
    if (positionY !== undefined) updateData.positionY = positionY;

    await character.update(updateData);

    logger.info(`Personnage mis à jour: ${character.nom} (ID: ${character.id})`);

    res.status(200).json({
      success: true,
      message: 'Personnage mis à jour avec succès',
      data: character
    });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du personnage:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du personnage'
    });
  }
};

/**
 * DELETE /personnages/:id
 * Supprimer un personnage
 */
export const deleteCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const character = await Character.findOne({
      where: { 
        id, 
        joueurId: userId 
      }
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Personnage non trouvé'
      });
    }

    await character.destroy();

    logger.info(`Personnage supprimé: ${character.nom} (ID: ${character.id}) par l'utilisateur ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Personnage supprimé avec succès'
    });
  } catch (error) {
    logger.error('Erreur lors de la suppression du personnage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du personnage'
    });
  }
};