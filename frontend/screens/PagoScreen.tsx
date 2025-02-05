import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';

const PagoScreen = ({ route, navigation }) => {
  const { numTickets = 0, selectedSeats = [], origen = '', destino = '', fechaIda = '', idBus = '', monto } = route.params || {};

  const { confirmPayment } = useStripe(); // Para confirmar el pago

  const [total, setTotal] = useState(monto || 0); // Total calculado
  const [clientSecret, setClientSecret] = useState<string | null>(null); // Guardar el clientSecret para confirmar el pago
  const [cardDetails, setCardDetails] = useState<any>(null); // Estado para almacenar los detalles de la tarjeta

  // Obtener el clientSecret desde el backend
  const fetchClientSecret = async () => {
    try {
      const response = await axios.post('https://transporte-production.up.railway.app/api/pagos', {
        monto: total * 100, // Stripe espera el monto en centavos
      });
      setClientSecret(response.data.clientSecret); // Guardar el clientSecret
    } catch (error) {
      console.error('Error al obtener el clientSecret', error);
      Alert.alert('Error', 'No se pudo obtener el clientSecret.');
    }
  };

  useEffect(() => {
    fetchClientSecret();
  }, []);

  // Función para manejar el pago con Stripe
  const handlePagoStripe = async () => {
    if (!clientSecret || !cardDetails) {
      Alert.alert('Error', 'Faltan datos para procesar el pago');
      return;
    }

    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card', // Usamos 'Card' como el tipo de método de pago
      paymentMethodData: {
        card: cardDetails, // Los detalles de la tarjeta obtenidos de CardField
        billingDetails: {
          name: 'Usuario de prueba',
          email: 'usuario@correo.com',
        },
      },
    });

    if (error) {
      console.error('Error en el pago', error);
      Alert.alert('Error', error.message);
    } else if (paymentIntent?.status === 'Succeeded') {
      Alert.alert('Éxito', 'Pago realizado con éxito');
      navigation.navigate('Historial'); // Navegar a otra pantalla si es necesario
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pago de Boleto</Text>
      <Text style={styles.text}>Total: ${total}</Text>
      
      {/* Campo para ingresar los datos de la tarjeta */}
      <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: '4242 4242 4242 4242', // Usar un número de tarjeta de prueba
        }}
        onCardChange={(cardDetails) => setCardDetails(cardDetails)} // Captura los detalles de la tarjeta
        style={styles.cardField}
      />

      <TouchableOpacity style={styles.button} onPress={handlePagoStripe}>
        <Text style={styles.buttonText}>Pagar con Stripe</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PagoScreen;
