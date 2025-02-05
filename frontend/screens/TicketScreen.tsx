import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../context/UserContext'; // Importa el hook del contexto
import axios from 'axios';

const BusSeats = ({ navigation, route }) => {
  const { userData, loading } = useUser();

  const [selectedSeats, setSelectedSeats] = useState([]); // Asientos seleccionados
  const [numSeats, setNumSeats] = useState(1); // Número de asientos seleccionados
  const [occupiedSeats, setOccupiedSeats] = useState([]); // Asientos ocupados desde la API

 

  const {
    selectedOrigin,
    selectedDestination,
    horaSalida,
    horaLlegada,
    fechaIda,
    idBus,
    numeroBus,
    capacidad,
    nombreConductor,
  } = route.params;
  const menuOptions = [
    { id: 1, name: 'Editar', screen: 'Editar', icon: 'edit' },
    { id: 2, name: 'Historial', screen: 'Historial', icon: 'history' },
    { id: 3, name: 'Payment', screen: 'Payment', icon: 'payment' },
    { id: 4, name: 'Salir', screen: 'Login', icon: 'logout' },
  ]; 
  const handleNavigation = (screen) => {
    navigation.navigate(screen, { usuario_id: userData?.usuario_id });
  };



  useEffect(() => {
    const fetchOccupiedSeats = async () => {
      try {
        // Realizar la solicitud al endpoint de asientos ocupados
        const response = await axios.get('https://transporte-production.up.railway.app/api/asientos');
        
        // Filtrar asientos ocupados por bus, estado y fecha
        const occupied = response.data
          .filter(
            (asiento) =>
              asiento.id_bus === idBus && // Coincidencia por ID de bus
              asiento.estado === 'ocupado' && // Estado ocupado
              asiento.fecha_asiento === fechaIda // Coincidencia por fecha
          )
          .flatMap((asiento) => asiento.numero.split(',').map(num => parseInt(num, 10))); // Dividir y convertir los números a enteros
        
        setOccupiedSeats(occupied); // Actualizar el estado con los asientos ocupados
      } catch (error) {
        console.error('Error fetching occupied seats:', error);
        Alert.alert('Error', 'No se pudieron cargar los asientos ocupados.');
      }
    };
  
    fetchOccupiedSeats();
  }, [idBus, fechaIda]);
  
  

  const toggleSeat = (seatNumber) => {
    if (occupiedSeats.includes(seatNumber)) {
      Alert.alert('Aviso', 'Este asiento está ocupado.');
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats((prevSelectedSeats) =>
        prevSelectedSeats.filter((seat) => seat !== seatNumber)
      );
    } else if (selectedSeats.length < numSeats) {
      setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seatNumber]);
    } else {
      Alert.alert('Aviso', `Solo puedes seleccionar ${numSeats} asientos.`);
    }
  };

  const handleNumSeatsChange = (newNumSeats) => {
    setNumSeats(newNumSeats);

    // Si hay asientos seleccionados, ajustarlos según el nuevo límite
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.slice(0, newNumSeats)
    );

    console.log(`Cantidad de asientos a seleccionar: ${newNumSeats}`);
  };
  const renderSeats = () => {
    const rows = [];
    const seatsPerRow = 4; // Asientos por fila
    const totalRows = Math.ceil(capacidad / seatsPerRow);
  
    for (let i = 0; i < totalRows; i++) {
      const rowSeats = [];
      for (let j = 0; j < seatsPerRow; j++) {
        const seatNumber = i * seatsPerRow + j + 1; // Calcular número dinámicamente
        if (seatNumber > capacidad) break; // No generar asientos fuera de rango
        
        const isOccupied = occupiedSeats.includes(seatNumber); // Verificar si el asiento está ocupado
  
        rowSeats.push(
          <TouchableOpacity
            key={seatNumber}
            style={[
              styles.seat,
              isOccupied && styles.occupiedSeat, // Aplicar estilo si está ocupado
              selectedSeats.includes(seatNumber) && styles.selectedSeat,
            ]}
            onPress={() => !isOccupied && toggleSeat(seatNumber)} // Solo seleccionar si no está ocupado
            disabled={isOccupied} // Deshabilitar si está ocupado
          >
            <Text style={styles.seatText}>{seatNumber}</Text>
          </TouchableOpacity>
        );
      }
  
      rows.push(
        <View key={i} style={styles.row}>
          {rowSeats.slice(0, 2)} {/* Lado izquierdo */}
          <View style={styles.pasillo} /> {/* Pasillo */}
          {rowSeats.slice(2)} {/* Lado derecho */}
        </View>
      );
    }
  
    return rows;
  };
  
  const handlePago = () => {
    if (selectedSeats.length !== numSeats) {
      Alert.alert('Error', `Debes seleccionar exactamente ${numSeats} asientos.`);
      return;
    }

    navigation.navigate('Pago', {
      numTickets: numSeats,
      selectedSeats,
      origen: selectedOrigin,
      destino: selectedDestination,
      salida: horaSalida,
      llegada: horaLlegada,
      nombreC: nombreConductor,
      numeroBus: numeroBus,
      fechaIda: fechaIda,
      idBus: idBus,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Selecciona la cantidad de asientos</Text>
        <Text>{`Origen: ${selectedOrigin}, Destino: ${selectedDestination}`}</Text>
        <Text>{`ID Bus: ${idBus}`}</Text>
        <Text>{`Numero Bus: ${numeroBus}`}</Text>
        <Text>{`Capacidad: ${capacidad}`}</Text>
        <Text>{`Hora de salida: ${horaSalida}`}</Text>
        <Text>{`Hora de llegada: ${horaLlegada}`}</Text>
        <Text>{`Fecha de ida: ${fechaIda}`}</Text>
        <Text>{`Nombre del conductor: ${nombreConductor}`}</Text>

        <Picker
          selectedValue={numSeats}
          style={styles.picker}
          onValueChange={(itemValue) => handleNumSeatsChange(itemValue)} // Usa la nueva función
        >
          {[...Array(10).keys()].map((_, index) => (
            <Picker.Item key={index} label={`${index + 1}`} value={index + 1} />
          ))}
        </Picker>

        <Text style={styles.title}>Selecciona tus asientos</Text>
        {renderSeats()}

        <TouchableOpacity style={styles.button} onPress={handlePago}>
          <Text style={styles.buttonText}>Comprar</Text>
        </TouchableOpacity>
      </ScrollView>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollContainer: {
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingVertical: 20,
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    marginTop: 50,  
  },
  picker: {
    width: 150,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  seat: {
    width: 60,
    height: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 10,
  },
  seatText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedSeat: {
    backgroundColor: '#5cb85c',
  },
  pasillo: {
    width: 20,
    height: 60, // Igual a la altura de los asientos
    backgroundColor: '#fff',
  },
  

  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  occupiedSeat: {
    backgroundColor: '#ff4d4d', // Rojo para asientos ocupados
    opacity: 0.6, // Transparente para enfatizar el estado
  },
});

export default BusSeats;
