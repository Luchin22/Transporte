import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import axios from "axios";

const API_URL = "https://transporte-production.up.railway.app/api/usuarios";

const EmailVerificationScreen = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  // Función para enviar el código de recuperación
  const sendCode = async () => {
    if (!email.includes("@")) {
      Alert.alert("Error", "Ingrese un correo electrónico válido.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });

      if (response.status === 200) {
        Alert.alert("Código enviado", `Se ha enviado un código de recuperación a ${email}.`);
        setIsCodeSent(true);
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Correo no registrado.");
    }
  };

  // Función para restablecer la contraseña
  const resetPassword = async () => {
    if (code.length === 0) {
      Alert.alert("Error", "Ingrese el código de recuperación.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/reset-password`, {
        email,
        resetCode: code,
        newPassword,
      });

      if (response.status === 200) {
        Alert.alert("Éxito", "Contraseña restablecida con éxito.");
        setIsPasswordReset(true);
        // Limpiar estados
        setEmail("");
        setCode("");
        setNewPassword("");
        setIsCodeSent(false);
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "No se pudo cambiar la contraseña.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>

      {/* Input de correo */}
      <TextInput
        style={styles.input}
        placeholder="Ingrese su correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Enviar Código" onPress={sendCode} />

      {isCodeSent && (
        <>
          {/* Input de código */}
          <TextInput
            style={styles.input}
            placeholder="Ingrese el código recibido"
            keyboardType="numeric"
            value={code}
            onChangeText={setCode}
          />

          {/* Input de nueva contraseña */}
          <TextInput
            style={styles.input}
            placeholder="Ingrese nueva contraseña"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Button title="Restablecer Contraseña" onPress={resetPassword} />
        </>
      )}

      {isPasswordReset && <Text style={styles.success}>Contraseña actualizada correctamente.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  success: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
  },
});

export default EmailVerificationScreen;
