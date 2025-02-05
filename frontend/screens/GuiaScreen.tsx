import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { Picker } from '@react-native-picker/picker';

const RutaScreen = () => {
  const API_URL = "https://transporte-production.up.railway.app/api/rutas";
  const API_RUTAS_CON_CAPACIDAD = "https://transporte-production.up.railway.app/api/rutas/rutas-con-capacidad";
  const API_BUSES = "https://transporte-production.up.railway.app/api/buses";

  const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      origen: "",
      destino: "",
      distancia: "",
      monto: "",
    },
  });

  const [rutas, setRutas] = useState([]);
  const [selectedRutaId, setSelectedRutaId] = useState(null);
  const [buses, setBuses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch rutas on load
  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const response = await axios.get(API_RUTAS_CON_CAPACIDAD);
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
        await axios.put(`${API_URL}/${selectedRutaId}`, data);
        setRutas((prev) => prev.map((ruta) => (ruta.id_ruta === selectedRutaId ? { ...ruta, ...data } : ruta)));
      } else {
        const response = await axios.post(API_URL, data);
        setRutas((prev) => [...prev, response.data]);
      }
      Alert.alert("Éxito", "Ruta guardada correctamente.");
      reset();
      setSelectedRutaId(null);
    } catch (error) {
      console.error("Error registrando o actualizando ruta:", error);
      Alert.alert("Error", "No se pudo guardar los cambios.");
    }
  };

  // Open edit modal
  const openEditModal = (ruta) => {
    setSelectedRutaId(ruta.id_ruta);
    setValue("origen", ruta.origen);
    setValue("destino", ruta.destino);
    setValue("distancia", ruta.distancia.toString());
    setValue("monto", ruta.monto);
    setModalVisible(true); // Open modal
  };

  // Close the modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedRutaId(null); // Clear selected route
  };

  // Delete ruta
  const deleteRuta = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setRutas((prev) => prev.filter((ruta) => ruta.id_ruta !== id));
      Alert.alert("Éxito", "Ruta eliminada correctamente.");
    } catch (error) {
      console.error("Error eliminando ruta:", error);
      Alert.alert("Error", "No se pudo eliminar la ruta.");
    }
  };

  // Update ruta
  const onUpdate = async (data) => {
    try {
      await axios.put(`${API_URL}/${selectedRutaId}`, data);
      setRutas((prev) =>
        prev.map((ruta) => (ruta.id_ruta === selectedRutaId ? { ...ruta, ...data } : ruta))
      );
      Alert.alert("Éxito", "Ruta actualizada correctamente.");
      closeModal(); // Close modal after update
    } catch (error) {
      console.error("Error actualizando ruta:", error);
      Alert.alert("Error", "No se pudo actualizar la ruta.");
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

        {/* Monto */}
        <Controller
          control={control}
          name="monto"
          rules={{ required: "El monto es obligatorio" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Monto por asiento"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              outlineColor={errors.monto ? "red" : "#78288c"}
            />
          )}
        />
        {errors.monto && <Text style={styles.errorText}>{errors.monto.message}</Text>}

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
          <View key={ruta.id_ruta} style={styles.listItem}>
            <Text>Origen: {ruta.origen}</Text>
            <Text>Destino: {ruta.destino}</Text>
            <Text>Distancia: {ruta.distancia} km</Text>
            <Text>Monto: {ruta.monto}</Text>
            <Text>Número de Bus: {ruta.Bus?.numero}</Text>
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => openEditModal(ruta)}
                style={styles.editButton}
              >
                Editar
              </Button>
              
            </View>
          </View>
        ))}
      </View>

      {/* Modal de Edición */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Editar Ruta</Text>
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
                  />
                )}
              />
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
                  />
                )}
              />
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
                  />
                )}
              />
              <Controller
                control={control}
                name="monto"
                rules={{ required: "El monto es obligatorio" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Monto por asiento"
                    mode="outlined"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.input}
                  />
                )}
              />
              <Button
                mode="contained"
                onPress={handleSubmit(onUpdate)}
                style={styles.button}
              >
                Actualizar
              </Button>
              <Button
                mode="outlined"
                onPress={closeModal}
                style={styles.button}
              >
                Cancelar
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  formContainer: { marginBottom: 20, padding: 15, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: { marginBottom: 10 , backgroundColor: "#fff" },
  button: { marginTop: 10, backgroundColor: "#000000" },
  listContainer: { padding: 15, backgroundColor: "#fff" },
  listItem: { marginBottom: 10, padding: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  editButton: { marginRight: 5 },
  deleteButton: { marginLeft: 5 },
  errorText: { color: "red", fontSize: 12 },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    borderRadius: 10,
  },
});

export default RutaScreen;
