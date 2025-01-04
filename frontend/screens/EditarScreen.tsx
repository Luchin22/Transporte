import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';

const EditarScreen = ({ navigation }) => {
  // Estado para los campos de formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    if (!nombre || !apellido || !cedula || !telefono) {
      Alert.alert('Error', 'Por favor completa todos los campos');
    } else {
      // Aquí podrías hacer una llamada API para actualizar la información
      console.log('Datos actualizados:', { nombre, apellido, cedula, telefono });

      // Navegar de vuelta a la pantalla de perfil
      navigation.navigate('Perfil');
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
        placeholder="Cédula"
        keyboardType="numeric"
        value={cedula}
        onChangeText={(text) => setCedula(text)}
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
