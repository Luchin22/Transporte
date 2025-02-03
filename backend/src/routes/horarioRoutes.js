const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

router.get('/', horarioController.getAllHorarios);
router.get('/horarios-con-capacidad', horarioController.getHorariosByBus);
router.get('/:id', horarioController.getHorarioById);
router.post('/', horarioController.createHorario);
router.put('/:id', horarioController.updateHorario);
router.put('/:id/actualizar-hora', horarioController.updateHora);
router.delete('/:id', horarioController.deleteHorario);

module.exports = router;
