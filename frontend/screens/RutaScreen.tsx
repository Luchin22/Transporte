import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import CheckBox from 'react-native-check-box';
import axios from 'axios';

const RouteListScreen = ({ navigation, route }) => {
  const { selectedOrigin, selectedDestination } = route.params;

  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://192.168.100.8:3000/api/horarios', {
          params: {
            origen: selectedOrigin,
            destino: selectedDestination,
          },
        });

        // Verificar si los datos tienen id, y generar uno si falta
        const processedData = response.data.map((item, index) => ({
          ...item,
          id: item.id || `temp-${index}`, // Genera un id temporal si falta
        }));

        setHorarios(processedData);
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHorarios();
  }, [selectedOrigin, selectedDestination]);

  const handleConfirm = () => {
    if (selectedRow !== null) {
      setConfirmed(true); // Habilitar el botón de compra
    }
  };

  const handleTicket = () => {
    const selectedHorario = horarios.find((horario) => horario.id === selectedRow);
    if (selectedHorario) {
      navigation.navigate('Ticket', { selectedRoute: selectedHorario });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Consulta de Disponibilidad de Rutas</Text>

      <View style={styles.routeDetailsContainer}>
        <Text style={styles.routeDetailsTitle}>Rutas</Text>
        <TextInput
          style={styles.routeDetailsText}
          value={`${selectedOrigin} - ${selectedDestination}`}
          editable={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.buttonConfirm, !selectedRow && styles.disabledButton]}
        onPress={handleConfirm}
        disabled={!selectedRow}
      >
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>

      <ScrollView style={styles.tableContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Cargando horarios...</Text>
        ) : (
          <View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Salida</Text>
              <Text style={styles.tableHeader}>Duración</Text>
              <Text style={styles.tableHeader}>Llegada</Text>
              <Text style={styles.tableHeader}>Asientos</Text>
              <Text style={styles.tableHeader}>Seleccionar</Text>
            </View>

            {horarios.map((row) => (
              <View key={row.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{row.hora_salida}</Text>
                <Text style={styles.tableCell}>{row.duracion}</Text>
                <Text style={styles.tableCell}>{row.hora_llegada}</Text>
                <Text style={styles.tableCell}>{row.asientos_disponibles}</Text>
                <CheckBox
                  isChecked={selectedRow === row.id}
                  onClick={() => setSelectedRow(selectedRow === row.id ? null : row.id)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {confirmed && (
        <TouchableOpacity style={styles.buttonBuy} onPress={handleTicket}>
          <Text style={styles.buttonText}>Comprar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004C4C',
    padding: 10,
  },
  header: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  routeDetailsContainer: {
    marginBottom: 20,
  },
  routeDetailsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  routeDetailsText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 5,
  },
  tableContainer: {
    marginBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    marginVertical: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    alignItems: 'center',
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
  },
  buttonConfirm: {
    backgroundColor: '#32CD32',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
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
    backgroundColor: '#32CD32',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
});

export default RouteListScreen;
