import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HistorialScreen = ({navigation}) => {
  const handlePerfil = () => {
    navigation.navigate('Perfil',{
  
    });  
  }
  
  const handleHorario = () => {
    navigation.navigate('Horario');
  }
  const handleHistorial = () => {
    navigation.navigate('Historial');
  }
  // Datos de ejemplo para la tabla
  const historialData = [
    { id: '1', nombre: 'Luis Insuasti', salida: 'Riobamba', duracion: '2h 30m', valor: '$15', pasajeros: '1' },
    { id: '2', nombre: 'Maria López', salida: 'Quito', duracion: '4h', valor: '$20', pasajeros: '3' },
    { id: '3', nombre: 'Carlos Pérez', salida: 'Cuenca', duracion: '6h', valor: '$25', pasajeros: '2' },
    { id: '4', nombre: 'Ana Torres', salida: 'Guayaquil', duracion: '3h', valor: '$18', pasajeros: '1' },
  ];

  // Encabezado de la tabla
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerCell}>Nombre</Text>
      <Text style={styles.headerCell}>Salida</Text>
      <Text style={styles.headerCell}>Duración</Text>
      <Text style={styles.headerCell}>Valor</Text>
      <Text style={styles.headerCell}>Pasajeros</Text>
    </View>
  );

  // Filas de la tabla
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.nombre}</Text>
      <Text style={styles.cell}>{item.salida}</Text>
      <Text style={styles.cell}>{item.duracion}</Text>
      <Text style={styles.cell}>{item.valor}</Text>
      <Text style={styles.cell}>{item.pasajeros}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Historial de Viajes</Text>

      {/* Tabla */}
      <View style={styles.tableContainer}>
        {renderHeader()}
        <FlatList
          data={historialData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
        
        
      </View>
        <View style={styles.footer}>
              <TouchableOpacity onPress={handleHorario}>
                <Icon name="home" size={30} color="black" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleHistorial}>
                <Icon name="history" size={30} color="black" />
              </TouchableOpacity>
             <TouchableOpacity
                onPress={handlePerfil}
              >
                <Icon name="person" size={30} color="black" />
              </TouchableOpacity>
              
            </View>
      

    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default HistorialScreen;
