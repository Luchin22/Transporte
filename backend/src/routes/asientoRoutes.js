const express = require('express');
const router = express.Router();
const asientoController = require('../controllers/asientoController');

router.get('/', asientoController.getAllAsientos);
router.get('/:id', asientoController.getAsientoById);
router.post('/', asientoController.createAsiento);
router.put('/:id', asientoController.updateAsiento);
router.delete('/:id', asientoController.deleteAsiento);

module.exports = router;
