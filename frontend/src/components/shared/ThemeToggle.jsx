// src/components/shared/ThemeToggle.jsx
import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../../context/ThemeContext';

const ThemeToggle = ({ size = 'medium', showLabel = false }) => {
    const { mode, toggleTheme, isDark } = useThemeMode();

    return (
        <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`} arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                    onClick={toggleTheme}
                    color="inherit"
                    size={size}
                    sx={{
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'rotate(180deg)',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        },
                    }}
                    aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                >
                    {isDark ? (
                        <Brightness7Icon
                            sx={{
                                color: '#ffd54f',
                                filter: 'drop-shadow(0 0 8px rgba(255, 213, 79, 0.5))',
                            }}
                        />
                    ) : (
                        <Brightness4Icon
                            sx={{
                                color: '#1976d2',
                            }}
                        />
                    )}
                </IconButton>
                {showLabel && (
                    <Box
                        component="span"
                        sx={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            display: { xs: 'none', sm: 'inline' },
                        }}
                    >
                        {isDark ? 'Dark' : 'Light'}
                    </Box>
                )}
            </Box>
        </Tooltip>
    );
};

export default ThemeToggle;
