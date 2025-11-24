import User from '~/models/userModel';

import logger from './logger';

async function initialData() {
    try {
        const countUsers = await User.count();
        if (countUsers === 0) {
            // Vous pouvez créer des utilisateurs par défaut ici si nécessaire
            logger.info('Aucun utilisateur par défaut à créer');
        }
    } catch (err) {
        logger.error(err);
    }
    
}

export default initialData;