// src/theme.js
import { createTheme } from '@mui/material/styles';

/**
 * Create theme based on mode (light/dark)
 * Modern Medical SaaS Theme: Teal, Slate, Soft Shadows, Rounded Corners
 */
export const getTheme = (mode, customPrimary) => {
  // Medical Teal Palette
  const primaryMain = customPrimary || '#008080'; // Teal
  const primaryLight = '#26a69a';
  const primaryDark = '#004d40';

  // Slate Neutrals
  const backgroundDefault = mode === 'dark' ? '#0f172a' : '#f8fafc'; // Slate 900 vs Slate 50
  const backgroundPaper = mode === 'dark' ? '#1e293b' : '#ffffff';   // Slate 800 vs White
  const textPrimary = mode === 'dark' ? '#f1f5f9' : '#334155';       // Slate 100 vs Slate 700
  const textSecondary = mode === 'dark' ? '#94a3b8' : '#64748b';     // Slate 400 vs Slate 500

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryMain,
        light: primaryLight,
        dark: primaryDark,
        contrastText: '#ffffff',
      },
      secondary: {
        main: mode === 'dark' ? '#94a3b8' : '#475569', // Slate
        light: '#cbd5e1',
        dark: '#1e293b',
        contrastText: '#ffffff',
      },
      success: {
        main: '#10b981', // Emerald
        light: '#34d399',
        dark: '#059669',
      },
      error: {
        main: '#ef4444', // Red
        light: '#f87171',
        dark: '#b91c1c',
      },
      warning: {
        main: '#f59e0b', // Amber
        light: '#fbbf24',
        dark: '#d97706',
      },
      info: {
        main: '#0ea5e9', // Sky
        light: '#38bdf8',
        dark: '#0284c7',
      },
      background: {
        default: backgroundDefault,
        paper: backgroundPaper,
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
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
      body1: { lineHeight: 1.6 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12, // Modern Rounded Look
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Soft shadow on hover
            },
          },
          containedPrimary: {
            backgroundColor: primaryMain, // Solid color
            color: '#ffffff',
            '&:hover': {
              backgroundColor: primaryDark, // Darker shade on hover
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: mode === 'dark'
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)', // Very soft shadow
            border: `1px solid ${mode === 'dark' ? '#334155' : '#e2e8f0'}`, // Subtle border
          },
          elevation1: {
            boxShadow: mode === 'dark' ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          },
          elevation3: {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          }
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            overflow: 'hidden',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            borderBottom: `1px solid ${mode === 'dark' ? '#334155' : '#e2e8f0'}`,
            background: backgroundPaper, // White/Dark bg instead of primary color
            color: textPrimary,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
            boxShadow: '4px 0 24px rgba(0,0,0,0.02)',
          },
        },
      },
    },
  });
};

// Default light theme for backward compatibility
const theme = getTheme('light');

export default theme;
