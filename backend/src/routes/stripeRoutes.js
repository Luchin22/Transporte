const express = require('express');
const { createPaymentIntent } = require('../services/stripeService');

const router = express.Router();

/**
 * Ruta para crear un Payment Intent
 */
router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const clientSecret = await createPaymentIntent(amount, currency);
    res.json({ clientSecret });
  } catch (error) {
    res.status(500).json({ error: 'Error procesando el pago' });
  }
});

module.exports = router;
