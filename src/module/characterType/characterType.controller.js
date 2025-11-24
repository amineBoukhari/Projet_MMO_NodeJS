import CharacterType from './characterType.model.js';
import logger from '../../config/logger.js';

/**
 * Contrôleur pour la gestion des types de personnages (Administration uniquement)
 */

/**
 * GET /admin/character-types
 * Récupérer tous les types de personnages
 */
export const getAllCharacterTypes = async (req, res) => {
  try {
    const characterTypes = await CharacterType.findAll({
      order: [['nom', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: characterTypes,
      count: characterTypes.length
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des types de personnages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des types de personnages'
    });
  }
};

/**
 * GET /admin/character-types/:id
 * Récupérer un type de personnage par son ID
 */
export const getCharacterTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const characterType = await CharacterType.findByPk(id);

    if (!characterType) {
      return res.status(404).json({
        success: false,
        message: 'Type de personnage non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: characterType
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du type de personnage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du type de personnage'
    });
  }
};

/**
 * POST /admin/character-types
 * Créer un nouveau type de personnage
 */
export const createCharacterType = async (req, res) => {
  try {
    const { nom, description, bonusHP, bonusAtt, bonusDef } = req.body;

    // Validation des données
    if (!nom || !description) {
      return res.status(400).json({
        success: false,
        message: 'Le nom et la description sont obligatoires'
      });
    }

    // Vérifier que le nom n'existe pas déjà
    const existingType = await CharacterType.findOne({ where: { nom } });
    if (existingType) {
      return res.status(409).json({
        success: false,
        message: 'Un type de personnage avec ce nom existe déjà'
      });
    }

    const characterType = await CharacterType.create({
      nom,
      description,
      bonusHP: bonusHP || 0,
      bonusAtt: bonusAtt || 0,
      bonusDef: bonusDef || 0
    });

    logger.info(`Type de personnage créé: ${characterType.nom} (ID: ${characterType.id})`);

    res.status(201).json({
      success: true,
      message: 'Type de personnage créé avec succès',
      data: characterType
    });
  } catch (error) {
    logger.error('Erreur lors de la création du type de personnage:', error);
    
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
      message: 'Erreur serveur lors de la création du type de personnage'
    });
  }
};

/**
 * PUT /admin/character-types/:id
 * Mettre à jour un type de personnage
 */
export const updateCharacterType = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, bonusHP, bonusAtt, bonusDef } = req.body;

    const characterType = await CharacterType.findByPk(id);

    if (!characterType) {
      return res.status(404).json({
        success: false,
        message: 'Type de personnage non trouvé'
      });
    }

    // Vérifier que le nouveau nom n'existe pas déjà (si modifié)
    if (nom && nom !== characterType.nom) {
      const existingType = await CharacterType.findOne({ where: { nom } });
      if (existingType) {
        return res.status(409).json({
          success: false,
          message: 'Un type de personnage avec ce nom existe déjà'
        });
      }
    }

    // Mettre à jour les champs
    const updateData = {};
    if (nom !== undefined) updateData.nom = nom;
    if (description !== undefined) updateData.description = description;
    if (bonusHP !== undefined) updateData.bonusHP = bonusHP;
    if (bonusAtt !== undefined) updateData.bonusAtt = bonusAtt;
    if (bonusDef !== undefined) updateData.bonusDef = bonusDef;

    await characterType.update(updateData);

    logger.info(`Type de personnage mis à jour: ${characterType.nom} (ID: ${characterType.id})`);

    res.status(200).json({
      success: true,
      message: 'Type de personnage mis à jour avec succès',
      data: characterType
    });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du type de personnage:', error);
    
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
      message: 'Erreur serveur lors de la mise à jour du type de personnage'
    });
  }
};

/**
 * DELETE /admin/character-types/:id
 * Supprimer un type de personnage
 */
export const deleteCharacterType = async (req, res) => {
  try {
    const { id } = req.params;

    const characterType = await CharacterType.findByPk(id);

    if (!characterType) {
      return res.status(404).json({
        success: false,
        message: 'Type de personnage non trouvé'
      });
    }

    // Vérifier s'il y a des personnages qui utilisent ce type
    // Cette vérification sera activée quand les associations seront configurées
    // const characterCount = await characterType.countCharacters();
    // if (characterCount > 0) {
    //   return res.status(409).json({
    //     success: false,
    //     message: 'Impossible de supprimer ce type car des personnages l\'utilisent'
    //   });
    // }

    await characterType.destroy();

    logger.info(`Type de personnage supprimé: ${characterType.nom} (ID: ${characterType.id})`);

    res.status(200).json({
      success: true,
      message: 'Type de personnage supprimé avec succès'
    });
  } catch (error) {
    logger.error('Erreur lors de la suppression du type de personnage:', error);
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Impossible de supprimer ce type car des personnages l\'utilisent'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du type de personnage'
    });
  }
};