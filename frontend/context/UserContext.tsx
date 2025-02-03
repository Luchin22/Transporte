import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Text, View } from 'react-native';

// Define la estructura del usuario
interface UserData {
  usuario_id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  fetchUserData: (userId: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }) =>{
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (userId: number) => {
    
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.0.139:3000/api/usuarios/usuario/${userId}`);
      setUserData(response.data); 
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      setError('No se pudo cargar la información del usuario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = 16; // Reemplaza con un valor dinámico según tu caso
    fetchUserData(userId);
  }, []);

  // Este es el ejemplo correcto
  return (
    <UserContext.Provider value={{ userData, loading, fetchUserData }}>
      {/* ✅ Siempre retornar componentes, no strings */}
      {loading ? (
        <View >
          <Text>Cargando...</Text> {/* Texto correctamente envuelto */}
        </View>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
};
