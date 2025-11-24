import { Op } from 'sequelize';
import User from '../module/user/user.model.js';
import Character from '../module/character/character.model.js';
import CharacterType from '../module/characterType/characterType.model.js';
import bcrypt from 'bcrypt';
import logger from './logger.js';

async function initialData() {
  try {
    // Count users
    const countUsers = await User.count();

    if (countUsers === 0) {
      const adminPasswordHash = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        bio: 'Default administrator account'
      });

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

    // Create character types using the model's defined attributes (safer)
    const countTypes = await CharacterType.count();
    if (countTypes === 0) {
      const types = [
        { name: 'Guerrier', description: 'Cogne fort et encaisse.', bonusHP: 50, bonusATT: 8, bonusDEF: 6 },
        { name: 'Mage', description: 'Puissance magique, fragile en mêlée.', bonusHP: 10, bonusATT: 18, bonusDEF: 2 },
        { name: 'Archer', description: 'Tire à distance, agile.', bonusHP: 20, bonusATT: 12, bonusDEF: 3 }
      ];
      await CharacterType.bulkCreate(types);
      logger.info('✅ Default character types created');
    } else {
      logger.info('ℹ️ Character types already exist, skipping types initialization');
    }

    // Create starter characters for player1 if none exist
    const player = await User.findOne({ where: { username: 'player1' } });
    if (player) {
      const existingChars = await Character.count({ where: { joueurId: player.id } });
      if (existingChars === 0) {
        // Get all types and match in JS to avoid generating WHERE on potentially non-existent columns
        const allTypes = await CharacterType.findAll();

        const findType = (label) => {
          return allTypes.find(t => {
            // check common possibilities (model property names or legacy column names)
            const vals = [
              t.name,
              t.nom, // may be undefined
              t.dataValues && t.dataValues.name,
              t.dataValues && t.dataValues.nom
            ];
            return vals.some(v => v && String(v).toLowerCase() === String(label).toLowerCase());
          });
        };

        const warrior = findType('Guerrier');
        const mage = findType('Mage');

        if (warrior) {
          const baseHp = 100 + (warrior.bonusHP ?? warrior.dataValues?.bonusHP ?? 0);
          await Character.create({
            nom: 'Thorgal',
            joueurId: player.id,
            typeId: warrior.id,
            hp: baseHp,
            hpMax: baseHp,
            att: 10 + (warrior.bonusATT ?? warrior.bonusAtt ?? 0),
            def: 5 + (warrior.bonusDEF ?? warrior.bonusDef ?? 0),
            xp: 0,
            niveau: 1,
            pointsDisponibles: 0,
            positionX: 0,
            positionY: 0,
            inventaire: []
          });
          logger.info(`✅ Starter character Thorgal created for player ${player.username}`);
        } else {
          logger.warn('⚠️ Type Guerrier not found; skipping Thorgal creation');
        }

        if (mage) {
          const baseHp = 100 + (mage.bonusHP ?? mage.dataValues?.bonusHP ?? 0);
          await Character.create({
            nom: 'Elyra',
            joueurId: player.id,
            typeId: mage.id,
            hp: baseHp,
            hpMax: baseHp,
            att: 10 + (mage.bonusATT ?? mage.bonusAtt ?? 0),
            def: 5 + (mage.bonusDEF ?? mage.bonusDef ?? 0),
            xp: 0,
            niveau: 1,
            pointsDisponibles: 0,
            positionX: 1,
            positionY: 0,
            inventaire: []
          });
          logger.info(`✅ Starter character Elyra created for player ${player.username}`);
        } else {
          logger.warn('⚠️ Type Mage not found; skipping Elyra creation');
        }
      } else {
        logger.info('ℹ️ Player already has characters, skipping starter character creation');
      }
    } else {
      logger.warn('⚠️ player1 user not found; skipping starter character creation');
    }
  } catch (err) {
    logger.error('❌ Error initializing data:', err);
  }
}

export default initialData;