import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // Contenedor de navegación
import { createStackNavigator, } from '@react-navigation/stack'; // Creador de stack de navegación
import LoginScreen from './screens/LoginScreen'; // Pantalla de login
import RegisterScreen from './screens/RegisterScreen'; // Pantalla de registro
import RutaScreen from './screens/RutaScreen';
import HorarioScreen from './screens/HorarioScreen';
import PerfilScreen from './screens/PerfilScreen';
import HistorialScreen from './screens/HistorialScreen';
import EditarScreen from './screens/EditarScreen';
import PaymentScreen from './screens/PaymentScreen';
import TicketScreen from './screens/TicketScreen';
import PagoScreen from './screens/PagoScreen';
import HomeScreen from './screens/HomeScreen';
import CrearScreen from './screens/CrearScreen';
import DatoScreen from './screens/DatoScreen';
import PantallaScreen from './screens/PantallaScreen';
import BuseScreen from './screens/BuseScreen';
import HoraScreen from './screens/HoraScreen';
import GuiaScreen from './screens/GuiaScreen';


// Define los tipos de las pantallas
type RootStackParamList = {
  Login: undefined; // Si la pantalla no recibe parámetros, es undefined
  Register: undefined; // Lo mismo para Register
  Ruta: undefined;
  Horario: undefined;
  Perfil: undefined;
  Historial: undefined;
  Editar: undefined;
  Payment: undefined;
  Ticket: undefined;
  Pago: undefined;
  Home: undefined;
  Crear: undefined;
  Dato: undefined;
  Pantalla: undefined;
  Buse: undefined;
  Hora: undefined;
  Guia: undefined;
};

// Crear el Stack Navigator y agregar el tipo
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Ruta" component={RutaScreen} />
        <Stack.Screen name="Horario" component={HorarioScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="Historial" component={HistorialScreen} />
        <Stack.Screen name="Editar" component={EditarScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Ticket" component={TicketScreen} />
        <Stack.Screen name="Pago" component={PagoScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Crear" component={CrearScreen} />
        <Stack.Screen name="Dato" component={DatoScreen} />
        <Stack.Screen name="Pantalla" component={PantallaScreen} /> 
        <Stack.Screen name="Buse" component={BuseScreen} />
        <Stack.Screen name="Hora" component={HoraScreen} />
        <Stack.Screen name="Guia" component={GuiaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
