import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get('window').width;

// Arreglo con los nombres de los meses en español
const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const AnalysisScreen = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReservations: 0,
    totalPayments: 0,
    monthlyPayments: Array(12).fill(0),
    monthlyReservations: Array(12).fill(0),
    monthlyUserCreations: Array(12).fill(0),
  });

  const fetchStats = async () => {
    try {
      const usersResponse = await axios.get('https://transporte-production.up.railway.app/api/usuarios/listarUsuarios');
      const reservationsResponse = await axios.get('https://transporte-production.up.railway.app/api/reservas');
      const paymentsResponse = await axios.get('https://transporte-production.up.railway.app/api/pagos');

      const totalUsers = usersResponse.data.length;
      const totalReservations = reservationsResponse.data.reduce((acc, curr) => acc + parseFloat(curr.monto), 0);
      const totalPayments = paymentsResponse.data.reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

      const monthlyPayments = Array(12).fill(0);
      const monthlyReservations = Array(12).fill(0);
      const monthlyUserCreations = Array(12).fill(0);

      // Para pagos: solo se consideran (por ejemplo) los datos hasta febrero (0 = Enero, 1 = Febrero)
      paymentsResponse.data.forEach(payment => {
        const month = new Date(payment.fecha_pago).getMonth();
        if (month <= 1) {
          monthlyPayments[month] += parseFloat(payment.monto);
        }
      });

      // Para reservas: solo se consideran (por ejemplo) los datos hasta febrero
      reservationsResponse.data.forEach(reservation => {
        const month = new Date(reservation.fecha_reserva).getMonth();
        if (month <= 1) {
          monthlyReservations[month] += parseFloat(reservation.monto);
        }
      });

      // Para usuarios: se cuentan las creaciones mensuales sin restricción de mes
      usersResponse.data.forEach(user => {
        const month = new Date(user.fecha_creacion).getMonth();
        monthlyUserCreations[month]++;
      });

      setStats({
        totalUsers,
        totalReservations,
        totalPayments,
        monthlyPayments,
        monthlyReservations,
        monthlyUserCreations,
      });
    } catch (error) {
      console.error("Error al obtener las estadísticas:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Selector de año */}
      
      <Text style={styles.title}>Estadísticas</Text>

      {/* Estadísticas generales */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.statLabel}>Total Usuarios</Text>
          <Text style={styles.statValue}>{stats.totalUsers}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.statLabel}>Monto Total Pagos</Text>
          <Text style={styles.statValue}>${stats.totalPayments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.statLabel}>Monto Total Reservas</Text>
          <Text style={styles.statValue}>${stats.totalReservations}</Text>
        </TouchableOpacity>
      </View>

      {/* Gráfico de Pagos Mensuales */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Pagos Mensuales</Text>
        {/* Contenedor con scroll en ambas direcciones */}
        <View style={styles.doubleScroll}>
          <ScrollView horizontal>
            <ScrollView>
              <BarChart
                data={{
                  labels: months,
                  datasets: [{ data: stats.monthlyPayments }]
                }}
                width={screenWidth * 2}  // Ancho mayor para permitir scroll horizontal
                height={300}
                yAxisLabel="$"
                chartConfig={chartConfig}
                fromZero={true}
                verticalLabelRotation={20} // Rota las etiquetas para que se lean verticalmente
              />
            </ScrollView>
          </ScrollView>
        </View>
      </View>

      {/* Gráfico de Reservas Mensuales */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Reservas Mensuales</Text>
        <View style={styles.doubleScroll}>
          <ScrollView horizontal>
            <ScrollView>
              <BarChart
                data={{
                  labels: months,
                  datasets: [{ data: stats.monthlyReservations }]
                }}
                width={screenWidth * 2}
                height={300}
                yAxisLabel="$"
                chartConfig={chartConfig}
                fromZero={true}
                verticalLabelRotation={20}
              />
            </ScrollView>
          </ScrollView>
        </View>
      </View>

      {/* Nuevo gráfico: Creación de Usuarios Mensual */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Registros de usuarios mensuales</Text>
        <View style={styles.doubleScroll}>
          <ScrollView horizontal>
            <ScrollView>
              <BarChart
                data={{
                  labels: months,
                  datasets: [{ data: stats.monthlyUserCreations }]
                }}
                width={screenWidth * 2}
                height={300}
                // En este gráfico no se añade prefijo en el eje Y
                chartConfig={chartConfig}
                fromZero={true}
                verticalLabelRotation={20}
              />
            </ScrollView>
          </ScrollView>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 30, textAlign: 'center', marginTop: 50 },

  statButton: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  chartContainer: {
    marginBottom: 30,
    padding: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  picker: {
    width: 100,
    alignSelf: 'center',
  },
  // Contenedor que permite scroll tanto horizontal como vertical
  doubleScroll: {
    height: 300,
  },
});

const chartConfig = {
  backgroundColor: '#FFFFFF',
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 0, // Se muestran sin decimales en el eje Y
  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#4CAF50',
  },
  barPercentage: 0.5,
};

export default AnalysisScreen;
