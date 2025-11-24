import Map from './map.model.js';
import Case from '../case/case.model.js';

export const createMap = async (req, res) => {
	try {
		const { name, width, height, description } = req.body;

		if (!name || !width || !height) {
			return res.status(400).json({ message: 'name, width et height sont obligatoires' });
		}

		const map = await Map.create({ name, width, height, description });

		return res.status(201).json(map);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Erreur lors de la création de la map' });
	}
};

export const getMaps = async (_req, res) => {
	try {
		const maps = await Map.findAll();
		return res.status(200).json(maps);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Erreur lors de la récupération des maps' });
	}
};

export const getMapById = async (req, res) => {
	try {
		const { id } = req.params;
		const map = await Map.findByPk(id);

		if (!map) {
			return res.status(404).json({ message: 'Map non trouvée' });
		}

		return res.status(200).json(map);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Erreur lors de la récupération de la map' });
	}
};

export const getMapCases = async (req, res) => {
	try {
		const { id } = req.params;

		const map = await Map.findByPk(id, {
			include: [{
				model: Case,
				as: 'cases'
			}]
		});

		if (!map) {
			return res.status(404).json({ message: 'Map non trouvée' });
		}

		// Option simple : renvoyer directement les cases en JSON
		return res.status(200).json({
			id: map.id,
			name: map.name,
			width: map.width,
			height: map.height,
			description: map.description,
			cases: map.cases
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Erreur lors de la récupération de la grille' });
	}
};

// Seed simple : génération d'une map 10x10 avec cases "plaine"
export const seedOneMapWithGrid = async (_req, res) => {
	try {
		const width = 10;
		const height = 10;

		const map = await Map.create({
			name: 'Map de démo 10x10',
			width,
			height,
			description: 'Carte de démonstration pour le MMO'
		});

		const casesToCreate = [];
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				casesToCreate.push({
					mapId: map.id,
					x,
					y,
					terrainType: 'plaine',
					blocked: false
				});
			}
		}

		await Case.bulkCreate(casesToCreate);

		return res.status(201).json({
			message: 'Map 10x10 et cases générées',
			mapId: map.id
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Erreur lors du seed de la map 10x10' });
	}
};

// Seed avancé : map "réaliste" avec murs/obstacles
export const seedRealisticMap = async (_req, res) => {
	try {
		const width = 20;
		const height = 20;

		const map = await Map.create({
			name: 'Starter Map 20x20',
			width,
			height,
			description: 'Carte de départ avec murs et obstacles'
		});

		const casesToCreate = [];

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				let terrainType = 'plaine';
				let blocked = false;

				// Bordure de la map = murs bloquants
				if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
					terrainType = 'mur';
					blocked = true;
				} else if ((x % 5 === 0 && y % 2 === 0) || (x % 7 === 0 && y % 3 === 0)) {
					// Quelques obstacles intérieurs (forêt/montagne)
					terrainType = Math.random() < 0.5 ? 'forêt' : 'montagne';
					blocked = true;
				}

				casesToCreate.push({
					mapId: map.id,
					x,
					y,
					terrainType,
					blocked
				});
			}
		}

		await Case.bulkCreate(casesToCreate);

		return res.status(201).json({
			message: 'Starter Map 20x20 avec murs et obstacles générée',
			mapId: map.id
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Erreur lors du seed de la map réaliste' });
	}
};

