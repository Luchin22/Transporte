const express = require('express');
const router = express.Router();
const historialReservaController = require('../controllers/historialreservaController');

router.get('/', historialReservaController.getAllHistorialReservas);
router.get('/:id', historialReservaController.getHistorialReservaById);
router.post('/', historialReservaController.createHistorialReserva);
router.put('/:id', historialReservaController.updateHistorialReserva);
router.delete('/:id', historialReservaController.deleteHistorialReserva);

module.exports = router;
