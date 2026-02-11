// src/theme.js
import { createTheme } from '@mui/material/styles';

/**
 * Create theme based on mode (light/dark)
 * TRUE Dark Mode with pure blacks and vibrant accents
 */
export const getTheme = (mode, customPrimary) => createTheme({
  palette: {
    mode,
    primary: {
      main: customPrimary || (mode === 'dark' ? '#3b82f6' : '#1976d2'),
      light: mode === 'dark' ? '#60a5fa' : '#42a5f5',
      dark: mode === 'dark' ? '#2563eb' : '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'dark' ? '#a78bfa' : '#9c27b0',
      light: mode === 'dark' ? '#c4b5fd' : '#ba68c8',
      dark: mode === 'dark' ? '#8b5cf6' : '#7b1fa2',
      contrastText: '#ffffff',
    },
    success: {
      main: mode === 'dark' ? '#22c55e' : '#2e7d32',
      light: mode === 'dark' ? '#4ade80' : '#4caf50',
      dark: mode === 'dark' ? '#16a34a' : '#1b5e20',
    },
    error: {
      main: mode === 'dark' ? '#ef4444' : '#d32f2f',
      light: mode === 'dark' ? '#f87171' : '#ef5350',
      dark: mode === 'dark' ? '#dc2626' : '#b71c1c',
    },
    warning: {
      main: mode === 'dark' ? '#f59e0b' : '#ed6c02',
      light: mode === 'dark' ? '#fbbf24' : '#ff9800',
      dark: mode === 'dark' ? '#d97706' : '#e65100',
    },
    info: {
      main: mode === 'dark' ? '#06b6d4' : '#0288d1',
      light: mode === 'dark' ? '#22d3ee' : '#03a9f4',
      dark: mode === 'dark' ? '#0891b2' : '#01579b',
    },
    background: {
      default: mode === 'dark' ? '#000000' : '#f5f7fa',
      paper: mode === 'dark' ? '#0a0a0a' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#1a202c',
      secondary: mode === 'dark' ? '#a1a1aa' : '#64748b',
      disabled: mode === 'dark' ? '#52525b' : '#cbd5e1',
    },
    divider: mode === 'dark' ? '#27272a' : '#e2e8f0',
    // Custom utility colors for true dark mode
    grey: mode === 'dark' ? {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#0a0a0a',
    } : {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    // Action colors for better contrast in both modes
    action: mode === 'dark' ? {
      active: '#ffffff',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
      focus: 'rgba(255, 255, 255, 0.12)',
    } : {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
      focus: 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: mode === 'dark' ? '#ffffff' : undefined,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: mode === 'dark' ? '#ffffff' : undefined,
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: mode === 'dark' ? '#ffffff' : undefined,
    },
    h4: {
      fontWeight: 600,
      color: mode === 'dark' ? '#ffffff' : undefined,
    },
    h5: {
      fontWeight: 600,
      color: mode === 'dark' ? '#ffffff' : undefined,
    },
    h6: {
      fontWeight: 600,
      color: mode === 'dark' ? '#ffffff' : undefined,
    },
    button: { fontWeight: 500, letterSpacing: '0.02em' },
    body1: { letterSpacing: '0.00938em' },
    body2: { letterSpacing: '0.01071em' },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: mode === 'dark' ? [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.8)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.9), 0 1px 2px 0 rgba(0, 0, 0, 0.8)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.9), 0 2px 4px -1px rgba(0, 0, 0, 0.8)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.9), 0 4px 6px -2px rgba(0, 0, 0, 0.8)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.9), 0 10px 10px -5px rgba(0, 0, 0, 0.6)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
    '0 25px 50px -12px rgba(0, 0, 0, 1)',
  ] : [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: mode === 'dark' ? {
        body: {
          backgroundColor: '#000000',
          scrollbarColor: '#3f3f46 #0a0a0a',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 12,
            height: 12,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#3f3f46',
            border: '3px solid #0a0a0a',
            '&:hover': {
              backgroundColor: '#52525b',
            },
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: '#0a0a0a',
          },
        },
      } : undefined,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 10,
          padding: '10px 20px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          boxShadow: mode === 'dark'
            ? '0 0 20px rgba(59, 130, 246, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.8)'
            : '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: mode === 'dark'
              ? '0 0 30px rgba(59, 130, 246, 0.5), 0 10px 15px -3px rgba(0, 0, 0, 0.9)'
              : '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderWidth: mode === 'dark' ? 2 : 1,
          borderColor: mode === 'dark' ? '#27272a' : undefined,
          '&:hover': {
            borderWidth: mode === 'dark' ? 2 : 1,
            backgroundColor: mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : undefined,
            borderColor: mode === 'dark' ? '#3b82f6' : undefined,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : undefined,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark' ? '#0a0a0a' : undefined,
          transition: 'box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          border: mode === 'dark' ? '1px solid #18181b' : undefined,
        },
        elevation1: {
          boxShadow: mode === 'dark'
            ? '0 0 0 1px #18181b, 0 1px 3px 0 rgba(0, 0, 0, 0.8)'
            : '0 1px 3px rgba(0,0,0,0.12)',
        },
        elevation2: {
          boxShadow: mode === 'dark'
            ? '0 0 0 1px #27272a, 0 4px 6px -1px rgba(0, 0, 0, 0.9)'
            : '0 3px 6px rgba(0,0,0,0.16)',
        },
        elevation3: {
          boxShadow: mode === 'dark'
            ? '0 0 0 1px #3f3f46, 0 10px 15px -3px rgba(0, 0, 0, 0.9)'
            : '0 10px 20px rgba(0,0,0,0.19)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark' ? '#0a0a0a' : undefined,
          border: mode === 'dark' ? '1px solid #18181b' : undefined,
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: mode === 'dark' ? '#27272a' : undefined,
            boxShadow: mode === 'dark'
              ? '0 0 0 1px #3f3f46, 0 20px 25px -5px rgba(0, 0, 0, 0.9)'
              : undefined,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark' ? '#0a0a0a' : undefined,
          borderBottom: mode === 'dark' ? '1px solid #18181b' : undefined,
          boxShadow: mode === 'dark' ? 'none' : undefined,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark' ? '#0a0a0a' : undefined,
          borderRight: mode === 'dark' ? '1px solid #18181b' : undefined,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: mode === 'dark' ? '#000000' : undefined,
            '& fieldset': {
              borderColor: mode === 'dark' ? '#27272a' : '#e0e0e0',
              borderWidth: mode === 'dark' ? 2 : 1,
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? '#3f3f46' : '#bdbdbd',
            },
            '&.Mui-focused fieldset': {
              borderWidth: 2,
              borderColor: mode === 'dark' ? '#3b82f6' : undefined,
            },
            '&.Mui-focused': {
              boxShadow: mode === 'dark' ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : undefined,
            },
          },
          '& .MuiInputBase-input': {
            color: mode === 'dark' ? '#ffffff' : undefined,
            '&::placeholder': {
              color: mode === 'dark' ? '#71717a' : undefined,
              opacity: 1,
            },
          },
          '& .MuiInputLabel-root': {
            color: mode === 'dark' ? '#a1a1aa' : undefined,
            '&.Mui-focused': {
              color: mode === 'dark' ? '#3b82f6' : undefined,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            boxShadow: mode === 'dark' ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : undefined,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          border: mode === 'dark' ? '1px solid #27272a' : undefined,
        },
        filled: {
          backgroundColor: mode === 'dark' ? '#18181b' : undefined,
          color: mode === 'dark' ? '#ffffff' : undefined,
          '&:hover': {
            backgroundColor: mode === 'dark' ? '#27272a' : undefined,
          },
        },
        outlined: {
          borderColor: mode === 'dark' ? '#27272a' : undefined,
          color: mode === 'dark' ? '#ffffff' : undefined,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: mode === 'dark' ? '1px solid #18181b' : undefined,
          color: mode === 'dark' ? '#ffffff' : undefined,
        },
        head: {
          fontWeight: 600,
          backgroundColor: mode === 'dark' ? '#000000' : undefined,
          color: mode === 'dark' ? '#ffffff' : undefined,
          borderBottom: mode === 'dark' ? '2px solid #27272a' : undefined,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: mode === 'dark' ? '1px solid' : undefined,
        },
        standardSuccess: {
          backgroundColor: mode === 'dark' ? 'rgba(34, 197, 94, 0.1)' : undefined,
          color: mode === 'dark' ? '#4ade80' : undefined,
          borderColor: mode === 'dark' ? 'rgba(34, 197, 94, 0.3)' : undefined,
        },
        standardError: {
          backgroundColor: mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : undefined,
          color: mode === 'dark' ? '#f87171' : undefined,
          borderColor: mode === 'dark' ? 'rgba(239, 68, 68, 0.3)' : undefined,
        },
        standardWarning: {
          backgroundColor: mode === 'dark' ? 'rgba(245, 158, 11, 0.1)' : undefined,
          color: mode === 'dark' ? '#fbbf24' : undefined,
          borderColor: mode === 'dark' ? 'rgba(245, 158, 11, 0.3)' : undefined,
        },
        standardInfo: {
          backgroundColor: mode === 'dark' ? 'rgba(6, 182, 212, 0.1)' : undefined,
          color: mode === 'dark' ? '#22d3ee' : undefined,
          borderColor: mode === 'dark' ? 'rgba(6, 182, 212, 0.3)' : undefined,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: mode === 'dark' ? '#18181b' : undefined,
          color: mode === 'dark' ? '#ffffff' : undefined,
          border: mode === 'dark' ? '1px solid #27272a' : undefined,
          borderRadius: 8,
          fontSize: '0.875rem',
          padding: '8px 12px',
          boxShadow: mode === 'dark'
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.9), 0 4px 6px -2px rgba(0, 0, 0, 0.8)'
            : undefined,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : undefined,
          },
          '&.Mui-selected': {
            backgroundColor: mode === 'dark' ? 'rgba(59, 130, 246, 0.15)' : undefined,
            borderLeft: mode === 'dark' ? '3px solid #3b82f6' : undefined,
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : undefined,
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: mode === 'dark' ? '#18181b' : undefined,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-track': {
            backgroundColor: mode === 'dark' ? '#3f3f46' : undefined,
          },
        },
      },
    },
  },
});

// Default light theme for backward compatibility
const theme = getTheme('light');

export default theme;
