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

const BusScreen = () => {
  const API_URL = "http://192.168.100.8:3000/api/buses";

  const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      placa: "",
      marca: "",
      modelo: "",
      capacidad: "",
      estado: "",
    },
  });

  const [buses, setBuses] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState(null);

  // Fetch buses on load
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get(API_URL);
        setBuses(response.data);
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };

    fetchBuses();
  }, []);

  // Add or edit bus
  const onSubmit = async (data) => {
    try {
      if (selectedBusId) {
        // Editing bus
        await axios.put(`${API_URL}/${selectedBusId}`, data);
        setBuses((prev) =>
          prev.map((bus) =>
            bus.id === selectedBusId ? { ...bus, ...data } : bus
          )
        );
        Alert.alert("Éxito", "Bus actualizado correctamente.");
      } else {
        // Adding new bus
        const response = await axios.post(API_URL, data);
        setBuses((prev) => [...prev, response.data]);
        Alert.alert("Éxito", "Bus registrado correctamente.");
      }
      reset();
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error registrando o actualizando bus:", error);
      Alert.alert("Error", "No se pudo guardar los cambios.");
    }
  };

  // Open edit modal
  const openEditModal = (bus) => {
    setSelectedBusId(bus.id);
    setValue("placa", bus.placa);
    setValue("marca", bus.marca);
    setValue("modelo", bus.modelo);
    setValue("capacidad", bus.capacidad);
    setValue("estado", bus.estado);
    setEditModalVisible(true);
  };

  // Delete bus
  const deleteBus = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setBuses((prev) => prev.filter((bus) => bus.id !== id));
      Alert.alert("Éxito", "Bus eliminado correctamente.");
    } catch (error) {
      console.error("Error eliminando bus:", error);
      Alert.alert("Error", "No se pudo eliminar el bus.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Registrar Bus */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          {selectedBusId ? "Editar Bus" : "Registrar Bus"}
        </Text>

        {/* Placa */}
        <Controller
          control={control}
          name="placa"
          rules={{ required: "La placa es obligatoria" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Placa"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              outlineColor={errors.placa ? "red" : "#78288c"}
            />
          )}
        />
        {errors.placa && <Text style={styles.errorText}>{errors.placa.message}</Text>}

        {/* Marca */}
        <Controller
          control={control}
          name="marca"
          rules={{ required: "La marca es obligatoria" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Marca"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              outlineColor={errors.marca ? "red" : "#78288c"}
            />
          )}
        />
        {errors.marca && <Text style={styles.errorText}>{errors.marca.message}</Text>}

        {/* Modelo */}
        <Controller
          control={control}
          name="modelo"
          rules={{ required: "El modelo es obligatorio" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Modelo"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              outlineColor={errors.modelo ? "red" : "#78288c"}
            />
          )}
        />
        {errors.modelo && <Text style={styles.errorText}>{errors.modelo.message}</Text>}

        {/* Capacidad */}
        <Controller
          control={control}
          name="capacidad"
          rules={{ required: "La capacidad es obligatoria", pattern: { value: /^\d+$/, message: "Capacidad inválida" } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Capacidad"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="number-pad"
              style={styles.input}
              outlineColor={errors.capacidad ? "red" : "#78288c"}
            />
          )}
        />
        {errors.capacidad && <Text style={styles.errorText}>{errors.capacidad.message}</Text>}

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
          {selectedBusId ? "Actualizar" : "Guardar"}
        </Button>
      </View>

      {/* Lista de Buses */}
      <View style={styles.listContainer}>
        <Text style={styles.title}>Lista de Buses</Text>
        {buses.map((bus) => (
          <View key={bus.id} style={styles.listItem}>
            <Text>Placa: {bus.placa}</Text>
            <Text>Marca: {bus.marca}</Text>
            <Text>Modelo: {bus.modelo}</Text>
            <Text>Capacidad: {bus.capacidad}</Text>
            <Text>Estado: {bus.estado}</Text>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => openEditModal(bus)}
                style={styles.editButton}
              >
                Editar
              </Button>
              <Button
                mode="outlined"
                onPress={() => deleteBus(bus.id)}
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

export default BusScreen;
