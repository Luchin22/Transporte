import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PerfilScreen = ({ navigation }) => {
  const menuOptions = [
    { id: 1, name: 'Editar', screen: 'Editar', icon: 'edit' },
    { id: 2, name: 'Historial', screen: 'Historial', icon: 'history' },
    { id: 3, name: 'Payment', screen: 'Payment', icon: 'payment' },
    { id: 4, name: 'Salir', screen: 'Login', icon: 'logout' },
  ];

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Image
        style={styles.avatar}
        source={{ uri: 'https://example.com/avatar.jpg' }} // Cambia por una URL o imagen local
      />

      {/* Nombre y ciudad */}
      <Text style={styles.name}>Luis Israel Insuasti</Text>
      <Text style={styles.city}>Riobamba, Ecuador</Text>

      {/* Lista de opciones */}
      <FlatList
        data={menuOptions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation(item.screen)} // Navega a la pantalla especificada
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
  container: { flex: 1, alignItems: 'center', backgroundColor: '#f9f9f9' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginTop: 50 },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  city: { fontSize: 16, color: '#777', marginBottom: 20 },
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
