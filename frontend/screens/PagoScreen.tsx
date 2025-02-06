import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';

const PagoScreen = ({ route }) => {
  const { total } = route.params || {}; // El total de la compra
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    try {
      // Petición al backend para crear el PaymentIntent
      const response = await axios.post('https://transporte-production.up.railway.app/api/pagos/create-payment-intent', {
        amount: total, // El total del pago
      });
      return response.data; // El response debe incluir el clientSecret
    } catch (error) {
      console.error('Error al obtener los parámetros de Stripe:', error);
      Alert.alert('Error', 'No se pudo crear el pago.');
    }
  };

  const initializePaymentSheet = async () => {
    const { clientSecret } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Tu Empresa', // Nombre del comerciante
    });

    if (!error) {
      setLoading(true);
    } else {
      Alert.alert('Error', 'No se pudo inicializar el pago.');
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Éxito', '¡Pago exitoso!');
      // Aquí puedes hacer algo después de que el pago sea exitoso
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, [total]);

  return (
    <View>
      <Text>Total: ${total}</Text>
      <TouchableOpacity
        disabled={!loading}
        onPress={openPaymentSheet}
      >
        <Text>Pagar con Stripe</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PagoScreen;
