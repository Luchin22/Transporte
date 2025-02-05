import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Animated, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import { useUser } from '../context/UserContext'; // Importa el contexto


const LoginScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const scale = useRef(new Animated.Value(1)).current; // Mejor uso para evitar renders innecesarios
  const API_URL = 'https://transporte-production.up.railway.app/api/usuarios/sign-in';
  const { fetchUserData } = useUser(); // Obtiene la función para cargar datos del usuario


  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleOlvidar = () => navigation.navigate('Olvidar');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(API_URL, data);

      if (response.status === 200) {
        const { usuario_id, rol_id } = response.data.usuario || {};

        if (usuario_id) {
          console.log('Usuario autenticado, ID:', usuario_id);
          fetchUserData(usuario_id); // Cargar datos del usuario
        
          if (rol_id === 5) {
            navigation.navigate('Home');
          } else if (rol_id === 4) {
            navigation.navigate('Perfil', { userId: usuario_id });
          } else {
            Alert.alert('Acceso Denegado', 'Rol no autorizado.');
          }
        }
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../assets/images/image.png')} style={styles.logo} />
        <Text style={styles.title}> Cooperativa Chimborazo </Text>
  
        <Controller
          control={control}
          name="email"
          rules={{
            required: "El correo es obligatorio",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Ingresa un correo válido",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Correo electrónico"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              style={styles.input}
              outlineColor="#000000"
            />
          )}
        />
{!!errors.email && (
  <Text style={styles.errorText}>
    {errors.email.message?.toString() || ''}
  </Text>
)}

       
        <Controller
          control={control}
          name="password"
          rules={{
            required: "La contraseña es obligatoria",
            minLength: {
              value: 8,
              message: "La contraseña debe tener al menos 8 caracteres",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Contraseña"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={!showPassword}
              style={styles.input}
              outlineColor="#000000"
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={togglePasswordVisibility}
                />
              }
            />
          )}
        />
{!!errors.password && (
  <Text style={styles.errorText}>
    {errors.password.message?.toString() || ''}
  </Text>
)}
       
        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.loginText}>Iniciar Sesión</Text>
        </TouchableOpacity>

      
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerText}>Registrar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOlvidar}>
            <Text style={styles.footerText}>Olvidé mi contraseña</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF' },
  logo: { width: 210, height: 150, elevation: 5, backgroundColor: '#FFFFFF', borderRadius: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 30, textAlign: 'center', marginTop: 50 },
  input: { width: '100%', marginBottom: 15, backgroundColor: '#FFFFFF', elevation: 5, borderRadius: 5 },
  loginButton: { backgroundColor: '#000000', width: '100%', paddingVertical: 12, alignItems: 'center', borderRadius: 5, marginTop: 10, elevation: 5 },
  loginText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
  footerText: { color: '#000000', fontSize: 16, fontWeight: '500', textDecorationLine: 'underline' },
  errorText: { color: '#FF0000', fontSize: 14, marginBottom: 10 },
});

export default LoginScreen;
