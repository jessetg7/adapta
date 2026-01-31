// src/theme.js
import { createTheme } from '@mui/material/styles';

/**
 * Create theme based on mode (light/dark)
 * Optimized for medical applications with high contrast and readability
 */
export const getTheme = (mode, customPrimary) => createTheme({
  palette: {
    mode,
    primary: {
      main: customPrimary || (mode === 'dark' ? '#06b6d4' : '#0891b2'), // Cyan/Teal
      light: mode === 'dark' ? '#22d3ee' : '#06b6d4',
      dark: mode === 'dark' ? '#0891b2' : '#0e7490',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'dark' ? '#94a3b8' : '#64748b', // Slate
      light: mode === 'dark' ? '#cbd5e1' : '#94a3b8',
      dark: mode === 'dark' ? '#64748b' : '#475569',
      contrastText: '#ffffff',
    },
    success: {
      main: mode === 'dark' ? '#34d399' : '#10b981', // Emerald
      light: mode === 'dark' ? '#6ee7b7' : '#34d399',
      dark: mode === 'dark' ? '#10b981' : '#059669',
    },
    error: {
      main: mode === 'dark' ? '#f87171' : '#dc2626', // Red
      light: mode === 'dark' ? '#fca5a5' : '#ef4444',
      dark: mode === 'dark' ? '#dc2626' : '#b91c1c',
    },
    warning: {
      main: mode === 'dark' ? '#fbbf24' : '#f59e0b', // Amber
      light: mode === 'dark' ? '#fcd34d' : '#fbbf24',
      dark: mode === 'dark' ? '#f59e0b' : '#d97706',
    },
    info: {
      main: mode === 'dark' ? '#60a5fa' : '#3b82f6', // Blue
      light: mode === 'dark' ? '#93c5fd' : '#60a5fa',
      dark: mode === 'dark' ? '#3b82f6' : '#2563eb',
    },
    background: {
      default: mode === 'dark' ? '#0f172a' : '#f8fafc', // Slate backgrounds
      paper: mode === 'dark' ? '#1e293b' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#f1f5f9' : '#0f172a',
      secondary: mode === 'dark' ? '#cbd5e1' : '#64748b',
    },
    divider: mode === 'dark' ? '#334155' : '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: mode === 'dark' ? '#334155' : '#e2e8f0',
            },
          },
        },
      },
    },
  },
});

// Default light theme for backward compatibility
const theme = getTheme('light');

export default theme;