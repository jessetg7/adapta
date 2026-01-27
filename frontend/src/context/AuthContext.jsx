// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { permissionConfig } from '../config/permissionConfig';
const AuthContext = createContext(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('adapta-user');
    const storedToken = localStorage.getItem('adapta-token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    try {
      // TODO: Replace with actual API call
      const response = await mockLogin(email, password);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('adapta-user', JSON.stringify(response.user));
        localStorage.setItem('adapta-token', response.token);
        navigate('/');
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('adapta-user');
    localStorage.removeItem('adapta-token');
    navigate('/login');
  };
  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    
    const rolePermissions = permissionConfig.roles[user.role];
    if (!rolePermissions) return false;
    return rolePermissions.permissions.includes(permission);
  };
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };
  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };
  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAuthenticated: !!user,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// Mock login function (replace with actual API call)
const mockLogin = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Mock users database
  const users = {
    'admin@adapta.com': {
      id: '1',
      name: 'Admin User',
      email: 'admin@adapta.com',
      role: 'admin',
      password: 'admin123',
    },
    'doctor@adapta.com': {
      id: '2',
      name: 'Dr. John Smith',
      email: 'doctor@adapta.com',
      role: 'doctor',
      password: 'doctor123',
    },
    'nurse@adapta.com': {
      id: '3',
      name: 'Nurse Mary',
      email: 'nurse@adapta.com',
      role: 'nurse',
      password: 'nurse123',
    },
    'receptionist@adapta.com': {
      id: '4',
      name: 'Receptionist Jane',
      email: 'receptionist@adapta.com',
      role: 'receptionist',
      password: 'receptionist123',
    },
  };
  const user = users[email];
  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user;
    return {
      success: true,
      user: userWithoutPassword,
      token: 'mock-jwt-token-' + Date.now(),
    };
  }
  return {
    success: false,
    error: 'Invalid email or password',
  };
};