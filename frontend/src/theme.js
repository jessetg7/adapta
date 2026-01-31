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
      main: customPrimary || (mode === 'dark' ? '#42a5f5' : '#1976d2'),
      light: mode === 'dark' ? '#64b5f6' : '#42a5f5',
      dark: mode === 'dark' ? '#1976d2' : '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'dark' ? '#ba68c8' : '#9c27b0',
      light: mode === 'dark' ? '#ce93d8' : '#ba68c8',
      dark: mode === 'dark' ? '#9c27b0' : '#7b1fa2',
      contrastText: '#ffffff',
    },
    success: {
      main: mode === 'dark' ? '#66bb6a' : '#2e7d32',
      light: mode === 'dark' ? '#81c784' : '#4caf50',
      dark: mode === 'dark' ? '#388e3c' : '#1b5e20',
    },
    error: {
      main: mode === 'dark' ? '#f44336' : '#d32f2f',
      light: mode === 'dark' ? '#e57373' : '#ef5350',
      dark: mode === 'dark' ? '#c62828' : '#b71c1c',
    },
    warning: {
      main: mode === 'dark' ? '#ffa726' : '#ed6c02',
      light: mode === 'dark' ? '#ffb74d' : '#ff9800',
      dark: mode === 'dark' ? '#f57c00' : '#e65100',
    },
    info: {
      main: mode === 'dark' ? '#29b6f6' : '#0288d1',
      light: mode === 'dark' ? '#4fc3f7' : '#03a9f4',
      dark: mode === 'dark' ? '#0277bd' : '#01579b',
    },
    background: {
      default: mode === 'dark' ? '#0a1929' : '#f5f5f5',
      paper: mode === 'dark' ? '#132f4c' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#e3f2fd' : '#1a1a1a',
      secondary: mode === 'dark' ? '#b0bec5' : '#666666',
    },
    divider: mode === 'dark' ? '#1e3a5f' : '#e0e0e0',
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
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
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
              borderColor: mode === 'dark' ? '#1e3a5f' : '#e0e0e0',
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