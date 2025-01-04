import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';

const PaymentScreen = ({ navigation }) => {
  // Estado para los campos del formulario
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Función para manejar el pago
  const handlePayment = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      Alert.alert('Error', 'Por favor completa todos los campos');
    } else {
      // Aquí puedes realizar la lógica para procesar el pago
      console.log('Pago realizado:', { cardNumber, expiryDate, cvv });

      // Navegar de vuelta a la pantalla de inicio o confirmación
      Alert.alert('Pago exitoso', '¡Tu pago ha sido procesado exitosamente!');
      navigation.goBack(); // Volver a la pantalla anterior
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de Pago</Text>

      <TextInput
        style={styles.input}
        placeholder="Número de tarjeta"
        keyboardType="numeric"
        maxLength={16}
        value={cardNumber}
        onChangeText={(text) => setCardNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de expiración (MM/AA)"
        keyboardType="numeric"
        maxLength={5}
        value={expiryDate}
        onChangeText={(text) => setExpiryDate(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="CVV"
        keyboardType="numeric"
        maxLength={3}
        value={cvv}
        onChangeText={(text) => setCvv(text)}
      />

      <Button title="Realizar pago" onPress={handlePayment} />
      <Button
        title="Cancelar"
        onPress={() => navigation.goBack()}
        color="#FF6347" // Color para el botón de cancelación
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    borderRadius: 5,
  },
});

export default PaymentScreen;
