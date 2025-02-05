const pagoService = require('../services/pagoService');
const stripe = require('stripe')('sk_test_51QodBtEH6OlGQNeBZkoeeYmfqwcbGVO94JC8ofokk8DnbCd1KOxytVbApLtF1zfTZGKHEfq3P3WoNvYx4bwZIetm00T1X9FRaQ'); // Reemplaza con tu clave secreta de Stripe

// Nuevo método para crear un PaymentIntent
exports.createPaymentIntent = async (req, res) => {
  const { monto } = req.body;

  if (!monto) {
    return res.status(400).json({ error: 'El monto es obligatorio' });
  }

  try {
    // Crear el PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: monto * 100,  // Convertir monto a centavos
      currency: 'usd',      // O la moneda que estés utilizando
      payment_method_types: ['card'],
    });

    // Enviar la respuesta con el client_secret
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error al crear PaymentIntent:', error);
    res.status(500).json({ error: 'Hubo un problema al procesar el pago' });
  }
};

exports.getAllPagos = async (req, res) => {
    try {
        const pagos = await pagoService.getAllPagos();
        res.json(pagos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPagoById = async (req, res) => {
    try {
        const pago = await pagoService.getPagoById(req.params.id);
        res.json(pago);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.createPago = async (req, res) => {
    try {
        const pago = await pagoService.createPago(req.body);
        res.status(201).json(pago);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updatePago = async (req, res) => {
    try {
        await pagoService.updatePago(req.params.id, req.body);
        res.json({ message: 'Pago actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deletePago = async (req, res) => {
    try {
        await pagoService.deletePago(req.params.id);
        res.json({ message: 'Pago eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
