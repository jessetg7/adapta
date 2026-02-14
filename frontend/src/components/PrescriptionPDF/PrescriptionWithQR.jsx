// src/components/PrescriptionPDF/PrescriptionWithQR.jsx
import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import VerifiedIcon from '@mui/icons-material/Verified';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';

const PrescriptionWithQR = ({ prescriptionData }) => {
    // Generate unique prescription ID
    const prescriptionId = prescriptionData?.id || `RX-${Date.now()}`;

    // Create a simplified QR payload for reliable scanning
    // Uses current window location origin to ensure the link works in the current environment
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://adapta.health';
    const qrData = `${baseUrl}/verify/${prescriptionId}?p=${prescriptionData?.patient?.id}&d=${prescriptionData?.doctor?.id}`;

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // In production, this would generate a PDF
        alert('PDF download functionality would be implemented here');
    };

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
            {/* Action Buttons - Hidden in print */}
            <Box sx={{ mb: 2, display: 'flex', gap: 2, '@media print': { display: 'none' } }}>
                <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                >
                    Print
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                >
                    Download PDF
                </Button>
            </Box>

            {/* Prescription Document */}
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    bgcolor: 'white',
                    color: 'black',
                    '@media print': {
                        boxShadow: 'none',
                        p: 2,
                    },
                }}
            >
                {/* Header with QR Code */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={9}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                            ADAPTA Health
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Advanced Digital Adaptive Platform for Total Automation
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            📍 123 Medical Street, Healthcare City, HC 12345
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            📞 +91 1234567890 | 📧 contact@adapta.health
                        </Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ textAlign: 'right' }}>
                        <Box
                            sx={{
                                p: 1,
                                border: '2px solid',
                                borderColor: 'primary.main',
                                borderRadius: 1,
                                display: 'inline-block',
                            }}
                        >
                            <QRCodeSVG
                                value={qrData}
                                size={100}
                                level="H"
                                includeMargin={false}
                            />
                            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                Scan to Verify
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Prescription Header */}
                <Box sx={{ mb: 3, bgcolor: 'primary.light', p: 2, borderRadius: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                                Prescription ID
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                {prescriptionId}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" color="text.secondary">
                                Date
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                {new Date().toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                {/* Doctor Information */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Dr. {prescriptionData?.doctor?.name || 'Sanjay Kumar'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {prescriptionData?.doctor?.specialty || 'MBBS, MD (General Medicine)'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Reg. No: {prescriptionData?.doctor?.regNo || 'MCI-12345'}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Patient Information */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        PATIENT DETAILS
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body2">
                                <strong>Name:</strong> {prescriptionData?.patient?.name || 'Patient Name'}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Age/Gender:</strong> {prescriptionData?.patient?.age || '35'} /{' '}
                                {prescriptionData?.patient?.gender || 'Male'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">
                                <strong>Patient ID:</strong> {prescriptionData?.patient?.id || 'P-12345'}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Contact:</strong> {prescriptionData?.patient?.phone || '+91 9876543210'}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Diagnosis */}
                {prescriptionData?.diagnosis && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            DIAGNOSIS
                        </Typography>
                        <Typography variant="body1">{prescriptionData.diagnosis}</Typography>
                    </Box>
                )}

                {/* Medications */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                        PRESCRIPTION (℞)
                    </Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                    <TableCell><strong>#</strong></TableCell>
                                    <TableCell><strong>Medication</strong></TableCell>
                                    <TableCell><strong>Dosage</strong></TableCell>
                                    <TableCell><strong>Frequency</strong></TableCell>
                                    <TableCell><strong>Duration</strong></TableCell>
                                    <TableCell><strong>Instructions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(prescriptionData?.medications || [
                                    {
                                        medication: 'Paracetamol 500mg',
                                        dosage: '1 tablet',
                                        frequency: 'TID',
                                        duration: '5 days',
                                        instructions: 'After meals',
                                    },
                                    {
                                        medication: 'Amoxicillin 500mg',
                                        dosage: '1 capsule',
                                        frequency: 'BID',
                                        duration: '7 days',
                                        instructions: 'Before meals',
                                    },
                                ]).map((med, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{med.medication}</TableCell>
                                        <TableCell>{med.dosage}</TableCell>
                                        <TableCell>{med.frequency}</TableCell>
                                        <TableCell>{med.duration || '5 days'}</TableCell>
                                        <TableCell>{med.instructions || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Additional Instructions */}
                {prescriptionData?.instructions && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            SPECIAL INSTRUCTIONS
                        </Typography>
                        <Typography variant="body2">{prescriptionData.instructions}</Typography>
                    </Box>
                )}

                {/* Follow-up */}
                {prescriptionData?.followUp && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2">
                            <strong>Follow-up:</strong> {prescriptionData.followUp}
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Digital Signature & Verification */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed grey', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Digital Signature
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'cursive', mt: 1 }}>
                                Dr. {prescriptionData?.doctor?.name || 'Sanjay Kumar'}
                            </Typography>
                            <Chip
                                icon={<VerifiedIcon />}
                                label="Digitally Signed"
                                color="success"
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                                VERIFICATION DETAILS
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Prescription ID:</strong> {prescriptionId}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Issued:</strong> {new Date().toLocaleString('en-IN')}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Verify at:</strong> adapta.health/verify
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Footer */}
                <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" align="center" display="block">
                        This is a digitally generated prescription. Scan the QR code to verify authenticity.
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center" display="block">
                        For queries, contact: support@adapta.health | +91 1234567890
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default PrescriptionWithQR;
