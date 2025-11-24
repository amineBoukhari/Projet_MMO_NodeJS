import User from '../module/user/user.model.js';
import Map from '../module/map/map.model.js';
import Case from '../module/case/case.model.js';

import logger from './logger.js';

async function seedUsers() {
  const countUsers = await User.count();
  if (countUsers === 0) {
    // Example: no default user  
    logger.info('No users found, skipping user seeding.');
    // Or here you can create an admin if needed
    // await User.create({ ... });
  }
}

async function seedMaps() {
  const countMaps = await Map.count();
  if (countMaps > 0) {
    logger.info('Maps already exist, skipping map seeding.');
    return;
  }

  // Create a base map
  const map = await Map.create({
    name: 'Starter Zone',
    width: 10,
    height: 10,
    description: 'Starting zone for testing'
  });

  // Generate 10x10 grid
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
import bcrypt from 'bcrypt';

import logger from './logger.js';

async function initialData() {
    try {
        const countUsers = await User.count();
        if (countUsers === 0) {
            // Create default admin user
            const adminPasswordHash = await bcrypt.hash('admin123', 10);
            await User.create({
                username: 'admin',
                email: 'admin@example.com',
                passwordHash: adminPasswordHash,
                role: 'admin',
                bio: 'Default administrator account'
            });
            
            // Create default player user
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
            logger.info('ℹ️ Users already exist, skipping initialization');
        }
    } catch (err) {
        logger.error('❌ Error initializing data:', err);
    }
  }

  await Case.bulkCreate(cases);
  logger.info(`Map "${map.name}" created with ${cases.length} cases`);
}

async function initialData() {
  try {
    await seedUsers();
    await seedMaps();
  } catch (err) {
    logger.error('Error during initial data seeding:', err);
  }
}

export default initialData;