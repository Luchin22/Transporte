import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';
import { useUser } from '../context/UserContext'; // Importa el contexto del usuario

const EditarScreen = ({ navigation }) => {
  const { userData, fetchUserData } = useUser(); // Obtiene los datos del usuario desde el contexto
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    if (userData) {
      // Establece los valores iniciales del formulario con los datos del usuario
      setNombre(userData.nombre);
      setApellido(userData.apellido);
      setTelefono(userData.telefono);
    }
  }, [userData]);

  const handleSubmit = async () => {
    if (!nombre || !apellido || !telefono) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const response = await axios.put(
        `http://192.168.0.139:3000/api/usuarios/usuarioSinToken/${userData?.usuario_id}`,
        {
          nombre,
          apellido,
          telefono,
        }
      );

      Alert.alert('Éxito', 'Usuario actualizado correctamente');
      // Actualiza los datos en el contexto para reflejar los cambios
      fetchUserData(userData.usuario_id);
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
      Alert.alert('Error', 'No se pudo actualizar el usuario');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Información</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={(text) => setNombre(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={(text) => setApellido(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="numeric"
        value={telefono}
        onChangeText={(text) => setTelefono(text)}
      />

      <Button title="Guardar cambios" onPress={handleSubmit} />

      <Button
        title="Cancelar"
        onPress={() => navigation.goBack()}
        color="#FF6347" // Color para el botón de cancelación
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 30,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    borderRadius: 5,
  },
});

export default EditarScreen;
