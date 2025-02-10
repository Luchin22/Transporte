import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const HorarioScreen = () => {
  const API_HORARIOS = "https://transporte-production.up.railway.app/api/horarios";
  const API_RUTAS = "https://transporte-production.up.railway.app/api/rutas";
  const API_BUSES = "https://transporte-production.up.railway.app/api/buses";
  const API_HORARIOS_CON_CAPACIDAD = "https://transporte-production.up.railway.app/api/horarios/horarios-con-capacidad";

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      id_ruta: "",
      hora_salida: "",
      hora_llegada: "",
      id_bus: "",
      estado: "",
    },
  });

  const [rutas, setRutas] = useState([]);
  const [buses, setBuses] = useState([]);
  const [horariosExistentes, setHorariosExistentes] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [horaSalidaSeleccionada, setHoraSalidaSeleccionada] = useState("");

  // Función para obtener los horarios registrados (con capacidad)
  const fetchHorarios = async () => {
    try {
      const response = await axios.get(API_HORARIOS_CON_CAPACIDAD);
      setHorarios(response.data.reverse()); // Invertimos la lista para mostrar los últimos al final
    } catch (error) {
      console.error("Error fetching horarios:", error);
    }
  };

  // Fetch de datos al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rutasResponse = await axios.get(API_RUTAS);
        setRutas(rutasResponse.data);

        const busesResponse = await axios.get(API_BUSES);
        setBuses(busesResponse.data.filter((bus) => bus.estado === "activo"));

        const horariosResponse = await axios.get(API_HORARIOS_CON_CAPACIDAD);
        setHorariosExistentes(horariosResponse.data);
        setHorarios(horariosResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Genera las opciones de horas en intervalos de 30 minutos
  const generateHourOptions = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = `${i.toString().padStart(2, "0")}:${j
          .toString()
          .padStart(2, "0")}:00`;
        hours.push(hour);
      }
    }
    return hours;
  };

  const availableHours = generateHourOptions().filter(
    (hour) =>
      !horariosExistentes.some(
        (h) => h.hora_salida === hour || h.hora_llegada === hour
      )
  );

  // Registrar nuevo horario
  const onSubmit = async (data) => {
    const existingHorarios = horariosExistentes.filter(
      (h) => h.id_ruta === data.id_ruta && h.id_bus === data.id_bus
    );

    const isHourOccupied = existingHorarios.some(
      (h) =>
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
      // Actualizamos la lista completa de horarios para que se muestre la información completa (incluyendo la ruta)
      fetchHorarios();
    } catch (error) {
      console.error("Error registrando horario:", error);
      Alert.alert("Error", "No se pudo registrar el horario.");
    }
  };

  // Eliminar horario
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_HORARIOS}/${id}`);
      setHorarios(horarios.filter((h) => h.id !== id));
      Alert.alert("Éxito", "Horario eliminado.");
      fetchHorarios();
    } catch (error) {
      console.error("Error eliminando horario:", error);
      Alert.alert("Error", "No se pudo eliminar el horario.");
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
                {rutas.map((ruta) => (
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
        {errors.id_ruta && (
          <Text style={styles.errorText}>{errors.id_ruta.message}</Text>
        )}

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
                  setHoraSalidaSeleccionada(itemValue);
                }}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione una hora" value="" />
                {availableHours.map((hour) => (
                  <Picker.Item key={hour} label={hour} value={hour} />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.hora_salida && (
          <Text style={styles.errorText}>{errors.hora_salida.message}</Text>
        )}

        <Controller
          control={control}
          name="hora_llegada"
          rules={{
            required: "La hora de llegada es obligatoria",
            disabled: !horaSalidaSeleccionada,
          }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Text>Hora de Llegada:</Text>
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}
                enabled={!!horaSalidaSeleccionada}
              >
                <Picker.Item label="Seleccione una hora" value="" />
                {availableHours.map((hour) => (
                  <Picker.Item key={hour} label={hour} value={hour} />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.hora_llegada && (
          <Text style={styles.errorText}>{errors.hora_llegada.message}</Text>
        )}

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
                {buses.map((bus) => (
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
        {errors.id_bus && (
          <Text style={styles.errorText}>{errors.id_bus.message}</Text>
        )}

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
        {errors.estado && (
          <Text style={styles.errorText}>{errors.estado.message}</Text>
        )}

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
              {horario.Rutum ? (
                <>
                  <Text>{`Origen: ${horario.Rutum.origen} - Destino: ${horario.Rutum.destino}`}</Text>
                  <Text>{`Monto: ${horario.Rutum.monto || "No disponible"}`}</Text>
                </>
              ) : (
                <Text style={styles.errorText}>
                  Información de ruta no disponible
                </Text>
              )}
              {horario.Bus && horario.Bus.Conductor ? (
                <>
                  <Text>{`Conductor: ${horario.Bus.Conductor.nombre_conductor || "No disponible"}`}</Text>
                  <Text>{`Número de Bus: ${horario.Bus.numero || "No disponible"} - Capacidad: ${horario.Bus.capacidad || "N/A"}`}</Text>
                </>
              ) : (
                <Text style={styles.errorText}>
                  Información del bus no disponible
                </Text>
              )}

              <View style={styles.buttonContainer}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  formContainer: { marginBottom: 20, padding: 15, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  pickerContainer: { marginBottom: 10 },
  picker: { height: 50, borderWidth: 1, borderColor: "#ccc" },
  button: { marginTop: 10, backgroundColor: "#000000" },
  errorText: { color: "red", fontSize: 12 },
  listContainer: { marginTop: 20 },
  horarioItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});

export default HorarioScreen;
