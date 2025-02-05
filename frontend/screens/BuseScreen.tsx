import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

const BusScreen = () => {
  const API_URL = "https://transporte-production.up.railway.app/api/buses";
  const CONDUCTORES_API = "https://transporte-production.up.railway.app/api/conductores";

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      placa: "",
      marca: "",
      modelo: "",
      capacidad_inicial: "",
      estado: "",
      numero: "",
      id_conductor: "",
    },
  });

  const [buses, setBuses] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get(API_URL);
        setBuses(response.data);
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };

    const fetchConductores = async () => {
      try {
        const response = await axios.get(CONDUCTORES_API);
        setConductores(response.data);
      } catch (error) {
        console.error("Error fetching conductores:", error);
      }
    };

    fetchBuses();
    fetchConductores();
  }, []);
  const onSubmit = async (data) => {
    try {
      data.capacidad = data.capacidad_inicial;
      const response = await axios.post(API_URL, data);
      setBuses((prev) => [...prev, response.data]);
      Alert.alert("Éxito", "Bus registrado correctamente.");
      reset();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Verifica si hay un mensaje de error en la respuesta del backend
        const errorMessage = error.response.data.message || "No se pudo registrar el bus.";
        Alert.alert("Error", errorMessage);
      } else {
        // Para otros errores (como problemas de red)
        Alert.alert("Error", "Hubo un problema con la conexión al servidor.");
      }
    }
  };
  
  
  

  const onUpdateBus = async (data) => {
    console.log("selectedBusId:", selectedBusId); // Verifica el ID del bus antes de la solicitud
  
    if (!selectedBusId) {
      console.log("No se ha seleccionado un bus.");
      return; // No realizar la actualización si no hay un bus seleccionado
    }
  
    try {
      data.capacidad = data.capacidad_inicial;
      const response = await axios.patch(
        `https://transporte-production.up.railway.app/api/buses/${selectedBusId}/update-dato`,
        data
      );
      console.log("Bus actualizado:", response.data);
      // Actualiza el estado aquí si es necesario
      setBuses((prev) =>
        prev.map((bus) =>
          bus.id === selectedBusId ? { ...bus, ...data } : bus
        )
      );
      Alert.alert("Éxito", "Bus actualizado correctamente.");
    } catch (error) {
      console.error("Error actualizando bus:", error);
      Alert.alert("Error", "No se pudo actualizar el bus.");
    }
  };
  
  

  const openEditModal = (bus) => {
    console.log("Bus seleccionado:", bus); // Verifica el bus aquí
    setSelectedBusId(bus.id_bus); // Esto debe asignar el ID del bus
    setValue("placa", bus.placa);
    setValue("marca", bus.marca);
    setValue("modelo", bus.modelo);
    setValue("capacidad_inicial", bus.capacidad_inicial);
    setValue("estado", bus.estado);
    setValue("numero", bus.numero);
    setValue("id_conductor", bus.id_conductor);
    setEditModalVisible(true);
  };
  



  const closeEditModal = () => {
    setEditModalVisible(false);
    reset();
  };

  const deleteBus = async (id_bus) => {
    try {
      await axios.delete(`${API_URL}/${id_bus}`);
      setBuses((prev) => prev.filter((bus) => bus.id_bus !== id_bus));
      Alert.alert("Éxito", "Bus eliminado correctamente.");
    } catch (error) {
      console.error("Error eliminando bus:", error);
      Alert.alert("Error", "No se pudo eliminar el bus.");
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      {/* Formulario de registro */}
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
          name="capacidad_inicial"
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
              outlineColor={errors.capacidad_inicial ? "red" : "#78288c"}
            />
          )}
        />
        {errors.capacidad_inicial && <Text style={styles.errorText}>{errors.capacidad_inicial.message}</Text>}

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

        {/* Numero */}
        <Controller
          control={control}
          name="numero"
          rules={{ required: "El número es obligatorio", pattern: { value: /^\d+$/, message: "Número inválido" } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Número"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="number-pad"
              style={styles.input}
              outlineColor={errors.numero ? "red" : "#78288c"}
            />
          )}
        />
        {errors.numero && <Text style={styles.errorText}>{errors.numero.message}</Text>}

        {/* Conductor */}
        <Controller
          control={control}
          name="id_conductor"
          rules={{ required: "Debe seleccionar un conductor" }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.dropdown}>
              <Text style={styles.dropdownLabel}>Conductor:</Text>
              <RNPickerSelect
                onValueChange={(value) => onChange(value)}
                items={conductores.map((conductor) => ({
                  label: conductor.nombre_conductor,
                  value: conductor.id_conductor,
                }))}
                placeholder={{ label: 'Seleccione un conductor', value: '' }}
                style={styles.pickerSelectStyles}
                value={value}
              />
              {errors.id_conductor && <HelperText type="error">{errors.id_conductor.message}</HelperText>}
            </View>
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.button}
        >
          Guardar
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
              onPress={() => deleteBus(bus.id_bus)} // Usar id_bus en lugar de id
                 style={styles.deleteButton}
                    color="red"
                        >
                        Eliminar
                </Button>

            </View>
          </View>
        ))}
      </View>

      {/* Modal de Edición */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Editar Bus</Text>

         

             {/* Placa */}
             <Controller
              control={control}
              name="placa"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Placa"
                  mode="outlined"
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                />
              )}
            />

            {/* Marca */}
            <Controller
              control={control}
              name="marca"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Marca"
                  mode="outlined"
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                />
              )}
            />

            {/* Modelo */}
            <Controller
              control={control}
              name="modelo"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Modelo"
                  mode="outlined"
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                />
              )}
            />

            {/* Capacidad */}
            <Controller
              control={control}
              name="capacidad_inicial"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Capacidad"
                  mode="outlined"
                  onChangeText={onChange}
                  value={value}
                  keyboardType="number-pad"
                  style={styles.input}
                />
              )}
            />

            {/* Estado */}
            <Controller
              control={control}
              name="estado"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Estado"
                  mode="outlined"
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                />
              )}
            />

            {/* Número */}
            <Controller
              control={control}
              name="numero"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Número"
                  mode="outlined"
                  onChangeText={onChange}
                  value={value}
                  keyboardType="number-pad"
                  style={styles.input}
                />
              )}
            />

