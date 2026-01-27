// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Contexts & Theme
import theme from './theme';
import { AdaptaProvider } from './context/AdaptaContext';
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/Auth/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Pages
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Dashboard from './pages/Dashboard';
import FormBuilderPage from './pages/FormBuilderPage';
import PrescriptionBuilderPage from './pages/PrescriptionBuilderPage';
import PatientConsultation from './pages/PatientConsultation';
import TemplateManager from './pages/TemplateManager';
import RuleManager from './pages/RuleManager';
import WorkflowManager from './pages/WorkflowManager';

// 1. Create a Layout Wrapper to handle the Outlet
// This allows MainLayout to stay mounted while child routes change
const AppLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <AuthProvider>
            <AdaptaProvider>
              <Routes>
                {/* --- Public Routes --- */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* --- Protected Routes (Layout Persists) --- */}
                {/* 
                   We wrap the AppLayout in a ProtectedRoute. 
                   This ensures the entire layout is only visible if logged in.
                */}
                <Route 
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/" element={<Dashboard />} />

                  <Route
                    path="/consultation"
                    element={
                      <ProtectedRoute requiredPermission="consultation.view">
                        <PatientConsultation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultation/:patientId"
                    element={
                      <ProtectedRoute requiredPermission="consultation.view">
                        <PatientConsultation />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/form-builder"
                    element={
                      <ProtectedRoute requiredPermission="forms.create">
                        <FormBuilderPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/form-builder/:templateId"
                    element={
                      <ProtectedRoute requiredPermission="forms.create">
                        <FormBuilderPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/prescription-builder"
                    element={
                      <ProtectedRoute requiredPermission="prescriptions.create">
                        <PrescriptionBuilderPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/prescription-builder/:templateId"
                    element={
                      <ProtectedRoute requiredPermission="prescriptions.create">
                        <PrescriptionBuilderPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/templates"
                    element={
                      <ProtectedRoute requiredPermission="templates.view">
                        <TemplateManager />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/rules"
                    element={
                      <ProtectedRoute requiredPermission="rules.manage">
                        <RuleManager />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/workflows"
                    element={
                      <ProtectedRoute requiredPermission="workflows.manage">
                        <WorkflowManager />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* --- Fallback --- */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AdaptaProvider>
          </AuthProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;