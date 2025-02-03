import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const IconMenu = ({ navigation }) => {
  
  const handleInter = () => {
    navigation.navigate('Inter');
  }
   
  return (
    <View style={styles.container}>
      {/* Fila 1 */}
      <View style={styles.rowContainer}>
        {/* Gestión de Flota */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handleInter}
        >
          <Icon name="bus-cog" size={40} color="#4CAF50" />
          <Text style={styles.label}>Consulta de Rutas y Horarios</Text>
        </TouchableOpacity>

       
      </View>

    
      <View style={styles.rowContainer}>
        

      
        
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
