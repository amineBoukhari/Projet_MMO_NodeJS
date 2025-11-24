import CharacterType from "./characterType.model.js";

export const getAllCharacterTypes = async (req, res) => {
    try {
        let characterTypeList = await CharacterType.findAll();
        res.status(200).json(characterTypeList);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

export const getCharacterTypeById = async (req, res) => {
    try {
        let characterType = await CharacterType.findOne({
            where: {
                id: req.params.id
            },
        });
        res.status(200).json(characterType);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

export const createCharacterType = async (req, res) => {
    try {
        let characterType = await CharacterType.create({
            name: req.body.name,
            description: req.body.description,
            bonusHP: req.body.bonusHP,
            bonusATT: req.body.bonusATT,
            bonusDEF: req.body.bonusDEF
        });
        res.status(201).json(characterType);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

export const updateCharacterType = async (req, res) => {
    try {
        let characterType = await CharacterType.create({
            name: req.body.name,
            description: req.body.description,
            bonusHP: req.body.bonusHP,
            bonusATT: req.body.bonusATT,
            bonusDEF: req.body.bonusDEF
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(201).json(characterType);
    } catch (e) {
        res.status(400).json(e.message);
    }
}

export const deleteCharacterType =  async (req, res) => {
    try {
        let characterType = await characterType.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(characterType);
    } catch (e) {
        res.status(400).json(e.message);
    }
}