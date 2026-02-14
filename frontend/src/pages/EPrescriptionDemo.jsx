// src/pages/EPrescriptionDemo.jsx
import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Grid,
    MenuItem,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PreviewIcon from '@mui/icons-material/Preview';
import PrescriptionWithQR from '../components/PrescriptionPDF/PrescriptionWithQR';

const EPrescriptionDemo = () => {
    const [showPreview, setShowPreview] = useState(false);
    const [prescriptionData, setPrescriptionData] = useState({
        patient: {
            name: 'Rajesh Kumar',
            age: 45,
            gender: 'Male',
            id: 'P-2024-001',
            phone: '+91 9876543210',
        },
        doctor: {
            name: 'Dr. Sanjay Kumar',
            specialty: 'MBBS, MD (General Medicine)',
            regNo: 'MCI-12345',
        },
        diagnosis: 'Acute Upper Respiratory Tract Infection',
        medications: [
            {
                medication: 'Paracetamol 500mg',
                dosage: '1 tablet',
                frequency: 'TID (Three times daily)',
                duration: '5 days',
                instructions: 'After meals',
            },
            {
                medication: 'Amoxicillin 500mg',
                dosage: '1 capsule',
                frequency: 'BID (Twice daily)',
                duration: '7 days',
                instructions: 'Before meals with water',
            },
            {
                medication: 'Cetirizine 10mg',
                dosage: '1 tablet',
                frequency: 'OD (Once daily)',
                duration: '5 days',
                instructions: 'At bedtime',
            },
        ],
        instructions: 'Take adequate rest. Drink plenty of fluids. Avoid cold beverages.',
        followUp: 'Review after 7 days or if symptoms persist',
    });

    if (showPreview) {
        return (
            <Box>
                <Button
                    variant="outlined"
                    onClick={() => setShowPreview(false)}
                    sx={{ m: 2 }}
                >
                    ← Back to Editor
                </Button>
                <PrescriptionWithQR prescriptionData={prescriptionData} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                E-Prescription Generator
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create digital prescriptions with QR code verification
            </Typography>

            <Grid container spacing={3}>
                {/* Patient Details */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Patient Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Patient Name"
                                    value={prescriptionData.patient.name}
                                    onChange={(e) =>
                                        setPrescriptionData({
                                            ...prescriptionData,
                                            patient: { ...prescriptionData.patient, name: e.target.value },
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Age"
                                    type="number"
                                    value={prescriptionData.patient.age}
                                    onChange={(e) =>
                                        setPrescriptionData({
                                            ...prescriptionData,
                                            patient: { ...prescriptionData.patient, age: e.target.value },
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Gender"
                                    value={prescriptionData.patient.gender}
                                    onChange={(e) =>
                                        setPrescriptionData({
                                            ...prescriptionData,
                                            patient: { ...prescriptionData.patient, gender: e.target.value },
                                        })
                                    }
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    value={prescriptionData.patient.phone}
                                    onChange={(e) =>
                                        setPrescriptionData({
                                            ...prescriptionData,
                                            patient: { ...prescriptionData.patient, phone: e.target.value },
                                        })
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Doctor Details */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Doctor Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Doctor Name"
                                    value={prescriptionData.doctor.name}
                                    onChange={(e) =>
                                        setPrescriptionData({
                                            ...prescriptionData,
                                            doctor: { ...prescriptionData.doctor, name: e.target.value },
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Specialty"
                                    value={prescriptionData.doctor.specialty}
                                    onChange={(e) =>
                                        setPrescriptionData({
                                            ...prescriptionData,
                                            doctor: { ...prescriptionData.doctor, specialty: e.target.value },
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Registration Number"
                                    value={prescriptionData.doctor.regNo}
                                    onChange={(e) =>
                                        setPrescriptionData({
                                            ...prescriptionData,
                                            doctor: { ...prescriptionData.doctor, regNo: e.target.value },
                                        })
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Diagnosis */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Diagnosis & Instructions
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Diagnosis"
                                    multiline
                                    rows={2}
                                    value={prescriptionData.diagnosis}
                                    onChange={(e) =>
                                        setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Special Instructions"
                                    multiline
                                    rows={2}
                                    value={prescriptionData.instructions}
                                    onChange={(e) =>
                                        setPrescriptionData({ ...prescriptionData, instructions: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Follow-up"
                                    value={prescriptionData.followUp}
                                    onChange={(e) =>
                                        setPrescriptionData({ ...prescriptionData, followUp: e.target.value })
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Preview Button */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<PreviewIcon />}
                            onClick={() => setShowPreview(true)}
                        >
                            Preview E-Prescription
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EPrescriptionDemo;
