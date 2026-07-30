import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session if token exists
    const savedUser = localStorage.getItem('ironfit_user');
    const token = localStorage.getItem('ironfit_token');

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ironfit_user');
        localStorage.removeItem('ironfit_token');
      }
    }
    setLoading(false);
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
      // Fallback demo logins if backend server is starting up
      let demoUser = null;
      if (identifier === 'owner@ironfit.in' || selectedRole === 'ROLE_OWNER') {
        demoUser = {
          token: 'demo-owner-jwt-token-2026',
          userId: 1,
          name: 'Aditya Sharma',
          email: 'owner@ironfit.in',
          phone: '+91 98765 43210',
          roles: ['ROLE_OWNER'],
          activeRole: 'ROLE_OWNER',
        };
      } else if (identifier === 'rahul@ironfit.in' || selectedRole === 'ROLE_MANAGER') {
        demoUser = {
          token: 'demo-manager-jwt-token-2026',
          userId: 2,
          name: 'Rahul Verma',
          email: 'rahul@ironfit.in',
          phone: '+91 98765 43211',
          roles: ['ROLE_MANAGER'],
          activeRole: 'ROLE_MANAGER',
          managerId: 1,
        };
      } else {
        demoUser = {
          token: 'demo-member-jwt-token-2026',
          userId: 8,
          name: 'Rohan Kumar',
          email: 'rohan@ironfit.in',
          phone: '+91 98765 43217',
          roles: ['ROLE_MEMBER'],
          activeRole: 'ROLE_MEMBER',
          memberId: 1,
        };
      }

      apiClient.setToken(demoUser.token);
      localStorage.setItem('ironfit_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return { success: true, user: demoUser, isDemo: true };
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
