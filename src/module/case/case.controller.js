import Case from './case.model.js';

export const createCase = async (req, res) => {
  try {
    const { mapId, x, y, terrainType, blocked, options } = req.body;

    if (mapId == null || x == null || y == null || !terrainType) {
      return res.status(400).json({ message: 'mapId, x, y et terrainType sont obligatoires' });
    }

    const newCase = await Case.create({ mapId, x, y, terrainType, blocked, options });
    return res.status(201).json(newCase);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la création de la case' });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const tile = await Case.findByPk(id);

    if (!tile) {
      return res.status(404).json({ message: 'Case non trouvée' });
    }

    return res.status(200).json(tile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la récupération de la case' });
  }
};

export const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { terrainType, blocked, options } = req.body;

    const tile = await Case.findByPk(id);
    if (!tile) {
      return res.status(404).json({ message: 'Case non trouvée' });
    }

    if (terrainType !== undefined) tile.terrainType = terrainType;
    if (blocked !== undefined) tile.blocked = blocked;
    if (options !== undefined) tile.options = options;

    await tile.save();

    return res.status(200).json(tile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour de la case' });
  }
};

export const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;
    const tile = await Case.findByPk(id);

    if (!tile) {
      return res.status(404).json({ message: 'Case non trouvée' });
    }

    await tile.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la suppression de la case' });
  }
};
