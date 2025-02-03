import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../context/UserContext'; // Importa el hook del contexto




const API_URL = 'http://192.168.0.139:3000'; // URL de tu API

const HorarioScreen = ({ navigation }) => {
  const [rutas, setRutas] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [filteredData, setFilteredData] = useState([]);
    const { userData, loading } = useUser();
  
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
    const fetchRutas = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/rutas/rutas-con-capacidad`);
        setRutas(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error al obtener las rutas:', error);
      }
    };

    fetchRutas();
  }, []);

  const filterData = (origin, destination) => {
    const filtered = rutas.filter(
      (item) =>
        (origin === '' || item.origen === origin) &&
        (destination === '' || item.destino === destination)
    );
    setFilteredData(filtered);
  };

  const handleOriginChange = (value) => {
    setSelectedOrigin(value);
    setSelectedDestination('');
    filterData(value, '');
  };

  const handleDestinationChange = (value) => {
    setSelectedDestination(value);
    filterData(selectedOrigin, value);
  };

  const handleRuta = () => {
    navigation.navigate('Ruta', {
      selectedOrigin,
      selectedDestination,
    });
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Selecciona un Transporte</Text>

      <Text style={styles.filterLabel}>Ciudad de Salida</Text>
      <RNPickerSelect
        onValueChange={handleOriginChange}
        items={['Cuenca', 'Guayaquil', 'Riobamba', 'Quito', 'Ambato', 'Loja'].map((city) => ({
          label: city,
          value: city,
        }))}
        placeholder={{ label: 'Seleccione una ciudad', value: '' }}
        style={pickerSelectStyles}
        value={selectedOrigin}
      />

      <Text style={styles.filterLabel}>Ciudad de Destino</Text>
      <RNPickerSelect
        onValueChange={handleDestinationChange}
        items={['Cuenca', 'Guayaquil', 'Riobamba', 'Quito', 'Ambato', 'Loja']
          .filter((city) => city !== selectedOrigin)
          .map((city) => ({
            label: city,
            value: city,
          }))}
        placeholder={{ label: 'Seleccione una ciudad', value: '' }}
        style={pickerSelectStyles}
        value={selectedDestination}
        disabled={!selectedOrigin}
      />

      {/* Encabezado de la tabla */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Origen</Text>
        <Text style={styles.tableHeaderText}>Destino</Text>
        <Text style={styles.tableHeaderText}>Distancia</Text>
        <Text style={styles.tableHeaderText}>Capacidad</Text>
      </View>

      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => `${item.origen}-${item.destino}`}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.tableText}>{item.origen}</Text>
              <Text style={styles.tableText}>{item.destino}</Text>
              <Text style={styles.tableText}>{item.distancia} km</Text>
              <Text style={styles.tableText}>
                {item.Bus ? item.Bus.capacidad : 'N/A'}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noResultsText}>No se encontraron los resultados solicitados</Text>
      )}

      <TouchableOpacity
        style={[styles.confirmButton, !selectedDestination && styles.disabledButton]}
        onPress={handleRuta}
        disabled={!selectedDestination}
      >
        <Text style={styles.confirmButtonText}>Confirmar</Text>
      </TouchableOpacity>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    marginTop: 50,
  },
  header: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterLabel: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
    
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    justifyContent: 'space-around',
  },
  tableHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-around',
  },
  tableText: {
    color: '#000',
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  noResultsText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cfcfcf',
  },
  confirmButtonText: {
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
    width: '100%',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#212121',
    marginBottom: 20,
  },
  inputAndroid: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#212121',
    marginBottom: 20,
  },
});

export default HorarioScreen;
