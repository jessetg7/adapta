// src/pages/AnalyticsDashboard.jsx
import React, { useState, useMemo } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemText,
    LinearProgress,
    Divider,
} from '@mui/material';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import MedicationIcon from '@mui/icons-material/Medication';
import AssessmentIcon from '@mui/icons-material/Assessment';

const AnalyticsDashboard = () => {
    const [timeRange, setTimeRange] = useState('month');

    // Mock data - in production, this would come from your backend
    const statsData = {
        totalPatients: 5,
        patientsChange: 25.0,  // 1 new patient (from 4 to 5)
        totalConsultations: 8,
        consultationsChange: 14.3,  // 1 new consultation
        revenue: 6400,
        revenueChange: 12.5,
        appointments: 3,
        appointmentsChange: 50.0,  // 1 new appointment
    };

    const monthlyData = [
        { month: 'Jan', patients: 0, revenue: 0, consultations: 0 },
        { month: 'Feb', patients: 1, revenue: 800, consultations: 1 },
        { month: 'Mar', patients: 1, revenue: 1200, consultations: 2 },
        { month: 'Apr', patients: 1, revenue: 1600, consultations: 2 },
        { month: 'May', patients: 1, revenue: 1400, consultations: 1 },
        { month: 'Jun', patients: 1, revenue: 1400, consultations: 2 },
    ];

    const diagnosisData = [
        { name: 'Hypertension', value: 2, color: '#0088FE' },
        { name: 'Diabetes', value: 1, color: '#00C49F' },
        { name: 'Respiratory', value: 2, color: '#FFBB28' },
        { name: 'Fever', value: 2, color: '#FF8042' },
        { name: 'Others', value: 1, color: '#8884D8' },
    ];

    const topMedications = [
        { name: 'Paracetamol', prescriptions: 3, trend: 'up' },
        { name: 'Metformin', prescriptions: 2, trend: 'up' },
        { name: 'Amlodipine', prescriptions: 2, trend: 'down' },
        { name: 'Aspirin', prescriptions: 1, trend: 'up' },
        { name: 'Omeprazole', prescriptions: 1, trend: 'up' },
    ];

    const departmentStats = [
        { name: 'General Medicine', patients: 3, percentage: 60.0 },
        { name: 'Cardiology', patients: 1, percentage: 20.0 },
        { name: 'Orthopedics', patients: 0, percentage: 0 },
        { name: 'Pediatrics', patients: 1, percentage: 20.0 },
        { name: 'Gynecology', patients: 0, percentage: 0 },
    ];

    const StatCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '' }) => {
        const isPositive = change >= 0;
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                {title}
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                            </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Icon />
                        </Avatar>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isPositive ? (
                            <TrendingUpIcon color="success" fontSize="small" />
                        ) : (
                            <TrendingDownIcon color="error" fontSize="small" />
                        )}
                        <Typography
                            variant="body2"
                            color={isPositive ? 'success.main' : 'error.main'}
                            fontWeight="bold"
                        >
                            {Math.abs(change)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            vs last {timeRange}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Analytics Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Comprehensive insights and performance metrics
                    </Typography>
                </Box>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Time Range</InputLabel>
                    <Select
                        value={timeRange}
                        label="Time Range"
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <MenuItem value="week">Last Week</MenuItem>
                        <MenuItem value="month">Last Month</MenuItem>
                        <MenuItem value="quarter">Last Quarter</MenuItem>
                        <MenuItem value="year">Last Year</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Patients"
                        value={statsData.totalPatients}
                        change={statsData.patientsChange}
                        icon={PeopleIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Consultations"
                        value={statsData.totalConsultations}
                        change={statsData.consultationsChange}
                        icon={LocalHospitalIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Revenue"
                        value={statsData.revenue}
                        change={statsData.revenueChange}
                        icon={AttachMoneyIcon}
                        prefix="₹"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Appointments"
                        value={statsData.appointments}
                        change={statsData.appointmentsChange}
                        icon={EventIcon}
                    />
                </Grid>
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Revenue Trend */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Revenue & Patient Trends
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#0088FE"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    name="Revenue (₹)"
                                />
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="patients"
                                    stroke="#00C49F"
                                    fillOpacity={1}
                                    fill="url(#colorPatients)"
                                    name="New Patients"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Top Diagnoses */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Top Diagnoses
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={diagnosisData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {diagnosisData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Charts Row 2 */}
            <Grid container spacing={3}>
                {/* Department Performance */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                            Department Performance
                        </Typography>
                        <List>
                            {departmentStats.map((dept, index) => (
                                <React.Fragment key={dept.name}>
                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={dept.name}
                                            secondary={
                                                <Box sx={{ mt: 1 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="caption">{dept.patients} patients</Typography>
                                                        <Typography variant="caption" fontWeight="bold">
                                                            {dept.percentage}%
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={dept.percentage}
                                                        sx={{ height: 6, borderRadius: 1 }}
                                                    />
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < departmentStats.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Top Medications */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                            <MedicationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Top Prescribed Medications
                        </Typography>
                        <List>
                            {topMedications.map((med, index) => (
                                <React.Fragment key={med.name}>
                                    <ListItem
                                        sx={{ px: 0 }}
                                        secondaryAction={
                                            <Chip
                                                icon={med.trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                                label={med.prescriptions}
                                                color={med.trend === 'up' ? 'success' : 'error'}
                                                size="small"
                                            />
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" fontWeight="medium">
                                                    {index + 1}. {med.name}
                                                </Typography>
                                            }
                                            secondary={`${med.prescriptions} prescriptions`}
                                        />
                                    </ListItem>
                                    {index < topMedications.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsDashboard;
