import { syncDatabase } from '../config/sequelize.js';
import CharacterType from '../module/characterType/characterType.model.js';
import logger from '../config/logger.js';

/**
 * Script d'initialisation pour créer les types de personnages de base
 */
export const initializeCharacterTypes = async () => {
  try {
    logger.info('🔄 Initialisation des types de personnages...');

    const defaultTypes = [
      {
        nom: 'Guerrier',
        description: 'Un combattant robuste spécialisé dans le combat au corps à corps. Excellent en défense et possède beaucoup de points de vie.',
        bonusHP: 20,
        bonusAtt: 5,
        bonusDef: 10
      },
      {
        nom: 'Mage',
        description: 'Un lanceur de sorts puissant mais fragile. Excelle dans les attaques magiques à distance.',
        bonusHP: -10,
        bonusAtt: 15,
        bonusDef: -5
      },
      {
        nom: 'Archer',
        description: 'Un combattant à distance agile et précis. Équilibré entre attaque et défense.',
        bonusHP: 5,
        bonusAtt: 8,
        bonusDef: 2
      },
      {
        nom: 'Voleur',
        description: 'Un combattant agile spécialisé dans la furtivité et les attaques rapides.',
        bonusHP: 0,
        bonusAtt: 10,
        bonusDef: -2
      },
      {
        nom: 'Paladin',
        description: 'Un guerrier saint combinant combat et magie divine. Très résistant et polyvalent.',
        bonusHP: 15,
        bonusAtt: 3,
        bonusDef: 7
      }
    ];

    for (const typeData of defaultTypes) {
      const [characterType, created] = await CharacterType.findOrCreate({
        where: { nom: typeData.nom },
        defaults: typeData
      });

      if (created) {
        logger.info(`✅ Type de personnage créé: ${characterType.nom}`);
      } else {
        logger.info(`ℹ️  Type de personnage déjà existant: ${characterType.nom}`);
      }
    }

    logger.info('✅ Initialisation des types de personnages terminée');
  } catch (error) {
    logger.error('❌ Erreur lors de l\'initialisation des types de personnages:', error);
    throw error;
  }
};

/**
 * Script principal d'initialisation de la base de données
 */
export const initializeDatabase = async () => {
  try {
    logger.info('🚀 Début de l\'initialisation de la base de données...');

    // Synchroniser la base de données
    await syncDatabase({ alter: true });

    // Créer les types de personnages par défaut
    await initializeCharacterTypes();

    logger.info('🎉 Initialisation de la base de données terminée avec succès!');
  } catch (error) {
    logger.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
};

// Exécuter le script si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}