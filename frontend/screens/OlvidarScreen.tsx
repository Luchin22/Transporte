import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import axios from "axios";

const EmailVerificationScreen = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);

  const sendCode = async () => {
    if (!email.includes("@")) {
      Alert.alert("Error", "Por favor, ingrese un correo electrónico válido.");
      return;
    }

    try {
      const response = await axios.post(
        "https://transporte-production.up.railway.app/api/usuarios/forgot-password",
        { email }
      );

      if (response.status === 200) {
        Alert.alert(
          "Código enviado",
          `Se ha enviado un código de validación a ${email}.`
        );
        setIsCodeSent(true);
      } else {
        Alert.alert("Error", "No se pudo enviar el código.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Hubo un problema al enviar el código."
      );
      console.error(error);
    }
  };

  const confirmCode = async () => {
    if (code.length === 0) {
      Alert.alert("Error", "Por favor, ingrese el código.");
      return;
    }

    try {
      console.log(`Validando código: ${code} para el correo: ${email}`);
      if (code === "123456") {
        setIsCodeValid(true);
        Alert.alert("Éxito", "Código validado correctamente.");
      } else {
        Alert.alert("Error", "El código ingresado es incorrecto.");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al validar el código.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambio de Contraseña</Text>
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
        <Text style={styles.success}>Código validado con éxito</Text>
      )}
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
    borderColor: "#000000",
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
