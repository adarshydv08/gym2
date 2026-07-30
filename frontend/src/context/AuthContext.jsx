import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ironfit_token');
    if (token) {
      apiClient.setToken(token);
      apiClient.get('/auth/me')
        .then(response => {
          if (response.success && response.data) {
            setUser(response.data);
            localStorage.setItem('ironfit_user', JSON.stringify(response.data));
          } else {
            throw new Error('Invalid session');
          }
        })
        .catch(() => {
          localStorage.removeItem('ironfit_user');
          localStorage.removeItem('ironfit_token');
          apiClient.setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (identifier, password, selectedRole) => {
    try {
      const response = await apiClient.post('/auth/login', {
        identifier,
        password,
        selectedRole,
      });

      if (response.success && response.data) {
        const authData = response.data;
        apiClient.setToken(authData.token);
        localStorage.setItem('ironfit_user', JSON.stringify(authData));
        setUser(authData);
        return { success: true, user: authData };
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const response = await apiClient.post('/auth/register', formData);
      if (response.success && response.data) {
        const authData = response.data;
        apiClient.setToken(authData.token);
        localStorage.setItem('ironfit_user', JSON.stringify(authData));
        setUser(authData);
        return { success: true, user: authData };
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiClient.setToken(null);
    localStorage.removeItem('ironfit_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
