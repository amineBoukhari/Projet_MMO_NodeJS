import Spell from "./spell.model.js";

export const getAllSpells = async (req, res) => {
    try {
        let spellList = await Spell.findAll();
        res.status(200).json(spellList);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

export const getSpellById = async (req, res) => {
    try {
        let spell = await Spell.findOne({
            where: {
                id: req.params.id
            },
        });
        res.status(200).json(spell);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

export const createSpell = async (req, res) => {
    try {
        let spell = await Spell.create({
            name: req.body.name,
            description: req.body.description,
            power: req.body.power,
            type: req.body.type,
            minLevel: req.body.minLevel
        });
        res.status(201).json(spell);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

export const updateSpell = async (req, res) => {
    try {
        let spell = await Spell.update({
            name: req.body.name,
            description: req.body.description,
            power: req.body.power,
            type: req.body.type,
            minLevel: req.body.minLevel
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(201).json(spell);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

export const deleteSpell =  async (req, res) => {
    try {
        let spell = await Spell.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(spell);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

export const attack = async (req, res) => {
    // TODO : Besoin des personnages
}

export const endFight = async (req, res) => {
    // TODO : Besoin des personnages 
    return true;
}