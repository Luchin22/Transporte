import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StripeProvider } from '@stripe/stripe-react-native';

import { UserProvider } from './context/UserContext'; // Importa el contexto de usuario

// Importa tus pantallas
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
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
import BuseScreen from './screens/BuseScreen';
import HoraScreen from './screens/HoraScreen';
import GuiaScreen from './screens/GuiaScreen';
import FlotaScreen from './screens/FlotaScreen';
import InterScreen from './screens/InterScreen';
import OlvidarScreen from './screens/OlvidarScreen';

// Define los tipos de las pantallas
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
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
  Buse: undefined;
  Hora: undefined;
  Guia: undefined;
  Flota: undefined;
  Inter: undefined;
  Olvidar: undefined;
};

// Crear el Stack Navigator y agregar el tipo
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [publishableKey, setPublishableKey] = useState('');

  const fetchPublishableKey = async () => {
    try {
      const response = await fetch('https://transporte-production.up.railway.app/api/pagos/get-public-key');
      const data = await response.json();
      setPublishableKey(data.publicKey); // Usamos la clave pública que nos dio el backend
    } catch (error) {
      console.error('Error al obtener la clave pública:', error);
    }
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);
  return (
    <StripeProvider publishableKey={publishableKey}>
    <UserProvider> {/* Envuelve todo con el contexto */}
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
          <Stack.Screen name="Buse" component={BuseScreen} />
          <Stack.Screen name="Hora" component={HoraScreen} />
          <Stack.Screen name="Guia" component={GuiaScreen} />
          <Stack.Screen name="Flota" component={FlotaScreen} /> 
          <Stack.Screen name="Inter" component={InterScreen} />
          <Stack.Screen name="Olvidar" component={OlvidarScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
    </StripeProvider>
  );
}
