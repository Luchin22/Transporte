import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const IconMenu = ({ navigation }) => {
  const handlePantalla = () => {
    navigation.navigate('Pantalla');
  }
    const handleCrear = () => {
        navigation.navigate('Crear');
    }
    const handleDato = () => {
        navigation.navigate('Dato');
    }
  return (
    <View style={styles.container}>
      {/* Fila 1 */}
      <View style={styles.rowContainer}>
        {/* Gestión de Flota */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('FleetManagement')}
        >
          <Icon name="bus-cog" size={40} color="#4CAF50" />
          <Text style={styles.label}>Gestión de Flota</Text>
        </TouchableOpacity>

        {/* Creación de Buses y Conductores */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handlePantalla}
        >
          <Icon name="plus-circle-outline" size={40} color="#2196F3" />
          <Text style={styles.label}>Crear Buses y Conductores</Text>
        </TouchableOpacity>
      </View>

      {/* Fila 2 */}
      <View style={styles.rowContainer}>
        {/* Horario Designado */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('DesignatedSchedule')}
        >
          <Icon name="calendar-clock" size={40} color="#FF9800" />
          <Text style={styles.label}>Horario Designado</Text>
        </TouchableOpacity>

        {/* Análisis de Datos */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handleDato}
        >
          <Icon name="chart-bar" size={40} color="#9C27B0" />
          <Text style={styles.label}>Análisis de Datos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    width: '40%',
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default IconMenu;
