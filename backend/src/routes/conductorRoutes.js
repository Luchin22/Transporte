const express = require('express');
const router = express.Router();
const conductorController = require('../controllers/conductorController');

router.get('/', conductorController.getAllConductores);
router.get('/:id', conductorController.getConductorById);
router.post('/', conductorController.createConductor);
router.put('/:id', conductorController.updateConductor);
router.delete('/:id', conductorController.deleteConductor);

module.exports = router;
