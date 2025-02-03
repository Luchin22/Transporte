const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

router.get('/', reservaController.getAllReservas);
router.get('/:id', reservaController.getReservaById);
router.post('/', reservaController.createReserva);  // Aquí se maneja la reserva de asientos
router.put('/:id', reservaController.updateReserva);
router.delete('/:id', reservaController.deleteReserva);

module.exports = router;
