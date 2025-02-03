const express = require('express');
const router = express.Router();
const historialReservaController = require('../controllers/historialreservaController');

// Middleware para validar el ID
const validateId = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID debe ser un número válido' });
    }
    next();
};

// Obtener todas las reservas
router.get('/', historialReservaController.getAllHistorialReservas);

router.get('/reservas-all', historialReservaController.getAllReservas);

// Obtener una reserva por ID
router.get('/:id',  historialReservaController.getHistorialReservaById);

// Crear una nueva reserva
router.post('/', historialReservaController.createHistorialReserva);
router.post('/reserva', historialReservaController.createReserva); // Nueva ruta específica para crear reservas


// Actualizar una reserva existente
router.put('/:id', validateId, historialReservaController.updateHistorialReserva);

// Eliminar una reserva
router.delete('/:id', validateId, historialReservaController.deleteHistorialReserva);

module.exports = router;
