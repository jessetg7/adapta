// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getTheme } from '../theme';
import { useAdapta } from './AdaptaContext';

const ThemeContext = createContext();

export const useThemeMode = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Initialize theme from localStorage or system preference
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('adaptaforms-theme-mode');
        if (savedMode) {
            return savedMode;
        }
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    // Save theme preference to localStorage
    useEffect(() => {
        localStorage.setItem('adaptaforms-theme-mode', mode);
    }, [mode]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            // Only auto-switch if user hasn't manually set a preference
            const savedMode = localStorage.getItem('adaptaforms-theme-mode');
            if (!savedMode) {
                setMode(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const { clinicInfo } = useAdapta();

    const theme = useMemo(() => getTheme(mode, clinicInfo?.primaryColor), [mode, clinicInfo?.primaryColor]);

    const value = useMemo(
        () => ({
            mode,
            toggleTheme,
            isDark: mode === 'dark',
        }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={value}>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
