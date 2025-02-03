const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

router.get('/', busController.getAllBuses);
router.get('/:id', busController.getBusById);
router.post('/', busController.createBus);
router.put('/:id', busController.updateBus);
router.patch('/:id/update-dato', busController.updateBusDato);
router.delete('/:id', busController.deleteBus);
router.patch('/:id/route', busController.updateRoute);


module.exports = router;
