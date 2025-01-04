import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const AnalysisScreen = () => {
  const [stats] = useState({
    totalBuses: 20,
    totalUsers: 150,
    totalReservations: 1200,
  });

  const barChartData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [
      {
        data: [500, 700, 800, 600, 900], // Datos ficticios
      },
    ],
  };

  const pieChartData = [
    {
      name: 'Reservas Confirmadas',
      population: 80,
      color: '#4CAF50',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Reservas Pendientes',
      population: 15,
      color: '#FFC107',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Reservas Canceladas',
      population: 5,
      color: '#F44336',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Botones de Estadísticas */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.statLabel}>Total Buses</Text>
          <Text style={styles.statValue}>{stats.totalBuses}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.statLabel}>Total Usuarios</Text>
          <Text style={styles.statValue}>{stats.totalUsers}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.statLabel}>Monto Total</Text>
          <Text style={styles.statValue}>${stats.totalReservations}</Text>
        </TouchableOpacity>
      </View>

      {/* Gráfico de Barras */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Ingresos Mensuales</Text>
        <BarChart
          data={barChartData}
          width={Dimensions.get('window').width - 40} // Ancho del gráfico
          height={220}
          yAxisLabel="$"
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0,
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
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      {/* Gráfico Circular */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Distribución de Reservas</Text>
        <PieChart
          data={pieChartData}
          width={Dimensions.get('window').width - 40} // Ancho del gráfico
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statButton: {
    flex: 1,
    marginHorizontal: 5,
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
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default AnalysisScreen;
