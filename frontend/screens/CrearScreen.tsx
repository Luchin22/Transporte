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
import { useState, useEffect } from "react";

const ConductorScreen = () => {
  const API_URL = "https://transporte-production.up.railway.app/api/conductores";
  
  const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      nombre_conductor: "",
      dni: "",
      telefono: "",
      licencia: "",
    },
  });

  const [conductores, setConductores] = useState([]);
  const [selectedConductorId, setSelectedConductorId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar si estamos editando
  const [modalVisible, setModalVisible] = useState(false); // Controlar la visibilidad del modal

  useEffect(() => {
    fetchConductores();
  }, []);

  const fetchConductores = async () => {
    try {
      const response = await axios.get(API_URL);
      setConductores(response.data);
    } catch (error) {
      console.error("Error fetching conductores:", error);
    }
  };

  // Función para manejar la actualización
  const openEditModal = (conductor) => {
    console.log("Conductor seleccionado:", conductor);
    setSelectedConductorId(conductor.id_conductor); // Asegúrate de usar 'id_conductor'
    setIsEditing(true); // Cambiar al modo de edición
    setValue("nombre_conductor", conductor.nombre_conductor);
    setValue("dni", conductor.dni);
    setValue("telefono", conductor.telefono);
    setValue("licencia", conductor.licencia);
    setModalVisible(true); // Abrir el modal
  };
  

  const onUpdate = async (data) => {
    if (!selectedConductorId) {
      Alert.alert("Error", "No se ha seleccionado un conductor para actualizar.");
      return;
    }
  
    try {
      // Validar que el nuevo DNI no pertenezca a otro conductor
      const existing = conductores.find(
        (c) => c.dni === data.dni && c.id_conductor !== selectedConductorId
      );
  
  
      // Enviar solicitud PUT para actualizar el conductor
      await axios.put(`${API_URL}/${selectedConductorId}`, data);
  
      // Actualizar el estado de los conductores
      setConductores((prev) =>
        prev.map((conductor) =>
          conductor.id_conductor === selectedConductorId ? { ...conductor, ...data } : conductor
        )
      );
  
      Alert.alert("Éxito", "Conductor actualizado correctamente.");
      reset();
      setSelectedConductorId(null); // Limpiar el ID seleccionado después de la actualización
      setIsEditing(false); // Salir del modo de edición
      setModalVisible(false); // Cerrar el modal
    } catch (error) {
      console.error("Error actualizando conductor:", error);
      Alert.alert("Error", "No se pudo actualizar el conductor.");
    }
  };
  

  const onSubmit = async (data) => {
    if (isEditing) {
      // Si estamos en modo de edición, actualizar el conductor
      console.log("Actualizando conductor...");
      onUpdate(data);
    } else {
      // Si estamos creando un nuevo conductor
      console.log("Guardando nuevo conductor...");
      try {
        const existing = conductores.find((c) => c.dni === data.dni);
        if (existing) {
          Alert.alert("Error", "El DNI ya está registrado.");
          return;
        }

        const response = await axios.post(API_URL, data);
        setConductores((prev) => [...prev, response.data]);
        Alert.alert("Éxito", "Conductor registrado correctamente.");
        reset();
        setSelectedConductorId(null);
      } catch (error) {
        console.error("Error registrando conductor:", error);
        Alert.alert("Error", "No se pudo guardar el conductor.");
      }
    }
  };

  const deleteConductor = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      Alert.alert("Éxito", "Conductor eliminado correctamente.");
      fetchConductores(); // Se vuelve a obtener la lista actualizada
    } catch (error) {
      console.error("Error eliminando conductor:", error);
      Alert.alert("Error", "No se pudo eliminar el conductor.");
    }
  };
  

  
  const handleCancelEdit = () => {
    reset();
    setSelectedConductorId(null);
    setIsEditing(false); // Salir del modo de edición
    setModalVisible(false); // Cerrar el modal
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          {isEditing ? "Editar Conductor" : "Registrar Conductor"}
        </Text>

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

           <Controller
  control={control}
  name="dni"
  rules={{
    required: "El DNI es obligatorio",
    pattern: { value: /^\d{10}$/, message: "El DNI debe tener exactamente 10 dígitos" },
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

        {errors.dni && <Text style={styles.errorText}>{errors.dni.message}</Text>}

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
        {errors.telefono && <Text style={styles.errorText}>{errors.telefono.message}</Text>}

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
        {errors.licencia && <Text style={styles.errorText}>{errors.licencia.message}</Text>}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)} // Maneja el evento de guardar o actualizar
            loading={isSubmitting}
            style={styles.button}
          >
            {isEditing ? "Actualizar" : "Guardar"}
          </Button>
          {isEditing && (
            <Button
              mode="outlined"
              onPress={handleCancelEdit} // Cancelar edición
              style={[styles.button, styles.cancelButton]}
            >
              Cancelar
            </Button>
          )}
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.title}>Lista de Conductores</Text>
        {conductores.map((conductor) => (
  <View key={conductor.id_conductor} style={styles.listItem}>
    <Text>Nombre: {conductor.nombre_conductor}</Text>
    <Text>DNI: {conductor.dni}</Text>
    <Text>Teléfono: {conductor.telefono}</Text>
    <Text>Licencia: {conductor.licencia}</Text>

    <View style={styles.buttonContainer}>
      <Button mode="outlined" onPress={() => openEditModal(conductor)} style={styles.editButton}>
        Editar
      </Button>
      <Button mode="outlined" onPress={() => deleteConductor(conductor.id_conductor)} style={styles.deleteButton} color="red">
        Eliminar
      </Button>
    </View>
  </View>
))}

      </View>

      {/* Modal de edición */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={handleCancelEdit}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Conductor</Text>

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
            {errors.dni && <Text style={styles.errorText}>{errors.dni.message}</Text>}

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
            {errors.telefono && <Text style={styles.errorText}>{errors.telefono.message}</Text>}

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
            {errors.licencia && <Text style={styles.errorText}>{errors.licencia.message}</Text>}

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSubmit(onUpdate)} // Actualizar conductor desde el modal
                loading={isSubmitting}
                style={styles.button}
              >
                Actualizar
              </Button>
              <Button
                mode="outlined"
                onPress={handleCancelEdit} // Cancelar edición y cerrar el modal
                style={[styles.button, styles.cancelButton]}
              >
                Cancelar
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  formContainer: { marginBottom: 20, padding: 15, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color : "#000000" },
  input: { marginBottom: 10, backgroundColor: "#f5f5f5" },
  button: { marginTop: 10, backgroundColor: "#000000" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between"},
  cancelButton: { backgroundColor: "#f5f5f5" },
  errorText: { color: "red", fontSize: 12 },
  listContainer: { marginTop: 20, padding: 15, backgroundColor: "#fff" },
  listItem: { marginBottom: 15, padding: 10, backgroundColor: "#fff" },
  editButton: { flex: 1, marginRight: 5 },
  deleteButton: { flex: 1 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContainer: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
});

export default ConductorScreen;
