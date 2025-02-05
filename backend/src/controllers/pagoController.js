const pagoService = require('../services/pagoService');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51QodBtEH6OlGQNeBZkoeeYmfqwcbGVO94JC8ofokk8DnbCd1KOxytVbApLtF1zfTZGKHEfq3P3WoNvYx4bwZIetm00T1X9FRaQ'); // Usa tu clave secreta


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
    const { monto } = req.body; // El monto total que recibes desde el frontend
  
    try {
      // Crear un PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: monto, // El monto en centavos
        currency: 'usd', // Moneda
      });
  
      // Retorna el clientSecret al frontend
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error al crear el PaymentIntent:', error);
      res.status(500).json({ error: 'Error al crear el PaymentIntent' });
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
