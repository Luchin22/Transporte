
import React, { useState, useEffect, useRef } from 'react';

import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, FlatList, Image, Alert  } from 'react-native';
import { useUser } from '../context/UserContext'; // Importa el hook del contexto
import Icon from 'react-native-vector-icons/MaterialIcons';


const PerfilScreen = ({navigation}) => {
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
    console.log('Datos del usuario en Perfil:', userData);
  }, [userData]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text>Cargando datos del usuario...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text>No se pudieron cargar los datos del usuario.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${userData.nombre} ${userData.apellido}`}</Text>
      <Text style={styles.subtitle}>Teléfono: {userData.telefono}</Text>
      <Text style={styles.subtitle}>Correo: {userData.email}</Text>
      {/* Lista de opciones */}
    <FlatList
    data={menuOptions}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => handleNavigation(item.screen)}
      >
        <Icon name={item.icon} size={24} color="#333" />
        <Text style={styles.menuText}>{item.name}</Text>
      </TouchableOpacity>
    )}
  />

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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, alignItems: 'center', backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10, marginTop: 50,  },
  subtitle: { fontSize: 18, color: '#555', marginVertical: 5 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    width: '90%',
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 2,
  },
  menuText: { fontSize: 18, marginLeft: 15, color: '#333' },
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

export default PerfilScreen;
