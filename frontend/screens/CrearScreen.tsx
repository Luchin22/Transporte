import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const ConductorScreen = () => {
  const API_URL = "http://192.168.100.8:3000/api/conductores";

  const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      nombre_conductor: "",
      dni: "",
      telefono: "",
      licencia: "",
    },
  });

  const [conductores, setConductores] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedConductorId, setSelectedConductorId] = useState(null);

  // Fetch conductores on load
  useEffect(() => {
    const fetchConductores = async () => {
      try {
        const response = await axios.get(API_URL);
        setConductores(response.data);
      } catch (error) {
        console.error("Error fetching conductores:", error);
      }
    };

    fetchConductores();
  }, []);

  // Add conductor
  const onSubmit = async (data) => {
    try {
      if (selectedConductorId) {
        // Editing conductor
        await axios.put(`${API_URL}/${selectedConductorId}`, data);
        setConductores((prev) =>
          prev.map((conductor) =>
            conductor.id === selectedConductorId ? { ...conductor, ...data } : conductor
          )
        );
        Alert.alert("Éxito", "Conductor actualizado correctamente.");
      } else {
        // Adding new conductor
        const response = await axios.post(API_URL, data);
        setConductores((prev) => [...prev, response.data]);
        Alert.alert("Éxito", "Conductor registrado correctamente.");
      }
      reset();
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error registrando o actualizando conductor:", error);
      Alert.alert("Error", "No se pudo guardar los cambios.");
    }
  };

  // Open edit modal
  const openEditModal = (conductor) => {
    setSelectedConductorId(conductor.id);
    setValue("nombre_conductor", conductor.nombre_conductor);
    setValue("dni", conductor.dni);
    setValue("telefono", conductor.telefono);
    setValue("licencia", conductor.licencia);
    setEditModalVisible(true);
  };

  // Delete conductor
  const deleteConductor = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setConductores((prev) => prev.filter((conductor) => conductor.id !== id));
      Alert.alert("Éxito", "Conductor eliminado correctamente.");
    } catch (error) {
      console.error("Error eliminando conductor:", error);
      Alert.alert("Error", "No se pudo eliminar el conductor.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Registrar Conductor */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          {selectedConductorId ? "Editar Conductor" : "Registrar Conductor"}
        </Text>

        {/* Nombre */}
        <Controller
          control={control}
          name="nombre_conductor"
          rules={{ required: "El nombre es obligatorio" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Nombre"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              outlineColor={errors.nombre_conductor ? "red" : "#78288c"}
            />
          )}
        />
        {errors.nombre_conductor && (
          <Text style={styles.errorText}>{errors.nombre_conductor.message}</Text>
        )}

        {/* DNI */}
        <Controller
          control={control}
          name="dni"
          rules={{
            required: "El DNI es obligatorio",
            pattern: { value: /^\d+$/, message: "DNI inválido" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="DNI"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="number-pad"
              style={styles.input}
              outlineColor={errors.dni ? "red" : "#78288c"}
            />
          )}
        />
        {errors.dni && (
          <Text style={styles.errorText}>{errors.dni.message}</Text>
        )}

        {/* Teléfono */}
        <Controller
          control={control}
          name="telefono"
          rules={{
            required: "El teléfono es obligatorio",
            pattern: { value: /^\d{10}$/, message: "Teléfono inválido" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Teléfono"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="phone-pad"
              style={styles.input}
              outlineColor={errors.telefono ? "red" : "#78288c"}
            />
          )}
        />
        {errors.telefono && (
          <Text style={styles.errorText}>{errors.telefono.message}</Text>
        )}

        {/* Licencia */}
        <Controller
          control={control}
          name="licencia"
          rules={{ required: "La licencia es obligatoria" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Licencia"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              outlineColor={errors.licencia ? "red" : "#78288c"}
            />
          )}
        />
        {errors.licencia && (
          <Text style={styles.errorText}>{errors.licencia.message}</Text>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.button}
        >
          {selectedConductorId ? "Actualizar" : "Guardar"}
        </Button>
      </View>

      {/* Lista de Conductores */}
      <View style={styles.listContainer}>
        <Text style={styles.title}>Lista de Conductores</Text>
        {conductores.map((conductor) => (
          <View key={conductor.id} style={styles.listItem}>
            <Text>Nombre: {conductor.nombre_conductor}</Text>
            <Text>DNI: {conductor.dni}</Text>
            <Text>Teléfono: {conductor.telefono}</Text>
            <Text>Licencia: {conductor.licencia}</Text>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => openEditModal(conductor)}
                style={styles.editButton}
              >
                Editar
              </Button>
              <Button
                mode="outlined"
                onPress={() => deleteConductor(conductor.id)}
                style={styles.deleteButton}
                color="red"
              >
                Eliminar
              </Button>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  formContainer: { marginBottom: 20, padding: 15, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: { marginBottom: 10 },
  button: { marginTop: 10 },
  listContainer: { padding: 15, backgroundColor: "#fff" },
  listItem: { marginBottom: 10, padding: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  editButton: { marginRight: 5 },
  deleteButton: { marginLeft: 5 },
  errorText: { color: "red", fontSize: 12, marginBottom: 5 }, // Agregado

});

export default ConductorScreen;
