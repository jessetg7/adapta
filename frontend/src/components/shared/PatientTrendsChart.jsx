// src/components/shared/PatientTrendsChart.jsx
import React from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const PatientTrendsChart = ({ data, type = 'line' }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Sample data if none provided
    const sampleData = [
        { month: 'Jan', patients: 45, consultations: 52, prescriptions: 48 },
        { month: 'Feb', patients: 52, consultations: 61, prescriptions: 55 },
        { month: 'Mar', patients: 48, consultations: 58, prescriptions: 52 },
        { month: 'Apr', patients: 61, consultations: 72, prescriptions: 65 },
        { month: 'May', patients: 55, consultations: 68, prescriptions: 61 },
        { month: 'Jun', patients: 67, consultations: 81, prescriptions: 74 },
    ];

    const chartData = data || sampleData;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Paper
                    sx={{
                        p: 1.5,
                        border: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                        {label}
                    </Typography>
                    {payload.map((entry, index) => (
                        <Typography
                            key={index}
                            variant="caption"
                            sx={{ display: 'block', color: entry.color }}
                        >
                            {entry.name}: {entry.value}
                        </Typography>
                    ))}
                </Paper>
            );
        }
        return null;
    };

    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                Patient Trends
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Monthly overview of practice activity
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
                {type === 'area' ? (
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorConsultations" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={isDark ? '#1e3a5f' : '#e0e0e0'}
                        />
                        <XAxis
                            dataKey="month"
                            stroke={theme.palette.text.secondary}
                            style={{ fontSize: '0.75rem' }}
                        />
                        <YAxis
                            stroke={theme.palette.text.secondary}
                            style={{ fontSize: '0.75rem' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="patients"
                            stroke={theme.palette.primary.main}
                            fillOpacity={1}
                            fill="url(#colorPatients)"
                            name="New Patients"
                        />
                        <Area
                            type="monotone"
                            dataKey="consultations"
                            stroke={theme.palette.success.main}
                            fillOpacity={1}
                            fill="url(#colorConsultations)"
                            name="Consultations"
                        />
                    </AreaChart>
                ) : (
                    <LineChart data={chartData}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={isDark ? '#1e3a5f' : '#e0e0e0'}
                        />
                        <XAxis
                            dataKey="month"
                            stroke={theme.palette.text.secondary}
                            style={{ fontSize: '0.75rem' }}
                        />
                        <YAxis
                            stroke={theme.palette.text.secondary}
                            style={{ fontSize: '0.75rem' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="patients"
                            stroke={theme.palette.primary.main}
                            strokeWidth={2}
                            dot={{ fill: theme.palette.primary.main, r: 4 }}
                            activeDot={{ r: 6 }}
                            name="New Patients"
                        />
                        <Line
                            type="monotone"
                            dataKey="consultations"
                            stroke={theme.palette.success.main}
                            strokeWidth={2}
                            dot={{ fill: theme.palette.success.main, r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Consultations"
                        />
                        <Line
                            type="monotone"
                            dataKey="prescriptions"
                            stroke={theme.palette.secondary.main}
                            strokeWidth={2}
                            dot={{ fill: theme.palette.secondary.main, r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Prescriptions"
                        />
                    </LineChart>
                )}
            </ResponsiveContainer>
        </Paper>
    );
};

export default PatientTrendsChart;
