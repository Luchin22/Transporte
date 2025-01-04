import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const RutaScreen = () => {
  const API_URL = "http://192.168.100.8:3000/api/rutas"; // Cambia la URL si es necesario

  const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      origen: "",
      destino: "",
      distancia: "",
      estado: "",
    },
  });

  const [rutas, setRutas] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRutaId, setSelectedRutaId] = useState(null);

  // Fetch rutas on load
  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const response = await axios.get(API_URL);
        setRutas(response.data);
      } catch (error) {
        console.error("Error fetching rutas:", error);
      }
    };

    fetchRutas();
  }, []);

  // Add or edit ruta
  const onSubmit = async (data) => {
    try {
      if (selectedRutaId) {
        // Editing ruta
        await axios.put(`${API_URL}/${selectedRutaId}`, data);
        setRutas((prev) =>
          prev.map((ruta) =>
            ruta.id === selectedRutaId ? { ...ruta, ...data } : ruta
          )
        );
        Alert.alert("Éxito", "Ruta actualizada correctamente.");
      } else {
        // Adding new ruta
        const response = await axios.post(API_URL, data);
        setRutas((prev) => [...prev, response.data]);
        Alert.alert("Éxito", "Ruta registrada correctamente.");
      }
      reset();
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error registrando o actualizando ruta:", error);
      Alert.alert("Error", "No se pudo guardar los cambios.");
    }
  };

  // Open edit modal
  const openEditModal = (ruta) => {
    setSelectedRutaId(ruta.id);
    setValue("origen", ruta.origen);
    setValue("destino", ruta.destino);
    setValue("distancia", ruta.distancia);
    setValue("estado", ruta.estado);
    setEditModalVisible(true);
  };

  // Delete ruta
  const deleteRuta = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setRutas((prev) => prev.filter((ruta) => ruta.id !== id));
      Alert.alert("Éxito", "Ruta eliminada correctamente.");
    } catch (error) {
      console.error("Error eliminando ruta:", error);
      Alert.alert("Error", "No se pudo eliminar la ruta.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Registrar Ruta */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          {selectedRutaId ? "Editar Ruta" : "Registrar Ruta"}
        </Text>

        {/* Origen */}
        <Controller
          control={control}
          name="origen"
          rules={{ required: "El origen es obligatorio" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Origen"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              outlineColor={errors.origen ? "red" : "#78288c"}
            />
          )}
        />
        {errors.origen && <Text style={styles.errorText}>{errors.origen.message}</Text>}

        {/* Destino */}
        <Controller
          control={control}
          name="destino"
          rules={{ required: "El destino es obligatorio" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Destino"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              outlineColor={errors.destino ? "red" : "#78288c"}
            />
          )}
        />
        {errors.destino && <Text style={styles.errorText}>{errors.destino.message}</Text>}

        {/* Distancia */}
        <Controller
          control={control}
          name="distancia"
          rules={{
            required: "La distancia es obligatoria",
            pattern: { value: /^\d+$/, message: "Distancia inválida" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Distancia (km)"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="number-pad"
              style={styles.input}
              outlineColor={errors.distancia ? "red" : "#78288c"}
            />
          )}
        />
        {errors.distancia && <Text style={styles.errorText}>{errors.distancia.message}</Text>}

        {/* Estado */}
        <Controller
          control={control}
          name="estado"
          rules={{ required: "El estado es obligatorio" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Estado"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              outlineColor={errors.estado ? "red" : "#78288c"}
            />
          )}
        />
        {errors.estado && <Text style={styles.errorText}>{errors.estado.message}</Text>}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.button}
        >
          {selectedRutaId ? "Actualizar" : "Guardar"}
        </Button>
      </View>

      {/* Lista de Rutas */}
      <View style={styles.listContainer}>
        <Text style={styles.title}>Lista de Rutas</Text>
        {rutas.map((ruta) => (
          <View key={ruta.id} style={styles.listItem}>
            <Text>Origen: {ruta.origen}</Text>
            <Text>Destino: {ruta.destino}</Text>
            <Text>Distancia: {ruta.distancia} km</Text>
            <Text>Estado: {ruta.estado}</Text>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => openEditModal(ruta)}
                style={styles.editButton}
              >
                Editar
              </Button>
              <Button
                mode="outlined"
                onPress={() => deleteRuta(ruta.id)}
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
  errorText: { color: "red", fontSize: 12 },
});

export default RutaScreen;
