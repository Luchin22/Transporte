import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const API_URL = "http://192.168.100.8:3000"; // Asegúrate de actualizar esta URL si es necesario
  const [roles] = useState([
    { id: 4, label: "Usuario" },
    { id: 5, label: "Admin" },
  ]);
  

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      password: "",
      rol_id: 4, // Default role: Usuario
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/usuarios/nuevoUsuarioSinToken`,
        data
      );
  
      if (response.status === 201 || response.status === 200) {
        Alert.alert(
          "Registro Exitoso",
          "El usuario ha sido registrado correctamente.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"), // Navegar a LoginScreen
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Error",
          response.data?.message || "Hubo un problema al registrar el usuario.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "No se pudo registrar el usuario.";
      Alert.alert(
        "Error",
        errorMessage,
        [{ text: "OK" }],
        { cancelable: false }
      );
    }
  };
  

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Formulario de Registro</Text>

          {/* Nombre */}
          <Controller
            control={control}
            name="nombre"
            rules={{ required: "El nombre es obligatorio" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nombre"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                outlineColor={errors.nombre ? "red" : "#78288c"}
              />
            )}
          />
          {errors.nombre && (
            <Text style={styles.errorText}>{errors.nombre.message}</Text>
          )}

          {/* Apellido */}
          <Controller
            control={control}
            name="apellido"
            rules={{ required: "El apellido es obligatorio" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Apellido"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                outlineColor={errors.apellido ? "red" : "#78288c"}
              />
            )}
          />
          {errors.apellido && (
            <Text style={styles.errorText}>{errors.apellido.message}</Text>
          )}

          {/* Email */}
          <Controller
            control={control}
            name="email"
            rules={{
              required: "El email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Correo electrónico inválido",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Correo Electrónico"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                autoCapitalize="none"
                outlineColor={errors.email ? "red" : "#78288c"}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          {/* Teléfono */}
          <Controller
            control={control}
            name="telefono"
            rules={{
              required: "El teléfono es obligatorio",
              pattern: {
                value: /^\d{10}$/,
                message: "Número de teléfono inválido",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Teléfono"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                keyboardType="phone-pad"
                outlineColor={errors.telefono ? "red" : "#78288c"}
              />
            )}
          />
          {errors.telefono && (
            <Text style={styles.errorText}>{errors.telefono.message}</Text>
          )}

          {/* Contraseña */}
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
                secureTextEntry
                style={styles.input}
                outlineColor={errors.password ? "red" : "#78288c"}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          {/* Rol */}
          <Controller
            control={control}
            name="rol_id"
            rules={{ required: "El rol es obligatorio" }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                >
                  {roles.map((rol) => (
                    <Picker.Item key={rol.id} label={rol.label} value={rol.id} />
                  ))}
                </Picker>
              </View>
            )}
          />
          {errors.rol_id && (
            <Text style={styles.errorText}>{errors.rol_id.message}</Text>
          )}

          {/* Botón de Registro */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={styles.button}
            loading={isSubmitting}
          >
            Registrarse
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    marginTop: 30,
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    marginLeft: 10,
  },
  button: {
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#78288c",
    borderRadius: 4,
    marginBottom: 10,
  },
  picker: {
    height: 40,
    width: "100%",
  },
});

export default RegisterScreen;
