import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import axios from "axios";

const API_URL = "https://transporte-production.up.railway.app/api/usuarios";

const EmailVerificationScreen = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);

  // Enviar el código al correo
  const sendCode = async () => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });

      if (response.status === 200) {
        Alert.alert("Código enviado", `Se ha enviado un código de validación a ${email}.`);
        setIsCodeSent(true);
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Correo no registrado.");
    }
  };

  // Confirmar el código ingresado
  const confirmCode = async () => {
    try {
      const response = await axios.post(`${API_URL}/validate-code`, { email, resetCode: code });

      if (response.status === 200) {
        setIsCodeValid(true);
        Alert.alert("Código correcto", "Ahora puedes cambiar tu contraseña.");
      }
    } catch (error) {
      Alert.alert("Error", "El código ingresado es incorrecto o ha expirado.");
    }
  };

  // Cambiar la contraseña
  const changePassword = async () => {
    if (newPassword.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/reset-password`, {
        email,
        resetCode: code,
        newPassword
      });

      if (response.status === 200) {
        Alert.alert("Éxito", "Contraseña actualizada correctamente.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cambiar la contraseña.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
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
          <TextInput
            style={styles.input}
            placeholder="Ingrese el código recibido"
            keyboardType="numeric"
            value={code}
            onChangeText={setCode}
          />
          <Button title="Confirmar Código" onPress={confirmCode} />
        </>
      )}

      {isCodeValid && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Ingrese nueva contraseña"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Button title="Cambiar Contraseña" onPress={changePassword} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { height: 50, borderWidth: 1, borderColor: "#000", borderRadius: 5, marginBottom: 10, paddingHorizontal: 10, backgroundColor: "#fff" }
});

export default EmailVerificationScreen;