<Button
  mode="contained"
  onPress={handleSubmit(onUpdateBus)}
  loading={isSubmitting}
  style={styles.button}
  disabled={!selectedBusId} // Deshabilita el botón si no se ha seleccionado un bus
>
  Actualizar
</Button>



            <Button
              mode="text"
              onPress={closeEditModal}
              style={styles.button}
            >
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  formContainer: { marginBottom: 20, padding: 15, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: { marginBottom: 10, backgroundColor: "#fff" },
  button: { marginTop: 10, backgroundColor: "#000000" },
  listContainer: { padding: 15, backgroundColor: "#fff" },
  listItem: { marginBottom: 10, padding: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  editButton: { marginRight: 5 },
  dropdown: { marginBottom: 10 },
  dropdownLabel: { fontSize: 14, marginBottom: 5 },
  dropdownContent: {
    paddingVertical: 10,
  },
  deleteButton: { marginLeft: 5 },
  dropdownMenu: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#78288c",
    backgroundColor: "#fff",
    borderRadius: 5,
    position: "absolute",
    top: 50,
    width: "100%",
    zIndex: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  errorText: { color: "red", fontSize: 12 },
  pickerSelectStyles: {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: "#78288c",
      backgroundColor: "#fff",
    },
    inputAndroid: {
      fontSize: 16,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: "#78288c",
      backgroundColor: "#fff",
    },
    
  },  

});


export default BusScreen;
