import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const HorarioScreen = () => {
  const API_HORARIOS = "https://transporte-production.up.railway.app/api/horarios";
  const API_RUTAS = "https://transporte-production.up.railway.app/api/rutas";
  const API_BUSES = "https://transporte-production.up.railway.app/api/buses";
  const API_HORARIOS_CON_CAPACIDAD = "https://transporte-production.up.railway.app/api/horarios/horarios-con-capacidad";

  const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      id_ruta: "",
      hora_salida: "",
      hora_llegada: "",
      id_bus: "",
      estado: "", // Añadí el campo estado
    },
  });

  const [rutas, setRutas] = useState([]);
  const [buses, setBuses] = useState([]);
  const [horariosExistentes, setHorariosExistentes] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [horaSalidaSeleccionada, setHoraSalidaSeleccionada] = useState(""); // Nuevo estado
  const [modalVisible, setModalVisible] = useState(false); // Estado para mostrar el modal
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null); // Para guardar el horario seleccionado para editar

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rutasResponse = await axios.get(API_RUTAS);
        setRutas(rutasResponse.data);
  
        const busesResponse = await axios.get(API_BUSES);
        setBuses(busesResponse.data.filter(bus => bus.estado === "activo"));
  
        const horariosResponse = await axios.get(API_HORARIOS_CON_CAPACIDAD);
        setHorariosExistentes(horariosResponse.data);
        setHorarios(horariosResponse.data); // Aquí inicializamos el estado 'horarios'
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  // Filtrar horarios disponibles según el bus y la ruta seleccionada
  const generateHourOptions = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = `${i.toString().padStart(2, "0")}:${j.toString().padStart(2, "0")}:00`;
        hours.push(hour);
      }
    }
    return hours;
  };

  const availableHours = generateHourOptions().filter(hour =>
    !horariosExistentes.some(h => h.hora_salida === hour || h.hora_llegada === hour)
  );

  const onSubmit = async (data) => {
    const existingHorarios = horariosExistentes.filter(h =>
      h.id_ruta === data.id_ruta && h.id_bus === data.id_bus
    );
  
    const isHourOccupied = existingHorarios.some(h =>
      (data.hora_salida >= h.hora_salida && data.hora_salida < h.hora_llegada) ||
      (data.hora_llegada > h.hora_salida && data.hora_llegada <= h.hora_llegada)
    );
  
    if (isHourOccupied) {
      Alert.alert("Error", "El horario seleccionado ya está ocupado.");
      return;
    }
  
    const dataToSend = {
      hora_salida: data.hora_salida,
      hora_llegada: data.hora_llegada,
      id_bus: data.id_bus,
      id_ruta: data.id_ruta,
      estado: data.estado,
    };
  
    try {
      const response = await axios.post(API_HORARIOS, dataToSend);
      Alert.alert("Éxito", "Horario registrado correctamente.");
      reset();
      // Actualizar la lista de horarios después de registrar uno nuevo
      setHorarios(prevHorarios => [...prevHorarios, response.data]); // Asumiendo que la respuesta tiene los datos del horario creado
    } catch (error) {
      console.error("Error registrando horario:", error);
      Alert.alert("Error", "No se pudo registrar el horario.");
    }
  };
  
  // Eliminar horario
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_HORARIOS}/${id}`);
      setHorarios(horarios.filter(h => h.id !== id)); // Actualiza la lista de horarios
      Alert.alert("Éxito", "Horario eliminado.");
    } catch (error) {
      console.error("Error eliminando horario:", error);
      Alert.alert("Error", "No se pudo eliminar el horario.");
    }
  };

  // Actualizar el horario editado
  const onUpdate = async () => {
    if (!horarioSeleccionado) return;

    const updatedData = {
      ...horarioSeleccionado,
      hora_salida: horarioSeleccionado.hora_salida,
      hora_llegada: horarioSeleccionado.hora_llegada,
    };

    try {
      await axios.put(`${API_HORARIOS}/${horarioSeleccionado.id_horario}`, updatedData);
      setHorarios(horarios.map(h => (h.id_horario === horarioSeleccionado.id_horario ? updatedData : h)));
      setModalVisible(false);
      Alert.alert("Éxito", "Horario actualizado correctamente.");
    } catch (error) {
      console.error("Error actualizando horario:", error);
      Alert.alert("Error", "No se pudo actualizar el horario.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Registrar Horario</Text>

        <Controller
          control={control}
          name="id_ruta"
          rules={{ required: "La ruta es obligatoria" }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Text>Ruta:</Text>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => {
                  onChange(itemValue);
                  setValue("id_bus", ""); // Reiniciar bus seleccionado al cambiar ruta
                }}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione una ruta" value="" />
                {rutas.map(ruta => (
                  <Picker.Item
                    key={ruta.id_ruta}
                    label={`${ruta.id_ruta}: ${ruta.origen} - ${ruta.destino}`}
                    value={ruta.id_ruta}
                  />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.id_ruta && <Text style={styles.errorText}>{errors.id_ruta.message}</Text>}

        <Controller
          control={control}
          name="hora_salida"
          rules={{ required: "La hora de salida es obligatoria" }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Text>Hora de Salida:</Text>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => {
                  onChange(itemValue);
                  setHoraSalidaSeleccionada(itemValue); // Guardar hora salida seleccionada
                }}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione una hora" value="" />
                {availableHours.map(hour => (
                  <Picker.Item key={hour} label={hour} value={hour} />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.hora_salida && <Text style={styles.errorText}>{errors.hora_salida.message}</Text>}

        <Controller
          control={control}
          name="hora_llegada"
          rules={{ required: "La hora de llegada es obligatoria", disabled: !horaSalidaSeleccionada }} // Deshabilitado si no se selecciona hora de salida
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Text>Hora de Llegada:</Text>
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}
                enabled={!!horaSalidaSeleccionada} // Habilitar solo si hay hora de salida
              >
                <Picker.Item label="Seleccione una hora" value="" />
                {availableHours.map(hour => (
                  <Picker.Item key={hour} label={hour} value={hour} />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.hora_llegada && <Text style={styles.errorText}>{errors.hora_llegada.message}</Text>}

        <Controller
          control={control}
          name="id_bus"
          rules={{ required: "El bus es obligatorio" }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Text>Bus:</Text>
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione un bus" value="" />
                {buses.map(bus => (
                  <Picker.Item
                    key={bus.id_bus}
                    label={`ID: ${bus.id_bus} - Bus ${bus.numero}`}
                    value={bus.id_bus}
                  />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.id_bus && <Text style={styles.errorText}>{errors.id_bus.message}</Text>}

        <Controller
          control={control}
          name="estado"
          rules={{ required: "El estado es obligatorio" }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Text>Estado:</Text>
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione el estado" value="" />
                <Picker.Item label="Activo" value="activo" />
                <Picker.Item label="Inactivo" value="inactivo" />
              </Picker>
            </View>
          )}
        />
        {errors.estado && <Text style={styles.errorText}>{errors.estado.message}</Text>}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.button}
        >
          Guardar
        </Button>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.title}>Horarios Registrados</Text>
        {horarios.length > 0 ? (
          horarios.map((horario) => (
            <View key={horario.id_horario} style={styles.horarioItem}>
              <Text>{`Origen: ${horario.Rutum.origen} - Destino: ${horario.Rutum.destino}`}</Text>
              <Text>{`Monto: ${horario.Rutum.monto} - Conductor: ${horario.Bus.Conductor.nombre_conductor}`}</Text>
              <Text>{`Número de Bus: ${horario.Bus.numero} - Capacidad: ${horario.Bus.capacidad}`}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setHorarioSeleccionado(horario);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(horario.id_horario)}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text>No hay horarios registrados.</Text>
        )}
      </View>

      {/* Modal para editar el horario */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Editar Horario</Text>
          
          <Text>Hora de Salida:</Text>
          <Picker
            selectedValue={horarioSeleccionado?.hora_salida}
            onValueChange={(itemValue) => setHorarioSeleccionado({ ...horarioSeleccionado, hora_salida: itemValue })}
            style={styles.picker}
          >
            {availableHours.map(hour => (
              <Picker.Item key={hour} label={hour} value={hour} />
            ))}
          </Picker>

          <Text>Hora de Llegada:</Text>
          <Picker
            selectedValue={horarioSeleccionado?.hora_llegada}
            onValueChange={(itemValue) => setHorarioSeleccionado({ ...horarioSeleccionado, hora_llegada: itemValue })}
            style={styles.picker}
          >
            {availableHours.map(hour => (
              <Picker.Item key={hour} label={hour} value={hour} />
            ))}
          </Picker>

          <Button mode="contained" onPress={onUpdate} style={styles.button}>
            Actualizar
          </Button>

          <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.button}>
            Cancelar
          </Button>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  formContainer: { marginBottom: 20, padding: 15, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  pickerContainer: { marginBottom: 10 },
  picker: { height: 50, borderWidth: 1, borderColor: "#ccc" },
  button: { marginTop: 10, backgroundColor: "#000000"  },
  errorText: { color: "red", fontSize: 12 },
  listContainer: { marginTop: 20 },
  horarioItem: { padding: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  buttonText: { color: "#007BFF", textDecorationLine: "underline" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },

});

export default HorarioScreen;
