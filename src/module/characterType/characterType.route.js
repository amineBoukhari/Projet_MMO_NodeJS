const express = require('express');
const roleController = require('./spell.controller.js');
const router = express.Router();
const auth = require('../auth/auth.middleware.js')
const hastRole = require('./hasRole.middleware.js');

router.get('/',roleController.getAll);
router.get('/:id',roleController.getById);
router.post('/', auth, hastRole("ROLE_ADMIN"), roleController.create);
router.put('/:id',roleController.update);
router.delete('/:id',roleController.delete);

module.exports = router;