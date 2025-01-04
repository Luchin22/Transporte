import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const API_URL = 'http://192.168.100.8:3000/api/usuarios/sign-in';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa el correo y la contraseña.');
      return;
    }
  
    try {
      const response = await axios.post(API_URL, { email, password });
  
      if (response.status === 200) {
        const userData = response.data.usuario; // Asegúrate de que esta sea la estructura correcta del backend
  
        if (userData) {
          const { usuario_id, rol_id } = userData;
  
          // Navegar a la pantalla correspondiente según el rol o ir a EditarPerfilScreen
          if (rol_id === 5) {
            navigation.navigate('Home');
          } else if (rol_id === 4) {
            navigation.navigate('Horario');
          } else {
            // Navegar a EditarPerfilScreen con el userId
            navigation.navigate('EditarPerfil', { userId: usuario_id });
          }
        } else {
          Alert.alert('Error', 'Usuario no encontrado.');
        }
      } else {
        Alert.alert('Error', 'Credenciales incorrectas.');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };
  
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} // Reemplaza con la URL de tu logo
        style={styles.logo}
      />
      <Text style={styles.title}>Cooperativa Chimborazo</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerText}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Olvidé mi contraseña')}>
          <Text style={styles.footerText}>Olvidé mi contraseña</Text>
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
    padding: 20,
    backgroundColor: '#F9FAFC',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#BDC3C7',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    color: '#2C3E50',
  },
  loginButton: {
    backgroundColor: '#3498DB',
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  footerText: {
    color: '#3498DB',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoginScreen;
