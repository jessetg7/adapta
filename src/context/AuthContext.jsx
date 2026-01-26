import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  { id: '1', username: 'admin', password: 'admin123', name: 'Dr. Admin', role: 'Admin', email: 'admin@hospital.com' },
  { id: '2', username: 'doctor', password: 'doctor123', name: 'Dr. Sarah Wilson', role: 'Doctor', email: 'doctor@hospital.com' },
  { id: '3', username: 'nurse', password: 'nurse123', name: 'Nurse Emily', role: 'Nurse', email: 'nurse@hospital.com' },
  { id: '4', username: 'staff', password: 'staff123', name: 'John Staff', role: 'Staff', email: 'staff@hospital.com' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('adapta_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('adapta_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    const found = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (!found) {
      throw new Error('Invalid credentials');
    }
    const userData = { ...found };
    delete userData.password;
    localStorage.setItem('adapta_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('adapta_user');
    setUser(null);
  };

  const hasRole = (role) => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    return user.role === role;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      hasRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;