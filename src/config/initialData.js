import User from '../module/user/user.model.js';
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

export default initialData;