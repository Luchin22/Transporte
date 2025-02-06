const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51QodBtEH6OlGQNeBZkoeeYmfqwcbGVO94JC8ofokk8DnbCd1KOxytVbApLtF1zfTZGKHEfq3P3WoNvYx4bwZIetm00T1X9FRaQ'); // Reemplaza con tu clave secreta de Stripe

/**
 * Crear un Payment Intent en Stripe
 */
const createPaymentIntent = async (amount, currency = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Stripe maneja centavos
      currency,
      payment_method_types: ['card'],
    });

    return paymentIntent.client_secret;
  } catch (error) {
    console.error('Error creando Payment Intent:', error);
    throw error;
  }
};

module.exports = { createPaymentIntent };
