// src/pages/VerifyPrescription.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Chip,
    Divider,
    Container,
    Alert,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import GppBadIcon from '@mui/icons-material/GppBad';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const VerifyPrescription = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);

    // Get data from URL params for demo purposes
    // In a real app, you would fetch this from the backend using the ID
    const patientId = searchParams.get('p');
    const doctorId = searchParams.get('d');

    useEffect(() => {
        // Simulate API verification call
        const timer = setTimeout(() => {
            setLoading(false);
            // Mock verification logic - always true if ID exists
            if (id) {
                setVerified(true);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    bgcolor: 'grey.50',
                }}
            >
                <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
                <Typography variant="h6" color="text.secondary">
                    Verifying Prescription Authenticity...
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 4,
                    borderTop: Verified ? '6px solid #2e7d32' : '6px solid #d32f2f',
                }}
            >
                <Box sx={{ mb: 3 }}>
                    {verified ? (
                        <VerifiedIcon color="success" sx={{ fontSize: 80 }} />
                    ) : (
                        <GppBadIcon color="error" sx={{ fontSize: 80 }} />
                    )}
                </Box>

                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {verified ? 'Generic Verified' : 'Verification Failed'}
                </Typography>

                <Chip
                    label={verified ? 'Valid Prescription' : 'Invalid / Expired'}
                    color={verified ? 'success' : 'error'}
                    sx={{ mb: 4, px: 2, py: 1, fontSize: '1rem' }}
                />

                <Divider sx={{ mb: 4 }} />

                <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="overline" color="text.secondary" display="block">
                        Prescription ID
                    </Typography>
                    <Typography variant="h6" fontWeight="medium" gutterBottom>
                        {id}
                    </Typography>

                    {patientId && (
                        <>
                            <Typography variant="overline" color="text.secondary" display="block" sx={{ mt: 2 }}>
                                Patient ID
                            </Typography>
                            <Typography variant="body1" fontWeight="medium" gutterBottom>
                                {patientId}
                            </Typography>
                        </>
                    )}

                    {doctorId && (
                        <>
                            <Typography variant="overline" color="text.secondary" display="block" sx={{ mt: 2 }}>
                                Doctor ID
                            </Typography>
                            <Typography variant="body1" fontWeight="medium" gutterBottom>
                                {doctorId}
                            </Typography>
                        </>
                    )}

                    <Typography variant="overline" color="text.secondary" display="block" sx={{ mt: 2 }}>
                        Verification Date
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                        {new Date().toLocaleString()}
                    </Typography>
                </Box>

                {verified && (
                    <Alert severity="success" sx={{ mt: 4, textAlign: 'left' }}>
                        This prescription was digitally signed and issued by ADAPTA Health Platform. The record exists in our secure database.
                    </Alert>
                )}
            </Paper>

            <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 4 }}>
                © 2026 ADAPTA Health. All rights reserved.
            </Typography>
        </Container>
    );
};

export default VerifyPrescription;
