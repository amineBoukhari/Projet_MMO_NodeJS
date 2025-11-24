import Character from '../module/character/character.model.js';
import Spell from '../module/spell/spell.model.js';
import Case from '../module/case/case.model.js';
import logger from '../config/logger.js';

/**
 * Service to handle battles between characters
 */

/**
 * Calculate distance between two positions (Manhattan distance)
 */
export const calculateDistance = (x1, y1, x2, y2) => {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
};

/**
 * Calculate euclidean distance between two positions
 */
export const calculateEuclideanDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Check if line of sight exists between two positions
 * (checks if there are no blocked cells between them)
 */
export const hasLineOfSight = async (mapId, x1, y1, x2, y2) => {
    try {
        // Bresenham's algorithm to trace a line
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;

        let currentX = x1;
        let currentY = y1;

        while (currentX !== x2 || currentY !== y2) {
            // Check current cell (except start and end positions)
            if (!(currentX === x1 && currentY === y1) && !(currentX === x2 && currentY === y2)) {
                const caseOnPath = await Case.findOne({
                    where: {
                        mapId,
                        x: currentX,
                        y: currentY
                    }
                });

                if (caseOnPath && caseOnPath.blocked) {
                    return false; // Obstacle found
                }
            }

            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                currentX += sx;
            }
            if (e2 < dx) {
                err += dx;
                currentY += sy;
            }
        }

        return true; // No obstacle
    } catch (error) {
        logger.error('Error checking line of sight:', error);
        return false;
    }
};

/**
 * Validate that an attack can be performed
 */
export const validateAttack = async (attackerId, defenderId, spellId) => {
    const errors = [];

    // Fetch characters
    const attacker = await Character.findByPk(attackerId);
    const defender = await Character.findByPk(defenderId);
    const spell = await Spell.findByPk(spellId);

    if (!attacker) {
        errors.push('Attacker character not found');
    }
    if (!defender) {
        errors.push('Defender character not found');
    }
    if (!spell) {
        errors.push('Spell not found');
    }

    if (errors.length > 0) {
        return { valid: false, errors, attacker, defender, spell };
    }

    // Check if character is not KO
    if (attacker.hp <= 0) {
        errors.push('Attacker character is KO');
    }
    if (defender.hp <= 0) {
        errors.push('Defender character is already KO');
    }

    // Check not attacking yourself
    if (attackerId === defenderId) {
        errors.push('A character cannot attack itself');
    }

    // Check minimum level for spell
    if (attacker.niveau < spell.minLevel) {
        errors.push(`Level ${spell.minLevel} required to use this spell (current level: ${attacker.niveau})`);
    }

    // Check characters are on same map
    // Note: Should add mapId field to Character model
    // For now just compare positions

    // Calculate distance
    const distance = calculateDistance(
        attacker.positionX,
        attacker.positionY,
        defender.positionX,
        defender.positionY
    );

    // Check spell range
    if (spell.range && distance > spell.range) {
        errors.push(`Target out of range (distance: ${distance}, spell range: ${spell.range})`);
    }

    return {
        valid: errors.length === 0,
        errors,
        attacker,
        defender,
        spell,
        distance
    };
};

/**
 * Calculate damage dealt
 */
export const calculateDamage = (attacker, defender, spell) => {
    // Formula: (Attacker's ATT * Spell power) - Defender's DEF
    const baseDamage = (attacker.att * spell.power) / 10; // Divide by 10 to balance
    const damage = Math.max(1, Math.floor(baseDamage - defender.def / 2));

    return damage;
};

/**
 * Execute an attack
 */
export const executeAttack = async (attackerId, defenderId, spellId, options = {}) => {
    try {
        // Validate attack
        const validation = await validateAttack(attackerId, defenderId, spellId);

        if (!validation.valid) {
            return {
                success: false,
                errors: validation.errors
            };
        }

        const { attacker, defender, spell, distance } = validation;

        // Check line of sight if needed (ranged spells)
        if (options.checkLineOfSight && spell.range > 1) {
            const hasLOS = await hasLineOfSight(
                options.mapId || 1, // TODO: get map from character
                attacker.positionX,
                attacker.positionY,
                defender.positionX,
                defender.positionY
            );

            if (!hasLOS) {
                return {
                    success: false,
                    errors: ['No line of sight to target']
                };
            }
        }

        // Calculate damage
        const damage = calculateDamage(attacker, defender, spell);

        // Apply damage
        const newHp = Math.max(0, defender.hp - damage);
        const wasKilled = newHp === 0;

        await defender.update({ hp: newHp });

        // If defender killed, give XP to attacker
        let levelUpInfo = null;
        if (wasKilled) {
            const xpGained = defender.niveau * 50; // XP based on defeated character's level
            const levelsGained = attacker.addXp(xpGained);
            await attacker.save();

            levelUpInfo = {
                xpGained,
                levelsGained,
                newLevel: attacker.niveau
            };
        }

        logger.info(`Combat: ${attacker.nom} attacks ${defender.nom} with ${spell.name} - ${damage} damage`);

        return {
            success: true,
            attacker: {
                id: attacker.id,
                nom: attacker.nom,
                hp: attacker.hp,
                niveau: attacker.niveau,
                xp: attacker.xp
            },
            defender: {
                id: defender.id,
                nom: defender.nom,
                hp: newHp,
                wasKilled
            },
            spell: {
                id: spell.id,
                name: spell.name,
                power: spell.power
            },
            combat: {
                distance,
                damage,
                wasKilled
            },
            levelUp: levelUpInfo
        };
    } catch (error) {
        logger.error('Error executing attack:', error);
        return {
            success: false,
            errors: [error.message]
        };
    }
};

export default {
    calculateDistance,
    calculateEuclideanDistance,
    hasLineOfSight,
    validateAttack,
    calculateDamage,
    executeAttack
};
