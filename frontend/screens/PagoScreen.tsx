import React, { useState, useEffect } from 'react';
import { ScrollView, Dimensions, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as Print from 'expo-print';
import { useUser } from '../context/UserContext';  // Asegúrate de importar el hook
import { shareAsync } from 'expo-sharing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { StripeProvider, useStripe, CardField } from '@stripe/stripe-react-native';

const STRIPE_PUBLIC_KEY = "pk_test_51QodBtEH6OlGQNeBTJfWUDJrsYRrOfSoQhk9l3s77M4nv9YQNjgwirk6MS0kC0FGwsMiE9U0TJfOXpM8k0airsIb00FzMsTj24"; // Reemplaza con tu clave pública de Stripe


const PagoScreen = ({ route, navigation }) => {
  const { numTickets = 0, selectedSeats = [], origen = '', destino = '', salida = '', llegada = '', nombre = '', idAsiento, nombreC = '', numeroBus = '', idBus = '', fechaIda = ''} = route.params || {};
  const { userData } = useUser(); // Datos del usuario desde el contexto

  const usuarioId = userData ? userData.usuario_id : null;
  const paymentLink = "https://buy.stripe.com/test_cN2aEY8B52v9gk8aEF";
  const handlePagoStripe = () => {
    // Abre el enlace de Stripe Checkout en el navegador
    Linking.openURL(paymentLink).catch((err) => {
      console.error("Error al abrir el enlace de Stripe", err);
      Alert.alert("Error", "Hubo un problema al abrir el enlace de pago.");
    });
  };


  const [modalVisible, setModalVisible] = useState(false);
  const [tarjeta, setTarjeta] = useState('');
  const [expiracion, setExpiracion] = useState('');
  const [cvv, setCvv] = useState('');
  const [fechaReserva, setFechaReserva] = useState(new Date().toISOString().split('T')[0]);
  const [precioUnitario, setPrecioUnitario] = useState(0); // Precio por boleto
  const [total, setTotal] = useState(0); // Total calculado
  const [estado, setEstado] = useState('Pendiente');
  const { confirmPayment } = useStripe();

  const [cardDetails, setCardDetails] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  const menuOptions = [
    { id: 1, name: 'Editar', screen: 'Editar', icon: 'edit' },
    { id: 2, name: 'Historial', screen: 'Historial', icon: 'history' },
    { id: 3, name: 'Payment', screen: 'Payment', icon: 'payment' },
    { id: 4, name: 'Salir', screen: 'Login', icon: 'logout' },
  ];

  const handleNavigation = (screen) => {
    navigation.navigate(screen, { usuario_id: userData?.usuario_id });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString();
  };

  const [fecha, setFecha] = useState(getCurrentDate());
  useEffect(() => {
    // Simula la llamada a la API para obtener el precio unitario según el origen y destino
    const fetchPrecio = async () => {
      try {
        const response = await axios.get('https://transporte-production.up.railway.app/api/rutas/rutas-con-capacidad');
        const ruta = response.data.find(
          (r) => r.origen === origen && r.destino === destino
        );
        if (ruta) {
          setPrecioUnitario(parseFloat(ruta.monto)); // Establecer el precio unitario
          setTotal(numTickets * parseFloat(ruta.monto)); // Calcular el total
        } else {
          Alert.alert('Error', 'No se encontró la ruta seleccionada.');
        }
      } catch (error) {
        console.error('Error al obtener los datos de la ruta:', error);
        Alert.alert('Error', 'Hubo un problema al obtener los datos de la ruta.');
      }
    };

    fetchPrecio();
  }, [origen, destino, numTickets]);


  useEffect(() => {
    const interval = setInterval(() => {
      setFecha(getCurrentDate());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const enviarPago = async () => {
    if (!usuarioId) {
      Alert.alert('Error', 'No se encontró el ID del usuario');
      return;
    }
  
    try {
      const seatsData = {
        numero: selectedSeats.join(','),
        id_bus: idBus,
        estado: 'ocupado',
        fecha_asiento: fechaIda,
        hora_salida: salida,
        hora_llegada: llegada,
      };
  
      // Crear asiento y obtener el id_asiento
      const seatResponse = await axios.post('https://transporte-production.up.railway.app/api/asientos', seatsData);
      const idAsientoCreado = seatResponse.data.id_asiento;
  
      if (!idAsientoCreado) {
        throw new Error('No se devolvió un ID de asiento válido.');
      }
  
      console.log('Asiento creado con ID:', idAsientoCreado);
  
      // Realizar el pago
      const data = {
        monto: total,
        fecha_pago: fechaReserva,
        metodo_pago: 'Tarjeta',
        estado_pago: 'Completo',
        usuario_id: usuarioId,
        id_asiento: idAsientoCreado,
        id_bus: idBus,
      };
  
      const responsePago = await axios.post('https://transporte-production.up.railway.app/api/pagos', data);
      console.log('Pago enviado correctamente:', responsePago.data);
  
      const dataHistorial = {
        id_pago: responsePago.data.id_pago,
        estado: 'Completo',
        categoria: 'Pago',
        usuario_id: usuarioId,
      };
  
      const responseHistorial = await axios.post('https://transporte-production.up.railway.app/api/historial-reservas', dataHistorial);
      console.log('Historial de reserva creado correctamente:', responseHistorial.data);
  
      Alert.alert('Éxito', 'Pago realizado y historial registrado con éxito.');
      navigation.navigate('Historial', {
        origen,
        pasajeros: numTickets,
        usuario_id: userData?.usuario_id,
      });
    } catch (error) {
      console.error('Error al enviar el pago o crear el historial:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Hubo un problema al procesar el pago o al registrar el historial: ${error.response ? error.response.data.message : error.message}');
    }
  };
  

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post('https://transporte-production.up.railway.app/api/stripe/create-payment-intent', {
        amount: Math.round(total * 100),  // Convertimos a centavos
        currency: 'usd',
      });
      
      setClientSecret(response.data.clientSecret);
      return response.data.clientSecret;
    } catch (error) {
      console.error("Error creando Payment Intent:", error);
      Alert.alert("Error", "Hubo un problema al procesar el pago.");
    }
  };

  const handleConfirmarPago = async () => {
    if (!clientSecret) {
      const secret = await createPaymentIntent();
      if (!secret) return;
    }

    if (!cardDetails?.complete) {
      Alert.alert("Error", "Por favor, completa los datos de la tarjeta.");
      return;
    }

    const { error, paymentIntent } = await confirmPayment(clientSecret, { paymentMethodType: 'Card' });

    if (error) {
      Alert.alert('Error', `Pago fallido: ${error.message}`);
      console.log('Error en el pago:', error);
    } else if (paymentIntent) {
      Alert.alert('Éxito', 'Pago realizado correctamente.');
      setModalVisible(false);

      enviarPago();
  
      printToFile('Confirmación de Compra');
    }
  };
     

    

  const printToFile = async (tipo = 'Confirmación de Compra') => {
    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body style="text-align: center;">
          <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
            ${tipo}
          </h1>
          <p style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;">
            Nombre: ${userData?.nombre} ${userData?.apellido}
          </p>
          <p style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;">
            Correo: ${nombreC}
          </p>
          <p style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;">
            Numero Bus : ${numeroBus}
          </p>  
          <p style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;">
            Fecha: ${fecha}
          </p>
          <p style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;">
            Salida: ${origen} - Destino: ${destino}
          </p>
          <p style="font-size: 24px; font-family: Helvetica Neue; font-weight: normal;">
            Boletos: ${numTickets} - Asientos: ${selectedSeats.join(', ')}
          </p>
           
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      console.log('Archivo generado en:', uri);

      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      Alert.alert('Éxito', 'El PDF de ${tipo} ha sido generado y compartido.');
    } catch (error) {
      console.error(`Error al generar o compartir el PDF de ${tipo}: `, error);
      Alert.alert('Error', 'Hubo un error al generar o compartir el PDF de ${tipo}.');
    }
  };

  const handleReservar = async () => {
    try {
      const datas = {
        estado,
        fecha_reserva: fechaReserva,
        monto: total,
        usuario_id: usuarioId,
      };
  
      const reservaResponse = await axios.post('https://transporte-production.up.railway.app/api/reservas', datas);
      console.log('Reserva enviada correctamente:', reservaResponse.data);
  
      const historialData = {
        id_reserva: reservaResponse.data.id_reserva,
        estado,
        categoria: 'Reserva',
        usuario_id: usuarioId,
      }; 
  
      const historialResponse = await axios.post('https://transporte-production.up.railway.app/api/historial-reservas/reserva', historialData);
      console.log('Historial de reserva creado correctamente:', historialResponse.data);
      
      const seatsData = {
        numero: selectedSeats.join(','),
        id_bus: idBus,
        estado: 'ocupado',
        fecha_asiento: fechaIda,
        hora_salida: salida,
        hora_llegada: llegada,
      };
      const response = await axios.post('https://transporte-production.up.railway.app/api/asientos', seatsData);
      console.log('Asientos ocupados correctamente:', response.data);

  
      Alert.alert('Éxito', 'Reserva y historial registrados correctamente.');

      // Generar el PDF después de la reserva
      await printToFile('Confirmación de Reserva'); // Llamar a la función para generar el PDF
  
      navigation.navigate('Historial', {
        nombre,
        origen,
        pasajeros: numTickets,
      });
    } catch (error) {
      console.error('Error al procesar la reserva o el historial:', error);
      Alert.alert('Error', 'Hubo un problema al procesar la reserva o el historial.');
    }
  };
  
  return (
    <StripeProvider publishableKey={STRIPE_PUBLIC_KEY}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userInfo}>
        {userData?.nombre} {userData?.apellido}
        </Text>
        {userData?.usuario_id && (
              <Text style={styles.userInfo}>ID: {userData?.usuario_id}</Text>
              )}
         </View>
      <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pago</Text>
      <Text style={styles.text}>Nombre: {userData?.nombre} {userData?.apellido}</Text>
      <Text style={styles.text}>Nombre Conductor: {nombreC}</Text>
      <Text style={styles.text}>Numero Bus: {idBus}</Text>
      <Text style={styles.text}>Fecha: {fechaIda}</Text>
      <Text style={styles.text}>Origen: {origen}</Text>
      <Text style={styles.text}>Destino: {destino}</Text>
      <Text style={styles.text}>Hora de salida: {salida}</Text>
     <Text style={styles.text}>Hora de llegada: {llegada}</Text>
     <Text style={styles.text}>ID de Asiento(s): {selectedSeats.join(', ')}</Text> {/* Agregado */}
     <Text style={styles.text}>Total de boletos seleccionados: {numTickets}</Text>
     <Text style={styles.text}>Asientos seleccionados: {selectedSeats.join(', ')}</Text>
     
       {/* Mostrar el total dinámicamente */}
       <Text style={styles.text}>Total: ${total.toFixed(2)}</Text>

        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Pagar</Text>
        </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePagoStripe}>
        <Text style={styles.buttonText}>Pagar con Stripe</Text>
      </TouchableOpacity>

        <View style={styles.separator} />

        <Text style={styles.subtitle}>Reservar</Text>
        <Text style={styles.title}>Detalles de la reserva</Text>
        <Text style={styles.text}>Nombre: {userData?.nombre} {userData?.apellido}</Text>
        <Text style={styles.text}>Fecha: {fechaIda}</Text>
        <Text style={styles.text}>Salida: {origen}</Text>
        <Text style={styles.text}>Destino: {destino}</Text>
        <Text style={styles.text}>Hora de salida: {salida}</Text>
        <Text style={styles.text}>Hora de llegada: {llegada}</Text>
        <Text style={styles.text}>Total de boletos seleccionados: {numTickets}</Text>
        <Text style={styles.text}>Asientos seleccionados: {selectedSeats.join(', ')}</Text>
        <Text style={styles.totalText}>Total: ${total}</Text>
            
        <Text style={styles.text}>Estado:</Text>
        <Picker
          selectedValue={estado}
          style={styles.picker}
          onValueChange={(itemValue) => setEstado(itemValue)}
        >
          <Picker.Item label="Pendiente" value="Pendiente" />
          <Picker.Item label="Confirmada" value="Confirmada" />
          <Picker.Item label="Cancelada" value="Cancelada" />
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleReservar}>
          <Text style={styles.buttonText}>Reservar</Text>
        </TouchableOpacity>
      </ScrollView>
      

      {/* Modal para información de tarjeta */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Información de la Tarjeta</Text>

              <CardField
                postalCodeEnabled={false}
                placeholders={{ number: '4242 4242 4242 4242' }}
                onCardChange={(details) => {
                  console.log("Detalles de tarjeta:", details);
                  setCardDetails(details);
                }}
                style={styles.cardField}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirmarPago}>
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => handleNavigation('Horario')}>
            <Icon name="home" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('Historial')}>
            <Icon name="history" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('Perfil')}>
            <Icon name="person" size={30} color="black" />
          </TouchableOpacity>
        </View>
        
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  }, totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginTop: 20,
  },
  mapContainer: {
    height: 300,
    marginTop: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginTop: 20,
  },
  userInfo: {
    fontSize: 18,
    color: '#000000',
    marginTop: 10,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
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
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    flex: 1,
    marginRight: 5,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    width: '100%',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
});

export default PagoScreen;