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
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                },
            }}
        >
            {/* Background decoration */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: color,
                    opacity: 0.1,
                }}
            />

            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
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
                        boxShadow: `0 4px 12px ${color}40`,
                    }}
                >
                    {icon}
                </Avatar>
            </Box>
        </Paper>
    );
};

export default AnimatedStatCard;
