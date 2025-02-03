import React, { useEffect, useState, } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {  TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Usa otro tipo de íconos si lo prefieres
import { Picker } from '@react-native-picker/picker';


const FlotaScreen = ({navigation}) => {

  
  
  const handleCrear = () => {
    navigation.navigate('Crear');
}
const handleBuse = () => {
    navigation.navigate('Buse');
}
const handleHora = () => {
    navigation.navigate('Hora');
}
const handleGuia = () => {
    navigation.navigate('Guia');
}


  return (
    <View style={styles.container}>
    
      <View style={styles.row}>
              <TouchableOpacity style={styles.iconContainer} onPress={handleCrear}>
                <Icon name="person" size={50} color="#4CAF50" />
                <Text style={styles.iconText}>Conductor</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconContainer} onPress={handleBuse}>
                <Icon name="directions-bus" size={50} color="#2196F3" />
                <Text style={styles.iconText}>Bus</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TouchableOpacity style={styles.iconContainer} onPress={handleHora}>
                <Icon name="access-time" size={50} color="#FF9800" />
                <Text style={styles.iconText}>Horario</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconContainer} onPress={handleGuia}>
                <Icon name="route" size={50} color="#9C27B0" />
                <Text style={styles.iconText}>Ruta</Text>
              </TouchableOpacity>
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 15,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: 120,
    height: 120,
  },
  iconText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default FlotaScreen;
