const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

router.get('/', pagoController.getAllPagos);
router.get('/:id', pagoController.getPagoById);
router.post('/', pagoController.createPago);
router.put('/:id', pagoController.updatePago);
router.delete('/:id', pagoController.deletePago);
router.post('/create-payment-intent', pagoController.createPaymentIntent);


module.exports = router;
