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

const HorarioScreen = () => {
  const API_URL = "http://192.168.100.8:3000/api/horarios"; // Cambia la URL si es necesario

  const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      hora_salida: "",
      hora_llegada: "",
    },
  });

  const [horarios, setHorarios] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedHorarioId, setSelectedHorarioId] = useState(null);

  // Fetch horarios on load
  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await axios.get(API_URL);
        setHorarios(response.data);
      } catch (error) {
        console.error("Error fetching horarios:", error);
      }
    };

    fetchHorarios();
  }, []);

  // Add or edit horario
  const onSubmit = async (data) => {
    try {
      if (selectedHorarioId) {
        // Editing horario
        await axios.put(`${API_URL}/${selectedHorarioId}`, data);
        setHorarios((prev) =>
          prev.map((horario) =>
            horario.id === selectedHorarioId ? { ...horario, ...data } : horario
          )
        );
        Alert.alert("Éxito", "Horario actualizado correctamente.");
      } else {
        // Adding new horario
        const response = await axios.post(API_URL, data);
        setHorarios((prev) => [...prev, response.data]);
        Alert.alert("Éxito", "Horario registrado correctamente.");
      }
      reset();
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error registrando o actualizando horario:", error);
      Alert.alert("Error", "No se pudo guardar los cambios.");
    }
  };

  // Open edit modal
  const openEditModal = (horario) => {
    setSelectedHorarioId(horario.id);
    setValue("hora_salida", horario.hora_salida);
    setValue("hora_llegada", horario.hora_llegada);
    setEditModalVisible(true);
  };

  // Delete horario
  const deleteHorario = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setHorarios((prev) => prev.filter((horario) => horario.id !== id));
      Alert.alert("Éxito", "Horario eliminado correctamente.");
    } catch (error) {
      console.error("Error eliminando horario:", error);
      Alert.alert("Error", "No se pudo eliminar el horario.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Registrar Horario */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          {selectedHorarioId ? "Editar Horario" : "Registrar Horario"}
        </Text>

        {/* Hora de salida */}
        <Controller
          control={control}
          name="hora_salida"
          rules={{ required: "La hora de salida es obligatoria" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Hora de Salida"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              outlineColor={errors.hora_salida ? "red" : "#78288c"}
            />
          )}
        />
        {errors.hora_salida && <Text style={styles.errorText}>{errors.hora_salida.message}</Text>}

        {/* Hora de llegada */}
        <Controller
          control={control}
          name="hora_llegada"
          rules={{ required: "La hora de llegada es obligatoria" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Hora de Llegada"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              outlineColor={errors.hora_llegada ? "red" : "#78288c"}
            />
          )}
        />
        {errors.hora_llegada && <Text style={styles.errorText}>{errors.hora_llegada.message}</Text>}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.button}
        >
          {selectedHorarioId ? "Actualizar" : "Guardar"}
        </Button>
      </View>

      {/* Lista de Horarios */}
      <View style={styles.listContainer}>
        <Text style={styles.title}>Lista de Horarios</Text>
        {horarios.map((horario) => (
          <View key={horario.id} style={styles.listItem}>
            <Text>Hora de Salida: {horario.hora_salida}</Text>
            <Text>Hora de Llegada: {horario.hora_llegada}</Text>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => openEditModal(horario)}
                style={styles.editButton}
              >
                Editar
              </Button>
              <Button
                mode="outlined"
                onPress={() => deleteHorario(horario.id)}
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

export default HorarioScreen;
