// src/components/shared/AnimatedStatCard.jsx
import React from 'react';
import { Paper, Typography, Avatar, Box } from '@mui/material';
import CountUp from 'react-countup';

const AnimatedStatCard = ({ label, value, icon, color, trend, trendValue }) => {
    return (
        <Paper
            sx={{
                p: 3,
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                // Glassmorphism effect
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(10, 10, 10, 0.6)'
                    : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: (theme) => theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                transition: 'all 0.3s ease-in-out',
                // Glowing shadow effect with color
                boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? `0 8px 24px 0 rgba(0, 0, 0, 0.5), 0 0 20px ${color}20`
                    : `0 8px 24px rgba(31, 38, 135, 0.2), 0 0 20px ${color}15`,
                '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? `0 12px 40px 0 rgba(0, 0, 0, 0.6), 0 0 40px ${color}40`
                        : `0 12px 40px rgba(31, 38, 135, 0.3), 0 0 40px ${color}30`,
                    borderColor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(255, 255, 255, 0.3)',
                },
            }}
        >
            {/* Enhanced background decoration with gradient */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${color}30 0%, ${color}10 50%, transparent 100%)`,
                    filter: 'blur(20px)',
                    animation: 'pulse 3s ease-in-out infinite',
                    '@keyframes pulse': {
                        '0%, 100%': {
                            opacity: 0.5,
                            transform: 'scale(1)',
                        },
                        '50%': {
                            opacity: 0.8,
                            transform: 'scale(1.1)',
                        },
                    },
                }}
            />

            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                        {label}
                    </Typography>
                    <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                        <CountUp
                            end={value}
                            duration={2}
                            separator=","
                            useEasing={true}
                            easingFn={(t, b, c, d) => {
                                // easeOutExpo
                                return c * (-Math.pow(2, -10 * t / d) + 1) + b;
                            }}
                        />
                    </Typography>
                    {trend && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: trend === 'up' ? 'success.main' : 'error.main',
                                    fontWeight: 600,
                                }}
                            >
                                {trend === 'up' ? '↑' : '↓'} {trendValue}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                vs last month
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Avatar
                    sx={{
                        bgcolor: color,
                        width: 56,
                        height: 56,
                        // Enhanced glowing shadow
                        boxShadow: `0 4px 20px ${color}60, 0 0 30px ${color}40`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: `0 6px 30px ${color}80, 0 0 50px ${color}60`,
                            transform: 'rotate(5deg) scale(1.05)',
                        },
                    }}
                >
                    {icon}
                </Avatar>
            </Box>
        </Paper>
    );
};

export default AnimatedStatCard;

