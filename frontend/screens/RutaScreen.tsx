import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import CheckBox from 'react-native-check-box';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../context/UserContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';

const RouteListScreen = ({ navigation, route }) => {
  const { selectedOrigin, selectedDestination } = route.params;
  const { userData } = useUser();

  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [rutas, setRutas] = useState([]);
  const [horaActual, setHoraActual] = useState('');
  const [fechaIda, setFechaIda] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const menuOptions = [
    { id: 1, name: 'Editar', screen: 'Editar', icon: 'edit' },
    { id: 2, name: 'Historial', screen: 'Historial', icon: 'history' },
    { id: 3, name: 'Payment', screen: 'Payment', icon: 'payment' },
    { id: 4, name: 'Salir', screen: 'Login', icon: 'logout' },
  ];

  const cleanName = (name) => {
    return name.replace(/[\u{0080}-\u{FFFF}]/gu, ""); // Reemplaza caracteres no ASCII extendidos
  };
  const handleNavigation = (screen) => {
    navigation.navigate(screen, { usuario_id: userData?.usuario_id });
  };

  const formatFechaIda = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const response = await axios.get('https://transporte-production.up.railway.app/api/rutas/rutas-con-capacidad');
        setRutas(response.data);
      } catch (error) {
        console.error('Error al obtener las rutas:', error);
      }
    };
    fetchRutas();
  }, []);

  useEffect(() => {
    const fetchHorarios = async () => {
      setLoading(true);
      if (!selectedOrigin || !selectedDestination) return;
      const ruta = rutas.find(
        r => r.origen.trim().toLowerCase() === selectedOrigin.trim().toLowerCase() &&
             r.destino.trim().toLowerCase() === selectedDestination.trim().toLowerCase()
      );
      if (!ruta) {
        console.log('No se encontró una ruta válida para el origen y destino seleccionados.');
        return;
      }
      const response = await axios.get('https://transporte-production.up.railway.app/api/horarios/horarios-con-capacidad');
      const horariosConCapacidad = response.data;
      const filteredHorarios = horariosConCapacidad.filter(
        horario => horario.Rutum?.id_ruta === ruta.id_ruta
      );
      setHorarios(filteredHorarios.map((item, index) => ({
        ...item,
        id: item.id_horario || `temp-${index}`,
        Conductor: item.Bus?.Conductor,
        Bus: { ...item.Bus, Conductor: undefined },
      })));
      setLoading(false);
    };

    if (selectedOrigin && selectedDestination && rutas.length > 0) {
      fetchHorarios();
    }
  }, [selectedOrigin, selectedDestination, rutas, fechaIda]);

  useEffect(() => {
    const actualizarHora = () => {
      const now = new Date();
      const hora24 = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setHoraActual(hora24);
    };

    const interval = setInterval(actualizarHora, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirm = () => {
    if (selectedRow !== null) {
      setConfirmed(true);
    }
  };

  const handleTicket = () => {
    const selectedHorario = horarios.find((horario) => horario.id === selectedRow);
    if (selectedHorario) {
      navigation.navigate('Ticket', {
        idBus: selectedHorario.Bus.id_bus,
        capacidad: selectedHorario.Bus.capacidad,
        numeroBus: selectedHorario.Bus.numero,
        nombreConductor: selectedHorario.Conductor?.nombre_conductor,
        selectedOrigin,
        selectedDestination,
        selectedRoute: selectedHorario,
        horaSalida: selectedHorario.hora_salida,
        horaLlegada: selectedHorario.hora_llegada,
        fechaIda: formatFechaIda(fechaIda),
      });
    }
  };

  const handleRowSelection = (row) => {
    const now = new Date();
    const isCurrentDate = fechaIda.toLocaleDateString('es-ES') === now.toLocaleDateString('es-ES');
    const horaActualDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(horaActual.split(':')[0], 10),
      parseInt(horaActual.split(':')[1], 10)
    );
    const [hora, minutos, segundos] = row.hora_salida.split(':').map(Number);
    const horaSalidaDate = new Date(
      fechaIda.getFullYear(),
      fechaIda.getMonth(),
      fechaIda.getDate(),
      hora,
      minutos,
      segundos || 0
    );

    if (isCurrentDate && horaSalidaDate < horaActualDate) {
      Alert.alert("Fuera de tiempo", "La hora de salida ya ha pasado.");
    } else {
      setSelectedRow(selectedRow === row.id ? null : row.id);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleDateChange = (date) => {
    setFechaIda(date);
    setDatePickerVisibility(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Consulta de Disponibilidad de Horarios</Text>
      <Text style={styles.horarioTitle}>Horario</Text>
      <Text style={styles.horaActual}>{horaActual}</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={showDatePicker}
      >
        <Text style={styles.dateButtonText}>
          {fechaIda.toLocaleDateString('es-ES')}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateChange}
        onCancel={() => setDatePickerVisibility(false)}
        date={fechaIda}
        minimumDate={new Date()} // Asegúrate de que no se pueda elegir una fecha anterior a la actual
      />
     <ScrollView style={styles.tableContainer}>
    {loading ? (
        <Text style={styles.loadingText}>Cargando horarios...</Text>
    ) : (
        <View>
            <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Salida</Text>
                <Text style={styles.tableHeader}>Llegada</Text>
                <Text style={styles.tableHeader}>Estado</Text>
                <Text style={styles.tableHeader}>No Bus</Text> {/* Nueva columna para el número del bus */}
                <Text style={styles.tableHeader}>Conductor</Text>
               
            </View>

            {horarios.length === 0 ? (
                <Text style={styles.noResultsText}>No se encontraron horarios disponibles.</Text>
            ) : (
                horarios.map((row) => (
                    <View key={row.id} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{row.hora_salida}</Text>
                        <Text style={styles.tableCell}>{row.hora_llegada}</Text>
                        <Text style={styles.tableCell}>{row.estado}</Text>
                        <Text style={styles.tableCell}>{row.Bus?.numero || 'N/A'}</Text> {/* Mostrar el número del bus */}
                        <Text style={styles.tableCell}>{row.Conductor?.nombre_conductor || 'N/A'}</Text>
                        <CheckBox
                            isChecked={selectedRow === row.id}
                            onClick={() => handleRowSelection(row)}
                        />
                    </View>
                ))
            )}
        </View>
    )}
</ScrollView>

      <TouchableOpacity
        style={[styles.buttonConfirm, !selectedRow && styles.disabledButton]}
        onPress={handleConfirm}
        disabled={!selectedRow}
      >
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
      {confirmed && (
        <TouchableOpacity style={styles.buttonBuy} onPress={handleTicket}>
          <Text style={styles.buttonText}>Comprar</Text>
        </TouchableOpacity>
      )}
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
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  header: {
    fontSize: 26,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  horarioTitle: {
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
    marginVertical: 10,
  },
  horaActual: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  datePickerContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  datePickerLabel: {
    color: '#000000',
    fontSize: 18,
    marginBottom: 5,
  },
  dateButton: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  tableContainer: {
    marginBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 18,
    marginVertical: 20,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 18,
    marginVertical: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000000',
    paddingVertical: 10,
    alignItems: 'center',
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#000000',
  },
  buttonConfirm: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  buttonBuy: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    width: '100%',
  }
});

export default RouteListScreen;
