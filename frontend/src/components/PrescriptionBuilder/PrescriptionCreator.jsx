// src/components/PrescriptionBuilder/PrescriptionCreator.jsx
/**
 * Prescription Creator - Integrates with patient data and creates actual prescriptions
 * This wraps the PrescriptionBuilder template designer with real patient/visit data
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    IconButton,
    Autocomplete,
    TextField,
    Grid,
    Card,
    CardContent,
    Divider,
    Chip,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Print as PrintIcon,
    Close as CloseIcon,
    Person as PersonIcon,
    LocalHospital as LocalHospitalIcon,
    Medication as MedicationIcon,
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

import usePatientStore from '../../core/store/usePatientStore';
import { useAuth } from '../../context/AuthContext';
import PrescriptionPreview from './PrescriptionPreview';

// Common medication database (expandable)
const COMMON_MEDICATIONS = [
    { name: 'Paracetamol', commonDoses: ['500mg', '650mg', '1000mg'], routes: ['Oral'], frequencies: ['TDS', 'QID', 'SOS'] },
    { name: 'Ibuprofen', commonDoses: ['200mg', '400mg', '600mg'], routes: ['Oral'], frequencies: ['TDS', 'BD'] },
    { name: 'Amoxicillin', commonDoses: ['250mg', '500mg'], routes: ['Oral'], frequencies: ['TDS', 'BD'] },
    { name: 'Azithromycin', commonDoses: ['250mg', '500mg'], routes: ['Oral'], frequencies: ['OD'] },
    { name: 'Cetirizine', commonDoses: ['5mg', '10mg'], routes: ['Oral'], frequencies: ['OD', 'BD'] },
    { name: 'Omeprazole', commonDoses: ['20mg', '40mg'], routes: ['Oral'], frequencies: ['OD', 'BD'] },
    { name: 'Metformin', commonDoses: ['500mg', '850mg', '1000mg'], routes: ['Oral'], frequencies: ['BD', 'TDS'] },
    { name: 'Amlodipine', commonDoses: ['2.5mg', '5mg', '10mg'], routes: ['Oral'], frequencies: ['OD'] },
    { name: 'Atenolol', commonDoses: ['25mg', '50mg', '100mg'], routes: ['Oral'], frequencies: ['OD', 'BD'] },
    { name: 'Aspirin', commonDoses: ['75mg', '150mg', '300mg'], routes: ['Oral'], frequencies: ['OD'] },
];

// Frequency options
const FREQUENCY_OPTIONS = [
    { value: 'OD', label: 'Once daily (OD)' },
    { value: 'BD', label: 'Twice daily (BD)' },
    { value: 'TDS', label: 'Thrice daily (TDS)' },
    { value: 'QID', label: 'Four times daily (QID)' },
    { value: 'SOS', label: 'As needed (SOS)' },
    { value: 'HS', label: 'At bedtime (HS)' },
    { value: 'STAT', label: 'Immediately (STAT)' },
];

// Route options
const ROUTE_OPTIONS = ['Oral', 'IV', 'IM', 'SC', 'Topical', 'Inhalation', 'Rectal', 'Sublingual'];

// Timing options
const TIMING_OPTIONS = ['Before food', 'After food', 'With food', 'Empty stomach', 'At bedtime', 'Anytime'];

const PrescriptionCreator = ({ visitId, patientId: propPatientId, onClose }) => {
    const { user } = useAuth();
    const {
        patients,
        visits,
        addPrescription,
        getPatient,
        getVisit,
        setActivePatient,
        setActiveVisit,
    } = usePatientStore();

    // State
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [medications, setMedications] = useState([]);
    const [diagnosis, setDiagnosis] = useState('');
    const [investigations, setInvestigations] = useState('');
    const [advice, setAdvice] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    // Doctor Details State (Editable)
    const [doctorDetails, setDoctorDetails] = useState({
        name: user.name || '',
        qualification: user.qualification || 'MBBS, MD',
        specialization: user.specialization || 'General Medicine',
        registrationNo: user.registrationNo || 'MCI-12345',
    });

    // Hospital Details State (Editable)
    const [hospitalDetails, setHospitalDetails] = useState({
        name: 'Medical Center',
        address: '123 Healthcare Avenue, New York, NY',
        phone: '+1 (555) 123-4567',
        email: 'info@medical.com'
    });

    // Clinical Templates
    const CLINICAL_TEMPLATES = {
        'pediatrics': {
            label: 'Pediatrics (Viral Fever)',
            diagnosis: 'Viral Fever\nUpper Respiratory Tract Infection',
            advice: 'Sponge bath for high fever.\nKeep hydrated.\nReview if fever persists > 3 days.',
            medications: [
                { id: uuidv4(), name: 'Paracetamol Syrup', dose: '5ml', route: 'Oral', frequency: 'TDS', timing: 'After food', duration: '3 days', quantity: '1', instructions: 'For fever > 100F' },
                { id: uuidv4(), name: 'Cetirizine Syrup', dose: '2.5ml', route: 'Oral', frequency: 'BD', timing: 'After food', duration: '3 days', quantity: '1', instructions: '' }
            ]
        },
        'gynecology': {
            label: 'Gynecology (ANC)',
            diagnosis: 'Antenatal Checkup\nPrimigravida - 2nd Trimester',
            advice: 'Take plenty of fluids.\nAvoid heavy lifting.\nRegular walk for 30 mins.\nNext Scans: Anomaly Scan',
            medications: [
                { id: uuidv4(), name: 'Iron & Folic Acid', dose: '1 tab', route: 'Oral', frequency: 'OD', timing: 'After food', duration: '1 month', quantity: '30', instructions: '' },
                { id: uuidv4(), name: 'Calcium + Vit D3', dose: '1 tab', route: 'Oral', frequency: 'BD', timing: 'After food', duration: '1 month', quantity: '60', instructions: '' }
            ]
        },
        'opd': {
            label: 'General OPD (Gastritis)',
            diagnosis: 'Acute Gastritis\nAcid Reflux',
            advice: 'Avoid spicy and oily food.\nHave small frequent meals.\nEarly dinner.',
            medications: [
                { id: uuidv4(), name: 'Omeprazole', dose: '20mg', route: 'Oral', frequency: 'BD', timing: 'Before food', duration: '5 days', quantity: '10', instructions: '30 mins before food' },
                { id: uuidv4(), name: 'Antacid Syrup', dose: '10ml', route: 'Oral', frequency: 'TDS', timing: 'After food', duration: '5 days', quantity: '1', instructions: '' }
            ]
        }
    };

    const handleTemplateSelect = (templateKey) => {
        const template = CLINICAL_TEMPLATES[templateKey];
        if (template) {
            setDiagnosis(template.diagnosis);
            setAdvice(template.advice);
            if (medications.length === 0) {
                setMedications(template.medications.map(m => ({ ...m, id: uuidv4() }))); // Clone to avoid ref issues
            } else {
                if (window.confirm('Replace existing medications with template?')) {
                    setMedications(template.medications.map(m => ({ ...m, id: uuidv4() })));
                }
            }
        }
    };

    // Initialize with visit/patient data if provided
    useEffect(() => {
        if (visitId) {
            const visit = getVisit(visitId);
            if (visit) {
                setSelectedVisit(visit);
                const patient = getPatient(visit.patientId);
                setSelectedPatient(patient);

                // Pre-fill from visit data if available
                if (visit.diagnosis) setDiagnosis(visit.diagnosis);
                if (visit.vitals) {
                    // Vitals already captured in visit
                }
            }
        } else if (propPatientId) {
            const patient = getPatient(propPatientId);
            setSelectedPatient(patient);
        }
    }, [visitId, propPatientId, getVisit, getPatient]);

    // Get all patients for autocomplete
    const allPatients = useMemo(() => Object.values(patients), [patients]);

    // Add medication row
    const handleAddMedication = () => {
        setMedications([
            ...medications,
            {
                id: uuidv4(),
                name: '',
                dose: '',
                route: 'Oral',
                frequency: 'BD',
                timing: 'After food',
                duration: '',
                quantity: '',
                instructions: '',
            },
        ]);
    };

    // Update medication
    const handleUpdateMedication = (id, field, value) => {
        setMedications(medications.map(med =>
            med.id === id ? { ...med, [field]: value } : med
        ));
    };

    // Delete medication
    const handleDeleteMedication = (id) => {
        setMedications(medications.filter(med => med.id !== id));
    };

    // Auto-fill medication details when name is selected
    const handleMedicationSelect = (id, medication) => {
        if (medication) {
            setMedications(medications.map(med =>
                med.id === id ? {
                    ...med,
                    name: medication.name,
                    dose: medication.commonDoses[0] || '',
                    route: medication.routes[0] || 'Oral',
                    frequency: medication.frequencies[0] || 'BD',
                } : med
            ));
        }
    };

    // Save prescription
    const handleSave = () => {
        if (!selectedPatient) {
            alert('Please select a patient');
            return;
        }

        if (medications.length === 0) {
            alert('Please add at least one medication');
            return;
        }

        const prescriptionData = {
            patientId: selectedPatient.id,
            visitId: selectedVisit?.id || null,
            doctorId: user.id,
            doctorName: doctorDetails.name,
            doctorDetails: doctorDetails,
            hospitalDetails: hospitalDetails,
            date: new Date().toISOString(),
            diagnosis: diagnosis.split('\n').filter(d => d.trim()),
            medications: medications.map(({ id, ...med }) => med), // Remove temp IDs
            investigations: investigations.split('\n').filter(i => i.trim()),
            advice: advice.split('\n').filter(a => a.trim()),
            followUpDate: followUpDate || null,
            status: 'active',
        };

        const prescriptionId = addPrescription(prescriptionData);

        // Auto-open preview for printing/downloading
        setShowPreview(true);

        // Don't reset immediately so user can see what they saved
        // Resetting can happen when they close the preview or click 'New'
    };

    // Prepare data for preview
    const previewData = {
        patient: selectedPatient ? {
            name: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
            age: selectedPatient.age || calculateAge(selectedPatient.dateOfBirth),
            gender: selectedPatient.gender,
            phone: selectedPatient.phone,
            patientId: selectedPatient.id,
        } : null,
        visit: {
            date: selectedVisit?.date || new Date().toISOString(),
            type: selectedVisit?.type || 'Consultation',
        },
        vitals: selectedVisit?.vitals || {},
        diagnosis: diagnosis.split('\n').filter(d => d.trim()),
        medications: medications.filter(m => m.name),
        investigations: investigations.split('\n').filter(i => i.trim()),
        advice: advice.split('\n').filter(a => a.trim()),
        followUp: followUpDate,
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.100' }}>
            {/* Header */}
            <Paper sx={{ p: 2, borderRadius: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MedicationIcon color="primary" />
                        <Typography variant="h6">Prescription Writer</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<PrintIcon />}
                            onClick={() => setShowPreview(true)}
                            disabled={!selectedPatient || medications.length === 0}
                        >
                            Preview
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={!selectedPatient || medications.length === 0}
                        >
                            Save Prescription
                        </Button>
                        {onClose && (
                            <IconButton onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </Paper>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
                <Grid container spacing={3}>
                    {/* 1. Doctor & Hospital Information (First Step) */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocalHospitalIcon color="primary" />
                                    Clinic & Prescriber Details
                                </Typography>
                                <Grid container spacing={2}>
                                    {/* Hospital Details */}
                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth label="Clinic Name" value={hospitalDetails.name} onChange={(e) => setHospitalDetails({ ...hospitalDetails, name: e.target.value })} size="small" margin="dense" />
                                        <TextField fullWidth label="Address" value={hospitalDetails.address} onChange={(e) => setHospitalDetails({ ...hospitalDetails, address: e.target.value })} size="small" margin="dense" />
                                        <TextField fullWidth label="Phone" value={hospitalDetails.phone} onChange={(e) => setHospitalDetails({ ...hospitalDetails, phone: e.target.value })} size="small" margin="dense" />
                                    </Grid>

                                    {/* Doctor Details */}
                                    <Grid item xs={12} md={6}>
                                        <TextField fullWidth label="Doctor Name" value={doctorDetails.name} onChange={(e) => setDoctorDetails({ ...doctorDetails, name: e.target.value })} size="small" margin="dense" />
                                        <TextField fullWidth label="Qualification" value={doctorDetails.qualification} onChange={(e) => setDoctorDetails({ ...doctorDetails, qualification: e.target.value })} size="small" margin="dense" />
                                        <TextField fullWidth label="Registration No" value={doctorDetails.registrationNo} onChange={(e) => setDoctorDetails({ ...doctorDetails, registrationNo: e.target.value })} size="small" margin="dense" />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* 2. Clinical Templates (Quick Load) */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Quick Templates (Optional)
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Select Clinical Template to Auto-fill</InputLabel>
                                    <Select
                                        label="Select Clinical Template to Auto-fill"
                                        onChange={(e) => handleTemplateSelect(e.target.value)}
                                        defaultValue=""
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        {Object.entries(CLINICAL_TEMPLATES).map(([key, template]) => (
                                            <MenuItem key={key} value={key}>
                                                {template.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* 3. Patient Selection */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PersonIcon color="primary" />
                                    Patient Information
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            value={selectedPatient}
                                            onChange={(e, newValue) => {
                                                setSelectedPatient(newValue);
                                                if (newValue) {
                                                    setActivePatient(newValue.id);
                                                }
                                            }}
                                            options={allPatients}
                                            getOptionLabel={(option) =>
                                                `${option.firstName} ${option.lastName} - ${option.phone || option.email}`
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Select Patient"
                                                    placeholder="Search by name, phone, or email"
                                                    required
                                                />
                                            )}
                                            disabled={!!visitId || !!propPatientId}
                                        />
                                    </Grid>

                                    {selectedPatient && (
                                        <>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Patient ID"
                                                    value={selectedPatient.id}
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Age"
                                                    value={selectedPatient.age || calculateAge(selectedPatient.dateOfBirth)}
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Gender"
                                                    value={selectedPatient.gender}
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Phone"
                                                    value={selectedPatient.phone}
                                                    disabled
                                                />
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Diagnosis */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Diagnosis
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="Enter diagnosis (one per line)"
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Medications */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">
                                        Medications (Rx)
                                    </Typography>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={handleAddMedication}
                                        variant="contained"
                                        size="small"
                                    >
                                        Add Medication
                                    </Button>
                                </Box>

                                {medications.length === 0 ? (
                                    <Alert severity="info">
                                        Click "Add Medication" to start prescribing
                                    </Alert>
                                ) : (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Medicine Name</TableCell>
                                                    <TableCell>Dose</TableCell>
                                                    <TableCell>Route</TableCell>
                                                    <TableCell>Frequency</TableCell>
                                                    <TableCell>Timing</TableCell>
                                                    <TableCell>Duration</TableCell>
                                                    <TableCell>Qty</TableCell>
                                                    <TableCell>Instructions</TableCell>
                                                    <TableCell>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {medications.map((med) => (
                                                    <TableRow key={med.id}>
                                                        <TableCell>
                                                            <Autocomplete
                                                                size="small"
                                                                options={COMMON_MEDICATIONS}
                                                                getOptionLabel={(option) => option.name}
                                                                value={COMMON_MEDICATIONS.find(m => m.name === med.name) || null}
                                                                onChange={(e, value) => handleMedicationSelect(med.id, value)}
                                                                freeSolo
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        placeholder="Medicine name"
                                                                        value={med.name}
                                                                        onChange={(e) => handleUpdateMedication(med.id, 'name', e.target.value)}
                                                                        sx={{ minWidth: 150 }}
                                                                    />
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                value={med.dose}
                                                                onChange={(e) => handleUpdateMedication(med.id, 'dose', e.target.value)}
                                                                placeholder="500mg"
                                                                sx={{ width: 80 }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select
                                                                size="small"
                                                                value={med.route}
                                                                onChange={(e) => handleUpdateMedication(med.id, 'route', e.target.value)}
                                                                sx={{ width: 100 }}
                                                            >
                                                                {ROUTE_OPTIONS.map(route => (
                                                                    <MenuItem key={route} value={route}>{route}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select
                                                                size="small"
                                                                value={med.frequency}
                                                                onChange={(e) => handleUpdateMedication(med.id, 'frequency', e.target.value)}
                                                                sx={{ width: 80 }}
                                                            >
                                                                {FREQUENCY_OPTIONS.map(freq => (
                                                                    <MenuItem key={freq.value} value={freq.value}>{freq.value}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select
                                                                size="small"
                                                                value={med.timing}
                                                                onChange={(e) => handleUpdateMedication(med.id, 'timing', e.target.value)}
                                                                sx={{ width: 120 }}
                                                            >
                                                                {TIMING_OPTIONS.map(timing => (
                                                                    <MenuItem key={timing} value={timing}>{timing}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                value={med.duration}
                                                                onChange={(e) => handleUpdateMedication(med.id, 'duration', e.target.value)}
                                                                placeholder="5 days"
                                                                sx={{ width: 80 }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                type="number"
                                                                value={med.quantity}
                                                                onChange={(e) => handleUpdateMedication(med.id, 'quantity', e.target.value)}
                                                                placeholder="10"
                                                                sx={{ width: 60 }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                value={med.instructions}
                                                                onChange={(e) => handleUpdateMedication(med.id, 'instructions', e.target.value)}
                                                                placeholder="Special instructions"
                                                                sx={{ width: 150 }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDeleteMedication(med.id)}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Investigations & Advice */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Investigations
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Enter investigations (one per line)"
                                    value={investigations}
                                    onChange={(e) => setInvestigations(e.target.value)}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Advice & Instructions
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Enter advice (one per line)"
                                    value={advice}
                                    onChange={(e) => setAdvice(e.target.value)}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Follow-up */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Follow-up
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Next Visit Date"
                                    value={followUpDate}
                                    onChange={(e) => setFollowUpDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Preview Dialog */}
            <Dialog
                open={showPreview}
                onClose={() => setShowPreview(false)}
                maxWidth="md"
                fullWidth
            >
                {/* Print Styles */}
                <style>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #prescription-print-area, #prescription-print-area * {
                            visibility: visible;
                        }
                        #prescription-print-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            background: white;
                            padding: 20px;
                            margin: 0;
                        }
                        /* Hide dialog UI */
                        .MuiDialog-container {
                            display: block !important; 
                        }
                        .MuiPaper-root {
                            box-shadow: none !important;
                            max-width: none !important;
                            max-height: none !important;
                        }
                    }
                `}</style>

                <DialogTitle sx={{ displayPrint: 'none' }}>
                    Prescription Preview
                    <IconButton
                        onClick={() => setShowPreview(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ bgcolor: 'grey.100', p: 3 }}>
                    <Paper sx={{ p: 4 }} id="prescription-print-area">
                        <PrescriptionPreview
                            data={previewData}
                            doctor={doctorDetails}
                            clinicInfo={hospitalDetails}
                            template={{
                                styling: {
                                    primaryColor: '#1976d2',
                                    fontFamily: 'Arial, sans-serif',
                                },
                                sections: [
                                    { id: 'header', type: 'header', enabled: true, order: 0 },
                                    { id: 'patient', type: 'patient-info', enabled: true, order: 1 },
                                    { id: 'vitals', type: 'vitals', title: 'Vitals', enabled: true, order: 2 },
                                    { id: 'diagnosis', type: 'diagnosis', title: 'Diagnosis', enabled: true, order: 3 },
                                    { id: 'meds', type: 'medications', title: 'Medications', enabled: true, order: 4 },
                                    { id: 'tests', type: 'investigations', title: 'Investigations', enabled: true, order: 5 },
                                    { id: 'advice', type: 'advice', title: 'Advice', enabled: true, order: 6 },
                                    { id: 'followup', type: 'follow-up', title: 'Follow-up', enabled: true, order: 7 },
                                    { id: 'signature', type: 'signature', enabled: true, order: 8 },
                                ]
                            }}
                        />
                    </Paper>
                </DialogContent>
                <DialogActions sx={{ displayPrint: 'none' }}>
                    <Button
                        onClick={() => {
                            setMedications([]);
                            setDiagnosis('');
                            setInvestigations('');
                            setAdvice('');
                            setFollowUpDate('');
                            setShowPreview(false);
                        }}
                    >
                        Start New
                    </Button>
                    <Button startIcon={<PrintIcon />} variant="contained" onClick={() => window.print()}>
                        Print / Save PDF
                    </Button>
                    <Button onClick={() => setShowPreview(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// Helper function to calculate age
const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export default PrescriptionCreator;
