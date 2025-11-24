import Character from "../character/character.model.js";
import Spell from "./spell.model.js";

exports.getAll = async (req, res) => {
    try {
        let roleList = await Role.findAll();
        res.status(200).json(roleList);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

exports.getById = async (req, res) => {
    try {
        let role = await Role.findOne({
            where: {
                id: req.params.id
            },
            include: [User]
        });
        res.status(200).json(role);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

exports.create = async (req, res) => {
    try {
        let role = await Role.create({
            title: req.body.title,
            code: req.body.code
        });
        res.status(201).json(role);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

exports.update = async (req, res) => {
    try {
        let role = await Role.create({
            title: req.body.title,
            code: req.body.code
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(201).json(role);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

exports.delete =  async (req, res) => {
    try {
        let role = await Role.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(role);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

export const attack = async (req, res) => {
    const attack = await Character.findOne({
        where: req.params.attack
    });

    const defense = await Character.findOne({
        where: req.params.defense
    })

    const spell = await Spell.findOne({
        where: req.params.spell
    })

    if(attack.isKo || defense.isKo) {
        return res.redirect(`/api/spell/fight/end/${req.params.attack}/${req.params.defense}}`);
    }
    
    Spell.attack(attack, spell, defense)
}

export const endFight = async (req, res) => {
    const attack = await Character.findOne({
        where: req.params.attack
    });

    const defense = await Character.findOne({
        where: req.params.defense
    })

    if (attack.isKo){
        return res.status(200).json({message: "Vous avez perdu !"})
    }

    if (defense.isKo){
        return res.status(200).json({message: "Vous avez gagné !"})
    }
}