import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const API_URL = "https://transporte-production.up.railway.app";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      password: "",
      rol_id: 4, // Rol por defecto: Usuario
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
          [{ text: "OK", onPress: () => navigation.navigate("Login") }],
          { cancelable: false }
        );
      } else {
        Alert.alert("Error", response.data?.message || "Error en el registro.");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "No se pudo registrar el usuario.");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Formulario de Registro</Text>

          {/* Campo: Nombre */}
          <Controller
            control={control}
            name="nombre"
            rules={{
              required: "El nombre es obligatorio",
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/,
                message: "Solo se permiten letras",
              },
            }}
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
          {errors.nombre && <Text style={styles.errorText}>{errors.nombre.message}</Text>}

          {/* Campo: Apellido */}
          <Controller
            control={control}
            name="apellido"
            rules={{
              required: "El apellido es obligatorio",
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/,
                message: "Solo se permiten letras",
              },
            }}
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
          {errors.apellido && <Text style={styles.errorText}>{errors.apellido.message}</Text>}

          {/* Campo: Email */}
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
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          {/* Campo: Teléfono (Evita negativos y caracteres no numéricos) */}
          <Controller
            control={control}
            name="telefono"
            rules={{
              required: "El teléfono es obligatorio",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Debe contener 10 dígitos y solo números",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Teléfono"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={(text) => {
                  const filteredText = text.replace(/[^0-9]/g, ""); // Solo permite números
                  onChange(filteredText);
                }}
                value={value}
                style={styles.input}
                keyboardType="number-pad"
                outlineColor={errors.telefono ? "red" : "#78288c"}
              />
            )}
          />
          {errors.telefono && <Text style={styles.errorText}>{errors.telefono.message}</Text>}

          {/* Campo: Contraseña con validaciones */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: "La contraseña es obligatoria",
              minLength: {
                value: 8,
                message: "Debe tener al menos 8 caracteres",
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                message: "Debe incluir una mayúscula, un número y un carácter especial (@$!%*?&)",
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
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          {/* Botón de registro */}
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
  container: { flex: 1 },
  formContainer: { padding: 20 },
  title: { marginTop: 30, fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { marginBottom: 12 },
  errorText: { color: "red", marginBottom: 10, marginLeft: 10 },
  button: { marginTop: 10 },
});

export default RegisterScreen;
