import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { FormProvider } from './context/FormContext';
import { AuditProvider } from './context/AuditContext';
import { WorkflowProvider } from './context/WorkflowContext';
import { EmergencyProvider } from './context/EmergencyContext';
import { MedicationProvider } from './context/MedicationContext';  // ADD THIS

// Layout
import AppShell from './components/layout/AppShell';

// Screens
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import TemplatesScreen from './screens/TemplatesScreen';
import FormBuilderScreen from './screens/FormBuilderScreen';
import FormFillScreen from './screens/FormFillScreen';
import FormPreviewScreen from './screens/FormPreviewScreen';
import WorkflowsScreen from './screens/WorkflowsScreen';
import RulesScreen from './screens/RulesScreen';
import AuditScreen from './screens/AuditScreen';
import AdminScreen from './screens/AdminScreen';

// Theme
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
    secondary: { main: '#9c27b0' },
    error: { main: '#d32f2f', light: '#ef5350' },
    warning: { main: '#ff9800' },
    success: { main: '#4caf50' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } },
    },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <AuthProvider>
            <AuditProvider>
              <FormProvider>
                <WorkflowProvider>
                  <EmergencyProvider>
                    <MedicationProvider>  {/* ADD THIS */}
                      <Routes>
                        <Route path="/login" element={<LoginScreen />} />
                        <Route
                          path="/"
                          element={
                            <ProtectedRoute>
                              <AppShell />
                            </ProtectedRoute>
                          }
                        >
                          <Route index element={<Navigate to="/dashboard" replace />} />
                          <Route path="dashboard" element={<DashboardScreen />} />
                          <Route path="templates" element={<TemplatesScreen />} />
                          <Route path="form-builder" element={<FormBuilderScreen />} />
                          <Route path="form-builder/:templateId" element={<FormBuilderScreen />} />
                          <Route path="forms/fill/:templateId" element={<FormFillScreen />} />
                          <Route path="forms/preview/:templateId" element={<FormPreviewScreen />} />
                          <Route path="workflows" element={<WorkflowsScreen />} />
                          <Route path="rules" element={<RulesScreen />} />
                          <Route path="audit" element={<AuditScreen />} />
                          <Route path="admin" element={<AdminScreen />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </MedicationProvider>  {/* ADD THIS */}
                  </EmergencyProvider>
                </WorkflowProvider>
              </FormProvider>
            </AuditProvider>
          </AuthProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;