import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useUser } from '../context/UserContext'; // Asegúrate de importar el hook correctamente
import { ScrollView } from 'react-native'; // Asegúrate de importar ScrollView


const HistorialScreen = ({ route, navigation }) => {
  const { origen, pasajeros, usuario_id } = route.params || {}; // Asegúrate de que usuario_id esté disponible
  const { userData } = useUser(); // Obtén los datos del usuario

  
  const [historialPago, setHistorialPago] = useState([]);
  const [historialReserva, setHistorialReserva] = useState([]);

  useEffect(() => {
    const fetchHistorialData = async () => {
      try {
        const response = await axios.get('http://192.168.0.139:3000/api/historial-reservas');
        const data = response.data;
        console.log('Datos recibidos:', data);  // Verifica los datos de la API
        console.log('usuario_id recibido:', usuario_id);  // Verifica el usuario_id recibido
  
        if (Array.isArray(data)) {
          // Filtrar los datos solo para el usuario actual
          const userHistorial = data.filter(item => item.usuario_id === usuario_id);
          console.log('Historial filtrado:', userHistorial);  // Verifica los datos filtrados
  
          if (origen && pasajeros) {
            userHistorial.push({
              id: (userHistorial.length + 1).toString(),
              nombre: 'N/A',
              salida: origen,
              valor: 'N/A',
              pasajeros: pasajeros.toString(),
              monto: 'N/A',
              fecha_pago: 'N/A',
              estado: 'N/A',
              categoria: 'N/A',
            });
          }
  
          const pagos = userHistorial.filter(item => item.categoria === 'Pago').map(item => ({
            id: item.id_historial?.toString() || 'N/A',
            nombre: `${item.Usuario?.nombre || 'N/A'} ${item.Usuario?.apellido || 'N/A'}`,
            categoria: item.categoria || 'N/A',
            monto: item.Pago?.monto || 'N/A',
            fecha_pago: item.Pago ? new Date(item.Pago.fecha_pago).toLocaleDateString() : 'N/A',
            salida: item.salida || 'Salida no disponible',
            pasajeros: item.pasajeros || 'N/A',
            estado: item.estado || 'N/A',
          }));
  
          const reservas = userHistorial.filter(item => item.categoria === 'Reserva').map(item => ({
            id: item.id_historial?.toString() || 'N/A',
            nombre: `${item.Usuario?.nombre || 'N/A'} ${item.Usuario?.apellido || 'N/A'}`,
            categoria: item.categoria || 'N/A',
            monto: item.Reserva?.monto || 'N/A',
            fecha_reserva: item.Reserva ? new Date(item.Reserva.fecha_reserva).toLocaleDateString() : 'N/A',
            salida: item.salida || 'Salida no disponible',
            pasajeros: item.pasajeros || 'N/A',
            estado: item.estado || 'N/A',
          }));
  
          setHistorialPago(pagos);
          setHistorialReserva(reservas);
        } else {
          console.error('Los datos no son un array válido', data);
        }
      } catch (error) {
        console.error('Error al obtener los datos del historial', error);
      }
    };
  
    fetchHistorialData();
  }, [origen, pasajeros, usuario_id]);
  

  const getStatusStyle = (estado) => {
    switch (estado.toLowerCase()) {
      case 'completo':
      case 'confirmada':
        return styles.statusComplete;
      case 'pendiente':
        return styles.statusPending;
      case 'cancelada':
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const renderHeader = (headers) => (
    <View style={styles.headerRow}>
      {headers.map((header, index) => (
        <Text key={index} style={styles.headerCell}>{header}</Text>
      ))}
    </View>
  );

  const renderRow = (item, headers) => (
    <View style={styles.row}>
      {headers.map((key, index) => (
        key.toLowerCase() === 'estado' ? (
          <Text key={index} style={[styles.cell, getStatusStyle(item[key.toLowerCase()] || 'N/A')]}>{item[key.toLowerCase()] || 'N/A'}</Text>
        ) : (
          <Text key={index} style={styles.cell}>{item[key.toLowerCase()] || 'N/A'}</Text>
        )
      ))}
    </View>
  );

  const renderTable = (data, headers, title) => (
    <View style={styles.tableContainer}>
      <Text style={styles.subtitle}>{title}</Text>
      {renderHeader(headers)}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderRow(item, headers)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Historial de Viajes</Text>

        {renderTable(historialPago, ['Nombre', 'Categoria', 'Monto', 'Fecha_pago', 'Salida', 'Pasajeros', 'Estado'], 'Pagos')}

        {renderTable(historialReserva, ['Nombre', 'Categoria', 'Monto', 'Fecha_reserva', 'Salida', 'Pasajeros', 'Estado'], 'Reservas')}
      </SafeAreaView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Horario')}>
          <Icon name="home" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Historial', { usuario_id: userData?.usuario_id })}>
          <Icon name="history" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
          <Icon name="person" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: '#555',
  },
  tableContainer: {
    marginBottom: 20,
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
  statusComplete: {
    color: 'green',
    fontWeight: 'bold',
  },
  statusPending: {
    color: 'yellow',
    fontWeight: 'bold',
  },
  statusCancelled: {
    color: 'red',
    fontWeight: 'bold',
  },
  statusDefault: {
    color: '#555',
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

export default HistorialScreen;
