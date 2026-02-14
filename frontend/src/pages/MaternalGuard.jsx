// src/pages/MaternalGuard.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Alert,
    AlertTitle,
    IconButton,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BluetoothIcon from '@mui/icons-material/Bluetooth';

const MaternalGuard = () => {
    const [vitals, setVitals] = useState({
        heartRate: 78,
        bloodPressure: { systolic: 118, diastolic: 76 },
        temperature: 98.4,
        oxygenSaturation: 98,
        fetalHeartRate: 142,
        contractionFrequency: 0,
        lastUpdated: new Date(),
    });

    const [deviceStatus, setDeviceStatus] = useState({
        connected: true,
        battery: 87,
        signalStrength: 'Strong',
    });

    const [riskAlerts, setRiskAlerts] = useState([
        {
            id: 1,
            severity: 'success',
            title: 'Normal Vitals',
            message: 'All maternal and fetal vitals are within normal range.',
            timestamp: new Date(Date.now() - 5 * 60000),
            mlConfidence: 0.94,
        },
    ]);

    // Simulate real-time data updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate vital sign variations
            setVitals(prev => ({
                ...prev,
                heartRate: 75 + Math.floor(Math.random() * 10),
                bloodPressure: {
                    systolic: 115 + Math.floor(Math.random() * 8),
                    diastolic: 73 + Math.floor(Math.random() * 8),
                },
                temperature: 98.2 + Math.random() * 0.6,
                oxygenSaturation: 97 + Math.floor(Math.random() * 3),
                fetalHeartRate: 138 + Math.floor(Math.random() * 10),
                lastUpdated: new Date(),
            }));

            // Simulate ML risk assessment (5% chance of alert)
            if (Math.random() < 0.05) {
                const alerts = [
                    {
                        severity: 'warning',
                        title: 'Elevated Heart Rate',
                        message: 'Maternal heart rate slightly elevated. Monitor for sustained increase.',
                        mlConfidence: 0.78,
                    },
                    {
                        severity: 'info',
                        title: 'Activity Detected',
                        message: 'Increased movement detected. Vitals may fluctuate.',
                        mlConfidence: 0.91,
                    },
                ];

                const newAlert = {
                    id: Date.now(),
                    ...alerts[Math.floor(Math.random() * alerts.length)],
                    timestamp: new Date(),
                };

                setRiskAlerts(prev => [newAlert, ...prev].slice(0, 5));
            }
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const getVitalStatus = (vital, value) => {
        const ranges = {
            heartRate: { min: 60, max: 100, optimal: [70, 85] },
            systolic: { min: 90, max: 140, optimal: [110, 120] },
            diastolic: { min: 60, max: 90, optimal: [70, 80] },
            temperature: { min: 97.0, max: 99.5, optimal: [98.0, 98.6] },
            oxygenSaturation: { min: 95, max: 100, optimal: [97, 100] },
            fetalHeartRate: { min: 110, max: 160, optimal: [120, 160] },
        };

        const range = ranges[vital];
        if (!range) return 'normal';

        if (value < range.min || value > range.max) return 'critical';
        if (value < range.optimal[0] || value > range.optimal[1]) return 'warning';
        return 'normal';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'critical': return 'error';
            case 'warning': return 'warning';
            default: return 'success';
        }
    };

    const VitalCard = ({ icon: Icon, title, value, unit, status, subtitle }) => (
        <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: `${getStatusColor(status)}.main`, mr: 2 }}>
                        <Icon />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                            {value}
                            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                {unit}
                            </Typography>
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Chip
                        label={status.toUpperCase()}
                        size="small"
                        color={getStatusColor(status)}
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Maternal Guard Monitor
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Real-time wearable vitals monitoring with AI-powered risk assessment
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip
                        icon={<BluetoothIcon />}
                        label={deviceStatus.connected ? 'Connected' : 'Disconnected'}
                        color={deviceStatus.connected ? 'success' : 'error'}
                        variant="outlined"
                    />
                    <Chip
                        icon={<BatteryFullIcon />}
                        label={`${deviceStatus.battery}%`}
                        color={deviceStatus.battery > 20 ? 'success' : 'warning'}
                        variant="outlined"
                    />
                    <IconButton color="primary" onClick={() => setVitals({ ...vitals, lastUpdated: new Date() })}>
                        <RefreshIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* ML Risk Alerts */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MonitorHeartIcon color="primary" />
                    AI Risk Assessment
                </Typography>
                <List>
                    {riskAlerts.map((alert) => (
                        <Alert
                            key={alert.id}
                            severity={alert.severity}
                            icon={alert.severity === 'success' ? <CheckCircleIcon /> : <WarningIcon />}
                            sx={{ mb: 1 }}
                        >
                            <AlertTitle sx={{ fontWeight: 'bold' }}>
                                {alert.title}
                                <Chip
                                    label={`ML: ${(alert.mlConfidence * 100).toFixed(0)}%`}
                                    size="small"
                                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                />
                            </AlertTitle>
                            {alert.message}
                            <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.7 }}>
                                {alert.timestamp.toLocaleTimeString()}
                            </Typography>
                        </Alert>
                    ))}
                </List>
            </Paper>

            {/* Vital Signs Grid */}
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                Maternal Vitals
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <VitalCard
                        icon={FavoriteIcon}
                        title="Heart Rate"
                        value={vitals.heartRate}
                        unit="bpm"
                        status={getVitalStatus('heartRate', vitals.heartRate)}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <VitalCard
                        icon={MonitorHeartIcon}
                        title="Blood Pressure"
                        value={`${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`}
                        unit="mmHg"
                        status={Math.max(
                            getVitalStatus('systolic', vitals.bloodPressure.systolic),
                            getVitalStatus('diastolic', vitals.bloodPressure.diastolic)
                        ) === 'critical' ? 'critical' : 'normal'}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <VitalCard
                        icon={ThermostatIcon}
                        title="Temperature"
                        value={vitals.temperature.toFixed(1)}
                        unit="°F"
                        status={getVitalStatus('temperature', vitals.temperature)}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <VitalCard
                        icon={WaterDropIcon}
                        title="Oxygen Saturation"
                        value={vitals.oxygenSaturation}
                        unit="%"
                        status={getVitalStatus('oxygenSaturation', vitals.oxygenSaturation)}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <VitalCard
                        icon={PregnantWomanIcon}
                        title="Fetal Heart Rate"
                        value={vitals.fetalHeartRate}
                        unit="bpm"
                        status={getVitalStatus('fetalHeartRate', vitals.fetalHeartRate)}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <VitalCard
                        icon={MonitorHeartIcon}
                        title="Contractions"
                        value={vitals.contractionFrequency}
                        unit="/hour"
                        status="normal"
                        subtitle="No contractions detected"
                    />
                </Grid>
            </Grid>

            {/* Last Updated */}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                Last updated: {vitals.lastUpdated.toLocaleTimeString()}
            </Typography>
        </Box>
    );
};

export default MaternalGuard;
