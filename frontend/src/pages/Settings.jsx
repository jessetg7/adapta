// src/pages/Settings.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Divider,
    AppBar,
    Toolbar,
    IconButton,
    Alert,
    Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { useAdapta } from '../context/AdaptaContext';

const Settings = () => {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser, clinicInfo, setClinicInfo } = useAdapta();

    // Local state for form
    const [doctorForm, setDoctorForm] = useState({
        name: currentUser.name || '',
        qualification: currentUser.qualification || '',
        specialization: currentUser.specialization || '',
        registrationNo: currentUser.registrationNo || '',
    });

    const [clinicForm, setClinicForm] = useState({
        name: clinicInfo.name || '',
        address: clinicInfo.address || '',
        phone: clinicInfo.phone || '',
        email: clinicInfo.email || '',
        website: clinicInfo.website || '',
        registrationNumber: clinicInfo.registrationNumber || '',
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    // Handle doctor form changes
    const handleDoctorChange = (field) => (e) => {
        setDoctorForm({ ...doctorForm, [field]: e.target.value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    // Handle clinic form changes
    const handleClinicChange = (field) => (e) => {
        setClinicForm({ ...clinicForm, [field]: e.target.value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    // Validate form
    const validate = () => {
        const newErrors = {};

        // Doctor validation
        if (!doctorForm.name.trim()) {
            newErrors.name = 'Doctor name is required';
        }

        // Clinic validation
        if (!clinicForm.name.trim()) {
            newErrors.clinicName = 'Clinic name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle save
    const handleSave = () => {
        if (!validate()) {
            return;
        }

        // Update context
        setCurrentUser({
            ...currentUser,
            name: doctorForm.name,
            qualification: doctorForm.qualification,
            specialization: doctorForm.specialization,
            registrationNo: doctorForm.registrationNo,
        });

        setClinicInfo({
            ...clinicInfo,
            name: clinicForm.name,
            address: clinicForm.address,
            phone: clinicForm.phone,
            email: clinicForm.email,
            website: clinicForm.website,
            registrationNumber: clinicForm.registrationNumber,
        });

        // Save to localStorage for persistence
        localStorage.setItem('adaptaDoctor', JSON.stringify({
            name: doctorForm.name,
            qualification: doctorForm.qualification,
            specialization: doctorForm.specialization,
            registrationNo: doctorForm.registrationNo,
        }));

        localStorage.setItem('adaptaClinic', JSON.stringify({
            name: clinicForm.name,
            address: clinicForm.address,
            phone: clinicForm.phone,
            email: clinicForm.email,
            website: clinicForm.website,
            registrationNumber: clinicForm.registrationNumber,
        }));

        setShowSuccess(true);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* App Bar */}
            <AppBar position="static" elevation={1}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => navigate('/')}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                        Settings
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        sx={{
                            bgcolor: 'success.main',
                            '&:hover': { bgcolor: 'success.dark' },
                        }}
                    >
                        Save Changes
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={3}>
                    {/* Doctor Profile Section */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            sx={{
                                p: 3,
                                // Glassmorphism
                                backgroundColor: (theme) => theme.palette.mode === 'dark'
                                    ? 'rgba(10, 10, 10, 0.6)'
                                    : 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                border: (theme) => theme.palette.mode === 'dark'
                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                    : '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        mr: 2,
                                    }}
                                >
                                    <PersonIcon sx={{ color: '#fff', fontSize: 28 }} />
                                </Box>
                                <div>
                                    <Typography variant="h6" fontWeight={600}>
                                        Doctor Profile
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Information displayed on prescriptions
                                    </Typography>
                                </div>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={doctorForm.name}
                                        onChange={handleDoctorChange('name')}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Qualification"
                                        value={doctorForm.qualification}
                                        onChange={handleDoctorChange('qualification')}
                                        placeholder="e.g., MBBS, MD, MS"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Specialization"
                                        value={doctorForm.specialization}
                                        onChange={handleDoctorChange('specialization')}
                                        placeholder="e.g., General Medicine, Pediatrics"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Registration Number"
                                        value={doctorForm.registrationNo}
                                        onChange={handleDoctorChange('registrationNo')}
                                        placeholder="e.g., MCI-12345"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Clinic Information Section */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            sx={{
                                p: 3,
                                // Glassmorphism
                                backgroundColor: (theme) => theme.palette.mode === 'dark'
                                    ? 'rgba(10, 10, 10, 0.6)'
                                    : 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                border: (theme) => theme.palette.mode === 'dark'
                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                    : '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                        mr: 2,
                                    }}
                                >
                                    <BusinessIcon sx={{ color: '#fff', fontSize: 28 }} />
                                </Box>
                                <div>
                                    <Typography variant="h6" fontWeight={600}>
                                        Clinic Information
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Hospital/Clinic details for prescriptions
                                    </Typography>
                                </div>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Hospital/Clinic Name"
                                        value={clinicForm.name}
                                        onChange={handleClinicChange('name')}
                                        error={!!errors.clinicName}
                                        helperText={errors.clinicName}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        value={clinicForm.address}
                                        onChange={handleClinicChange('address')}
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        value={clinicForm.phone}
                                        onChange={handleClinicChange('phone')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={clinicForm.email}
                                        onChange={handleClinicChange('email')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Website"
                                        value={clinicForm.website}
                                        onChange={handleClinicChange('website')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Registration Number"
                                        value={clinicForm.registrationNumber}
                                        onChange={handleClinicChange('registrationNumber')}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Success Snackbar */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setShowSuccess(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Settings saved successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Settings;
