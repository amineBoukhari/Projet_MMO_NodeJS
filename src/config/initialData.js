import User from '../module/user/user.model.js';
import bcrypt from 'bcrypt';

import logger from './logger.js';
import CharacterType from '../module/characterType/characterType.model.js';
import Spell from '../module/spell/spell.model.js';

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

        const characterTypesCount = await CharacterType.count();
        if (characterTypesCount === 0) {
            const characterTypesData = [
                {
                    name: 'Guerrier',
                    description: 'Un combattant puissant spécialisé dans le combat rapproché.',
                    bonusHP: 50,
                    bonusAtt: 10,
                    bonusDef: 15
                },
                {
                    name: 'Mage',
                    description: 'Un lanceur de sorts capable d’utiliser la magie offensive.',
                    bonusHP: 10,
                    bonusAtt: 25,
                    bonusDef: 5
                },
                {
                    name: 'Archer',
                    description: 'Un combattant à distance expert dans l’utilisation de l’arc.',
                    bonusHP: 20,
                    bonusAtt: 18,
                    bonusDef: 8
                },
                {
                    name: 'Assassin',
                    description: 'Un expert de la furtivité et des attaques critiques.',
                    bonusHP: 15,
                    bonusAtt: 30,
                    bonusDef: 3
                },
                {
                    name: 'Paladin',
                    description: 'Un chevalier sacré associant magie de soutien et combat.',
                    bonusHP: 40,
                    bonusAtt: 12,
                    bonusDef: 20
                }
            ];

            for (const type of characterTypesData) {
                await CharacterType.create(type);
            }

            logger.info('✅ Default character types created successfully');
        } else {
            logger.info('ℹ️ There are already character types in database. Skipped initialization');
        }

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
        } else {
            logger.info('ℹ️ There are already spells in database. Skipped initialization');
        }
    } catch (err) {
        logger.error('❌ Error initializing data:', err);
    }
    
}

export default initialData;