import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { shareAsync } from 'expo-sharing';

const PagoScreen = ({ route }) => {
  const { numTickets = 0, selectedSeats = [], salida = 'Ciudad A', destino = 'Ciudad B', fecha = '2024-12-25', nombre = 'Juan Pérez' } = route.params || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [tarjeta, setTarjeta] = useState('');
  const [expiracion, setExpiracion] = useState('');
  const [cvv, setCvv] = useState('');

  // Función para generar el PDF
  const generatePDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // Tamaño A4

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const { width, height } = page.getSize();

      page.drawText('Confirmación de Compra', { x: 50, y: height - 50, size: 20, font });
      page.drawText(`Nombre: ${nombre}`, { x: 50, y: height - 100, size: 12, font });
      page.drawText(`Fecha: ${fecha}`, { x: 50, y: height - 120, size: 12, font });
      page.drawText(`Salida: ${salida}`, { x: 50, y: height - 140, size: 12, font });
      page.drawText(`Destino: ${destino}`, { x: 50, y: height - 160, size: 12, font });
      page.drawText(`Número de boletos: ${numTickets}`, { x: 50, y: height - 180, size: 12, font });
      page.drawText(`Asientos: ${selectedSeats.join(', ')}`, { x: 50, y: height - 200, size: 12, font });
      page.drawText(`Número del Bus: 1234`, { x: 50, y: height - 220, size: 12, font });
      page.drawText(`Código de barras: 987654321`, { x: 50, y: height - 240, size: 12, font });

      // Guardar el PDF como un Uint8Array
      const pdfBytes = await pdfDoc.save();

      // Codificar a Base64
      const base64PDF = pdfBytes.toString('base64');

      // Ruta del archivo
      const filePath = `${FileSystem.documentDirectory}boleto.pdf`;

      // Usar writeAsStringAsync para guardar el archivo en base64
      await FileSystem.writeAsStringAsync(filePath, base64PDF, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Compartir el archivo PDF
      await shareAsync(filePath);
    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
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
    generatePDF();
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
