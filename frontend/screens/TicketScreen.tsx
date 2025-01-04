import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const PagoScreen = ({ route }) => {
  const { numTickets = 0, selectedSeats = [], salida = 'Ciudad A', destino = 'Ciudad B', fecha = '2024-12-25', nombre = 'Juan Pérez' } = route.params || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [tarjeta, setTarjeta] = useState('');
  const [expiracion, setExpiracion] = useState('');
  const [cvv, setCvv] = useState('');

  // Función para generar y compartir el PDF
  const printToFile = async () => {
    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body style="text-align: center;">
          <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
            Confirmación de Compra
          </h1>
          <p style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;">
            Nombre: ${nombre}
          </p>
          <p style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;">
            Fecha: ${fecha}
          </p>
          <p style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;">
            Salida: ${salida} - Destino: ${destino}
          </p>
          <p style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;">
            Boletos: ${numTickets} - Asientos: ${selectedSeats.join(', ')}
          </p>
        </body>
      </html>
    `;

    try {
      // Generar el archivo PDF
      const { uri } = await Print.printToFileAsync({ html });
      console.log('Archivo generado en:', uri);
      
      // Compartir el archivo PDF
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      Alert.alert('Éxito', 'El PDF ha sido generado y compartido.');
    } catch (error) {
      console.error('Error al generar o compartir el PDF: ', error);
      Alert.alert('Error', 'Hubo un error al generar o compartir el PDF.');
    }
  };

  // Confirmación del pago
  const handleConfirmarPago = () => {
    if (!tarjeta || !expiracion || !cvv) {
      Alert.alert('Error', 'Por favor, completa todos los campos de la tarjeta.');
      return;
    }

    setModalVisible(false);
    Alert.alert('Éxito', 'Pago realizado con éxito.');
    printToFile(); // Crear y compartir el PDF después del pago
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pago</Text>
      <Text style={styles.text}>Nombre: {nombre}</Text>
      <Text style={styles.text}>Fecha: {fecha}</Text>
      <Text style={styles.text}>Salida: {salida}</Text>
      <Text style={styles.text}>Destino: {destino}</Text>
      <Text style={styles.text}>Total de boletos seleccionados: {numTickets}</Text>
      <Text style={styles.text}>Asientos seleccionados: {selectedSeats.join(', ')}</Text>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Pagar</Text>
      </TouchableOpacity>

      {/* Modal para pago */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pago con tarjeta</Text>
            <TextInput
              style={styles.input}
              placeholder="Número de tarjeta"
              keyboardType="numeric"
              value={tarjeta}
              onChangeText={setTarjeta}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha de expiración (MM/AA)"
              value={expiracion}
              onChangeText={setExpiracion}
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="numeric"
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
            />
            <TouchableOpacity style={styles.button} onPress={handleConfirmarPago}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default PagoScreen;
