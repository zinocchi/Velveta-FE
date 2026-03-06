import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

interface User {
  id: number;
  fullname: string;
  email: string;
  role?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Coba beberapa endpoint yang mungkin
      let response;
      try {
        // Coba endpoint /me dulu (yang ada di route Anda)
        response = await api.get('/me');
      } catch (err) {
        // Kalau gagal, coba /user
        response = await api.get('/user');
      }
      
      console.log('User data response:', response.data);
      
      // Sesuaikan dengan struktur response Anda
      const userData = response.data.user || response.data;
      setUser(userData);
      
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.response?.data?.message || 'Failed to fetch user');
      
      // Kalau 401 (unauthorized), user tidak login - itu normal
      if (err.response?.status === 401) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};  