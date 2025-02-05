import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { View, Text } from 'react-native';

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

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async (userId: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://transporte-production.up.railway.app/api/usuarios/usuario/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ userData, loading, fetchUserData }}>
      {children}
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
