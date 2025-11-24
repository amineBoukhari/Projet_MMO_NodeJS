import { Op } from 'sequelize';
import User from '../module/user/user.model.js';
import Character from '../module/character/character.model.js';
import CharacterType from '../module/characterType/characterType.model.js';
import Map from '../module/map/map.model.js';
import Case from '../module/case/case.model.js';
import bcrypt from 'bcrypt';
import logger from './logger.js';
import Spell from '../module/spell/spell.model.js';

/**
 * Seed default users (admin and player)
 */
async function seedUsers() {
  const countUsers = await User.count();
  if (countUsers === 0) {
    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      bio: 'Default administrator account'
    });

    // Create player user
    const playerPasswordHash = await bcrypt.hash('player123', 10);
    await User.create({
      username: 'player1',
      email: 'player1@example.com',
      passwordHash: playerPasswordHash,
      role: 'player',
      bio: 'Default player account'
    });

    logger.info('✅ Default users created successfully');
  } else {
    logger.info('ℹ️ Users already exist, skipping user initialization');
  }
}

/**
 * Seed character types (Warrior, Mage, Archer)
 */
async function seedCharacterTypes() {
  const countTypes = await CharacterType.count();
  if (countTypes === 0) {
    const types = [
      { 
        name: 'Guerrier', 
        description: 'Strong melee fighter with high defense', 
        bonusHP: 50, 
        bonusATT: 8, 
        bonusDEF: 6 
      },
      { 
        name: 'Mage', 
        description: 'Powerful spellcaster with low defense', 
        bonusHP: 10, 
        bonusATT: 18, 
        bonusDEF: 2 
      },
      { 
        name: 'Archer', 
        description: 'Agile ranged attacker', 
        bonusHP: 20, 
        bonusATT: 12, 
        bonusDEF: 3 
      }
    ];
    
    await CharacterType.bulkCreate(types);
    logger.info('✅ Default character types created');
  } else {
    logger.info('ℹ️ Character types already exist, skipping types initialization');
  }
}

/**
 * Seed starter characters for default player
 */
async function seedStarterCharacters() {
  const player = await User.findOne({ where: { username: 'player1' } });
  
  if (!player) {
    logger.warn('⚠️ player1 user not found; skipping starter character creation');
    return;
  }

  const existingChars = await Character.count({ where: { joueurId: player.id } });
  if (existingChars > 0) {
    logger.info('ℹ️ Player already has characters, skipping starter character creation');
    return;
  }

  // Get character types
  const warrior = await CharacterType.findOne({ where: { name: 'Guerrier' } });
  const mage = await CharacterType.findOne({ where: { name: 'Mage' } });

  // Create warrior character
  if (warrior) {
    const baseHp = 100 + warrior.bonusHP;
    await Character.create({
      nom: 'Thorgal',
      joueurId: player.id,
      typeId: warrior.id,
      hp: baseHp,
      hpMax: baseHp,
      att: 10 + warrior.bonusATT,
      def: 5 + warrior.bonusDEF,
      xp: 0,
      niveau: 1,
      pointsDisponibles: 0,
      positionX: 0,
      positionY: 0,
      inventaire: []
    });
    logger.info('✅ Starter character Thorgal (Warrior) created');
  }

  // Create mage character
  if (mage) {
    const baseHp = 100 + mage.bonusHP;
    await Character.create({
      nom: 'Elyra',
      joueurId: player.id,
      typeId: mage.id,
      hp: baseHp,
      hpMax: baseHp,
      att: 10 + mage.bonusATT,
      def: 5 + mage.bonusDEF,
      xp: 0,
      niveau: 1,
      pointsDisponibles: 0,
      positionX: 1,
      positionY: 0,
      inventaire: []
    });
    logger.info('✅ Starter character Elyra (Mage) created');
  }
}

/**
 * Seed maps and cases (tiles)
 */
async function seedMaps() {
  const countMaps = await Map.count();
  if (countMaps > 0) {
    logger.info('ℹ️ Maps already exist, skipping map seeding');
    return;
  }

  // Create starter map
  const map = await Map.create({
    name: 'Starter Zone',
    width: 10,
    height: 10,
    description: 'Starting zone for new players'
  });

  // Generate 10x10 grid of cases
  const cases = [];
  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      cases.push({
        mapId: map.id,
        x,
        y,
        terrainType: 'plain',
        blocked: false
      });
    }
  }

  await Case.bulkCreate(cases);
  logger.info(`✅ Map "${map.name}" created with ${cases.length} cases`);
}

async function seedSpells() {
    const spellsCount = await Spell.count();
    if (spellsCount === 0) {

        const spellsData = [
            {
                name: 'Boule de Feu',
                description: 'Projette une puissante boule de feu sur un ennemi.',
                puissance: 40,
                type: 'feu',
                niveauMinimum: 1
            },
            {
                name: 'Jet d’Eau',
                description: 'Un jet d’eau qui repousse et blesse légèrement l’ennemi.',
                puissance: 25,
                type: 'eau',
                niveauMinimum: 1
            },
            {
                name: 'Soin Mineur',
                description: 'Restaure une petite quantité de points de vie.',
                puissance: 30,
                type: 'soin',
                niveauMinimum: 1
            },
            {
                name: 'Bouclier Sacré',
                description: 'Crée un bouclier protecteur augmentant la défense.',
                puissance: 0,
                type: 'buff',
                niveauMinimum: 2
            },
            {
                name: 'Éclair',
                description: 'Un éclair foudroyant frappant instantanément la cible.',
                puissance: 50,
                type: 'feu',
                niveauMinimum: 3
            },
            {
                name: 'Vague de Givre',
                description: 'Inflige des dégâts de glace et ralentit l’ennemi.',
                puissance: 35,
                type: 'eau',
                niveauMinimum: 2
            }
        ];

        for (const spell of spellsData) {
            await Spell.create(spell);
        }

        logger.info('✅ Default spells created successfully');
    }
}

/**
 * Main initialization function
 * Called on server startup to populate database with initial data
 */
async function initialData() {
  try {
    logger.info('🔄 Starting database initialization...');
    
    await seedUsers();
    await seedSpells();
    await seedCharacterTypes();
    await seedStarterCharacters();
    await seedMaps();
    
    logger.info('✅ Database initialization completed successfully');
  } catch (err) {
    logger.error('❌ Error initializing data:', err);
  }
}

export default initialData;
