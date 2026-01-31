// src/components/ReportBuilder/ReportBuilder.jsx
import React, { useState, useMemo } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    AppBar,
    Toolbar,
    IconButton
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

const DATA_SOURCES = [
    { id: 'patients', label: 'Patient Demographics', fields: ['Age', 'Gender', 'Location', 'Registration Date'] },
    { id: 'visits', label: 'OPD Consultations', fields: ['Department', 'Doctor', 'Visit Type', 'Date'] },
    { id: 'billing', label: 'Revenue & Billing', fields: ['Total Amount', 'Payment Method', 'Discount', 'Status'] },
    { id: 'lab', label: 'Laboratory Results', fields: ['Test Type', 'Priority', 'Outcome'] },
];

const CHART_TYPES = [
    { id: 'bar', label: 'Bar Chart', icon: <BarChartIcon /> },
    { id: 'pie', label: 'Pie Chart', icon: <PieChartIcon /> },
    { id: 'table', label: 'Data Table', icon: <TableChartIcon /> },
];

const ReportBuilder = ({ onSave, onClose }) => {
    const [reportConfig, setReportConfig] = useState({
        name: 'New HMS Report',
        dataSource: 'patients',
        chartType: 'bar',
        xAxis: 'Gender',
        yAxis: 'Count',
        filters: []
    });

    const selectedSource = useMemo(() =>
        DATA_SOURCES.find(s => s.id === reportConfig.dataSource),
        [reportConfig.dataSource]);

    const handleUpdate = (field, value) => {
        setReportConfig(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.100' }}>
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Report Builder (LCNC)</Typography>
                    <TextField
                        size="small"
                        value={reportConfig.name}
                        onChange={(e) => handleUpdate('name', e.target.value)}
                        sx={{ mr: 2, width: 250 }}
                    />
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={() => onSave?.(reportConfig)}>
                        Save Report
                    </Button>
                    {onClose && <IconButton onClick={onClose} sx={{ ml: 1 }}><CloseIcon /></IconButton>}
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                {/* Configuration Panel */}
                <Paper sx={{ width: 320, p: 3, borderRadius: 0, borderRight: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>Data Source</Typography>
                    <FormControl fullWidth sx={{ mb: 3 }} size="small">
                        <Select
                            value={reportConfig.dataSource}
                            onChange={(e) => handleUpdate('dataSource', e.target.value)}
                        >
                            {DATA_SOURCES.map(source => (
                                <MenuItem key={source.id} value={source.id}>{source.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>Visualization</Typography>
                    <Grid container spacing={1} sx={{ mb: 3 }}>
                        {CHART_TYPES.map(type => (
                            <Grid item xs={4} key={type.id}>
                                <Button
                                    variant={reportConfig.chartType === type.id ? 'contained' : 'outlined'}
                                    fullWidth
                                    sx={{ flexDirection: 'column', p: 1 }}
                                    onClick={() => handleUpdate('chartType', type.id)}
                                >
                                    {type.icon}
                                    <Typography variant="caption" sx={{ mt: 0.5 }}>{type.label}</Typography>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>

                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>Axes / Grouping</Typography>
                    <FormControl fullWidth sx={{ mb: 2 }} size="small">
                        <InputLabel>Group By (X-Axis)</InputLabel>
                        <Select
                            label="Group By (X-Axis)"
                            value={reportConfig.xAxis}
                            onChange={(e) => handleUpdate('xAxis', e.target.value)}
                        >
                            {selectedSource.fields.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2 }} gutterBottom>Filters</Typography>
                    <Button startIcon={<AddIcon />} variant="outlined" size="small" fullWidth>
                        Add Filter Rule
                    </Button>
                </Paper>

                {/* Preview Panel */}
                <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Paper sx={{ p: 4, width: '100%', maxWidth: 800, textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            {reportConfig.name} Preview
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 2, m: 2 }}>
                            {reportConfig.chartType === 'bar' && <BarChartIcon sx={{ fontSize: 100, color: 'primary.light', opacity: 0.5 }} />}
                            {reportConfig.chartType === 'pie' && <PieChartIcon sx={{ fontSize: 100, color: 'secondary.light', opacity: 0.5 }} />}
                            {reportConfig.chartType === 'table' && <TableChartIcon sx={{ fontSize: 100, color: 'success.light', opacity: 0.5 }} />}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Real-time visualization of <b>{selectedSource.label}</b> grouped by <b>{reportConfig.xAxis}</b>
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default ReportBuilder;
