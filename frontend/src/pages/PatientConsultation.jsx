// src/pages/PatientConsultation.jsx
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Chip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { v4 as uuidv4 } from 'uuid';

import usePatientStore from '../core/store/usePatientStore';
import useTemplateStore from '../core/store/useTemplateStore';
import FormRenderer from '../components/FormRenderer/FormRenderer';
// import MedicationGrid from '../components/PrescriptionBuilder/MedicationGrid';
// Temporary mock to prevent crashes if the real component is broken or causing issues
const MedicationGrid = () => <Box p={2} bgcolor="warning.light">Medication Grid Component Unavailable</Box>;
import { usePDF } from '../hooks/usePDF';
import { useAdapta } from '../context/AdaptaContext';

const PatientConsultation = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { printPrescription } = usePDF();
  const { currentUser, clinicInfo } = useAdapta();

  const {
    patients,
    addPatient,
    addVisit,
    addPrescription,
    getVisitsByPatient,
    getPrescriptionsByPatient,
  } = usePatientStore();

  const {
    fetchSpecialties,
    fetchDepartmentTemplates,
    fetchVitals,
    fetchMetadata,
    remoteTemplates,
    specialties,
    vitals,
    medicationRoutes,
    frequencies,
    loading: templatesLoading,
  } = useTemplateStore();

  // State
  const [selectedPatientId, setSelectedPatientId] = useState(patientId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPatientDialog, setShowNewPatientDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [consultationData, setConsultationData] = useState({
    chiefComplaint: '',
    vitals: {},
    diagnosis: '',
    medications: [],
    investigations: [],
    advice: '',
    followUpDate: '',
    notes: '',
  });

  // Missing state variables
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [savedPrescriptionId, setSavedPrescriptionId] = useState(null);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    allergies: [],
  });

  // Fetch all dynamic data on mount
  React.useEffect(() => {
    const init = async () => {
      await fetchSpecialties();
      await fetchVitals();
      await fetchMetadata();

      // Auto-select first specialty if available
      const results = await fetchSpecialties();
      if (results && results.length > 0) {
        setSelectedDepartment(results[0]);
      }
    };
    init();
  }, []);

  // Fetch template when department changes
  React.useEffect(() => {
    if (selectedDepartment) {
      fetchDepartmentTemplates(selectedDepartment);
    }
  }, [selectedDepartment, fetchDepartmentTemplates]);

  // Get patient history
  const patientHistory = useMemo(() => {
    if (!selectedPatientId) return { visits: [], prescriptions: [] };
    return {
      visits: getVisitsByPatient(selectedPatientId),
      prescriptions: getPrescriptionsByPatient(selectedPatientId),
    };
  }, [selectedPatientId, getVisitsByPatient, getPrescriptionsByPatient]);

  // Auto-select department based on patient history
  React.useEffect(() => {
    if (selectedPatientId && patientHistory.visits.length > 0) {
      const lastVisit = patientHistory.visits[0];
      if (lastVisit.department && specialties.includes(lastVisit.department)) {
        setSelectedDepartment(lastVisit.department);
      }
    }
  }, [selectedPatientId, patientHistory, specialties]);

  // Combined context for rule engine and field renderers
  const evaluationContext = useMemo(() => ({
    patient: selectedPatientId ? patients[selectedPatientId] : null,
    vitals,
    medicationRoutes,
    frequencies,
    currentUser,
    clinicInfo,
    systemConfig: {
      isEmergency: isEmergencyMode
    }
  }), [selectedPatientId, patients, vitals, medicationRoutes, frequencies, currentUser, clinicInfo, isEmergencyMode]);

  // Get selected patient
  const selectedPatient = useMemo(() => {
    return selectedPatientId ? patients[selectedPatientId] : null;
  }, [selectedPatientId, patients]);

  // Filter patients by search
  const filteredPatients = useMemo(() => {
    if (!searchQuery) return Object.values(patients).slice(0, 10);
    const query = searchQuery.toLowerCase();
    return Object.values(patients).filter(
      p =>
        p.firstName?.toLowerCase().includes(query) ||
        p.lastName?.toLowerCase().includes(query) ||
        p.phone?.includes(query)
    );
  }, [patients, searchQuery]);

  // Consultation steps
  const steps = ['Select Patient', 'Patient Info', 'Consultation', 'Prescription', 'Review & Print'];

  // Handle new patient
  const handleAddPatient = () => {
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.phone) {
      return;
    }
    const id = addPatient(newPatient);
    setSelectedPatientId(id);
    setShowNewPatientDialog(false);
    setNewPatient({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      email: '',
      allergies: [],
    });
    setActiveStep(1);
  };

  // Handle save prescription
  const handleSavePrescription = () => {
    if (!selectedPatientId) return;

    // Create visit
    const visitId = addVisit({
      patientId: selectedPatientId,
      doctorId: currentUser?.id,
      type: 'consultation',
      department: specialties.find(d => d.id === selectedDepartment)?.name || 'General',
      date: new Date().toISOString(),
      time: new Date().toTimeString().slice(0, 5),
      status: 'completed',
      chiefComplaint: consultationData.chiefComplaint,
      vitals: consultationData.vitals,
      formData: consultationData,
    });

    // Create prescription
    const prescriptionId = addPrescription({
      templateId: null,
      patientId: selectedPatientId,
      doctorId: currentUser?.id,
      visitId,
      date: new Date().toISOString(),
      diagnosis: consultationData.diagnosis ? [consultationData.diagnosis] : [],
      medications: consultationData.medications,
      investigations: consultationData.investigations,
      advice: consultationData.advice ? consultationData.advice.split('\n').filter(a => a.trim()) : [],
      followUpDate: consultationData.followUpDate,
      notes: consultationData.notes,
      vitals: consultationData.vitals,
    });

    setSavedPrescriptionId(prescriptionId);
    setActiveStep(4);
  };

  // Handle print
  const handlePrint = () => {
    if (!selectedPatient) return;

    printPrescription(
      {
        ...consultationData,
        diagnosis: consultationData.diagnosis ? [consultationData.diagnosis] : [],
        advice: consultationData.advice ? consultationData.advice.split('\n').filter(a => a.trim()) : [],
      },
      selectedPatient,
      currentUser,
      clinicInfo
    );
  };

  // Calculate age
  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // Start new consultation
  const handleNewConsultation = () => {
    setSelectedPatientId(null);
    setConsultationData({
      chiefComplaint: '',
      vitals: {},
      diagnosis: '',
      medications: [],
      investigations: [],
      advice: '',
      followUpDate: '',
      notes: '',
    });
    setSavedPrescriptionId(null);
    setActiveStep(0);
    setIsEmergencyMode(false);
  };

  const handleFormChange = (formData) => {
    setConsultationData(prev => ({
      ...prev,
      ...formData
    }));
  };

  // Dynamic Consultation Template
  const consultationTemplate = useMemo(() => {
    const baseTemplate = remoteTemplates[0] || { sections: [] };

    // Merge or apply rules to the selected department template
    return {
      ...baseTemplate,
      sections: (baseTemplate.sections || []).map(section => {
        // Apply pregnancy rules specifically if it's gynae or has those fields
        if (section.id === 'obstetricHistory' || section.id === 'clinicalExamination') {
          return {
            ...section,
            fields: section.fields.map(field => {
              if (field.id === 'pregnancyStatus') {
                return {
                  ...field,
                  visibilityRules: [
                    { action: 'show', conditions: [{ field: 'patient.gender', operator: 'equals', value: 'female' }] },
                    { action: 'hide', conditions: [{ field: 'patient.gender', operator: 'notEquals', value: 'female' }] },
                    { action: 'hide', conditions: [{ field: 'emergencyMode', operator: 'equals', value: true }] }
                  ]
                };
              }
              if (field.id === 'lmp') {
                return {
                  ...field,
                  visibilityRules: [
                    { action: 'show', conditions: [{ field: 'pregnancyStatus', operator: 'equals', value: 'Pregnant' }] },
                    { action: 'hide', conditions: [{ field: 'pregnancyStatus', operator: 'notEquals', value: 'Pregnant' }] }
                  ]
                };
              }
              return field;
            })
          };
        }
        return section;
      })
    };
  }, [remoteTemplates, isEmergencyMode]);

  const prescriptionTemplate = useMemo(() => {
    return {
      sections: [
        {
          id: 'medicationsSection',
          title: 'Prescribed Medications',
          fields: [
            {
              id: 'medications',
              label: 'Medications',
              type: 'medications',
              width: 'full'
            }
          ]
        },
        {
          id: 'investigationsSection',
          title: 'Investigations & Advice',
          fields: [
            {
              id: 'investigations',
              label: 'Investigations',
              type: 'investigations',
              width: 'half'
            },
            {
              id: 'advice',
              label: 'Clinical Advice',
              type: 'textarea',
              width: 'half',
              rows: 6
            },
            {
              id: 'followUpDate',
              label: 'Follow-up Date',
              type: 'date',
              width: 'half'
            }
          ]
        }
      ]
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <LocalHospitalIcon sx={{ ml: 1, mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Patient Consultation
          </Typography>
          {selectedPatient && (
            <Chip
              avatar={<Avatar>{selectedPatient.firstName?.[0]}</Avatar>}
              label={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
              color="default"
              sx={{ bgcolor: 'white' }}
            />
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Stepper */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={activeStep > index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Step 0: Select Patient */}
        {activeStep === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select or Register Patient
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Search patients by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{ mb: 2 }}
                />

                <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <List>
                    {filteredPatients.map((patient, index) => (
                      <React.Fragment key={patient.id}>
                        {index > 0 && <Divider />}
                        <ListItem
                          button
                          selected={selectedPatientId === patient.id}
                          onClick={() => {
                            setSelectedPatientId(patient.id);
                            setActiveStep(1);
                          }}
                          sx={{
                            '&.Mui-selected': {
                              bgcolor: 'primary.50',
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              mr: 2,
                              bgcolor: patient.gender === 'female' ? '#e91e63' : '#1976d2',
                            }}
                          >
                            {patient.firstName?.[0]}
                          </Avatar>
                          <ListItemText
                            primary={`${patient.firstName} ${patient.lastName}`}
                            secondary={
                              <span>
                                {patient.gender} • {patient.phone} • Age:{' '}
                                {calculateAge(patient.dateOfBirth) || 'N/A'}
                                {patient.allergies?.length > 0 && (
                                  <Chip
                                    label={`${patient.allergies.length} allergies`}
                                    size="small"
                                    color="warning"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </span>
                            }
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>

                  {filteredPatients.length === 0 && (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography color="text.secondary">
                        No patients found. Register a new patient.
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <PersonAddIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      New Patient?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Register a new patient to start consultation
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PersonAddIcon />}
                      onClick={() => setShowNewPatientDialog(true)}
                    >
                      Register Patient
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Step 1: Patient Info */}
        {activeStep === 1 && selectedPatient && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Patient Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Demographics
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Age
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {calculateAge(selectedPatient.dateOfBirth) || 'N/A'} years
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Gender
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedPatient.gender}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedPatient.phone}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedPatient.email || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {selectedPatient.allergies?.length > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }} icon={false}>
                    <Typography variant="subtitle2" gutterBottom>
                      ⚠️ Known Allergies
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedPatient.allergies.map((allergy, i) => (
                        <Chip key={i} label={allergy} color="warning" size="small" />
                      ))}
                    </Box>
                  </Alert>
                )}

                {selectedPatient.medicalHistory?.length > 0 && (
                  <Card sx={{ mt: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Medical History
                      </Typography>
                      <Divider sx={{ mb: 1 }} />
                      <List dense>
                        {selectedPatient.medicalHistory.map((item, i) => (
                          <ListItem key={i} disableGutters>
                            <ListItemText
                              primary={item.condition}
                              secondary={`Status: ${item.status}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Visit History ({patientHistory.visits.length} visits)
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    {patientHistory.visits.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        No previous visits recorded
                      </Typography>
                    ) : (
                      <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {patientHistory.visits.slice(0, 10).map((visit) => (
                          <ListItem key={visit.id} divider>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">
                                    {new Date(visit.date).toLocaleDateString()}
                                  </Typography>
                                  <Chip
                                    label={visit.type}
                                    size="small"
                                    variant="outlined"
                                  />
                                </Box>
                              }
                              secondary={visit.chiefComplaint || 'General consultation'}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setActiveStep(0)}>Back</Button>
              <Button variant="contained" onClick={() => setActiveStep(2)}>
                Continue to Consultation
              </Button>
            </Box>
          </Paper>
        )}

        {/* Step 2: Consultation */}
        {activeStep === 2 && selectedPatient && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Consultation
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Consultation
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={isEmergencyMode}
                    onChange={(e) => setIsEmergencyMode(e.target.checked)}
                    color="error"
                  />
                }
                label={
                  <Typography color={isEmergencyMode ? 'error' : 'textSecondary'} fontWeight="bold">
                    Emergency Mode
                  </Typography>
                }
              />
            </Box>

            {isEmergencyMode && (
              <Alert severity="error" sx={{ mb: 2 }}>
                EMERGENCY MODE ACTIVE: Only critical fields are shown. Examination notes and non-essential history are hidden.
              </Alert>
            )}

            {/* Department Template Selector */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.light' }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                    Multi-Specialty LCNC Engine
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    The doctor can switch between different department templates dynamically. Each template loads its own custom fields and rules.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Switch Department Template</InputLabel>
                    <Select
                      value={selectedDepartment}
                      label="Switch Department Template"
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      sx={{ bgcolor: 'white' }}
                    >
                      {specialties.map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            <FormRenderer
              template={consultationTemplate}
              initialData={{
                ...consultationData,
                ...consultationData.vitals
              }}
              context={{
                patient: selectedPatient,
                emergencyMode: isEmergencyMode
              }}
              onChange={handleFormChange}
              showSubmit={false}
              showSave={false}
            />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setActiveStep(1)}>Back</Button>
              <Button variant="contained" onClick={() => setActiveStep(3)}>
                Continue to Prescription
              </Button>
            </Box>
          </Paper>
        )}

        {/* Step 3: Prescription */}
        {activeStep === 3 && selectedPatient && (
          <Paper sx={{ p: 3 }}>
            <FormRenderer
              template={prescriptionTemplate}
              initialData={consultationData}
              context={{
                patient: selectedPatient,
                vitals: consultationData.vitals
              }}
              onChange={handleFormChange}
              showSubmit={false}
              showSave={false}
            />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setActiveStep(2)}>Back</Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSavePrescription}
              >
                Save & Continue
              </Button>
            </Box>
          </Paper>
        )}

        {/* Step 4: Review & Print */}
        {activeStep === 4 && selectedPatient && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Consultation Saved Successfully!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                The prescription has been saved and is ready to print.
              </Typography>
            </Box>

            {/* Prescription Summary */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Prescription Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Patient
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedPatient.firstName} {selectedPatient.lastName} (
                      {calculateAge(selectedPatient.dateOfBirth)} yrs, {selectedPatient.gender})
                    </Typography>

                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                      Diagnosis
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {consultationData.diagnosis || 'Not specified'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {new Date().toLocaleDateString()}
                    </Typography>

                    {consultationData.followUpDate && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                          Follow-up Date
                        </Typography>
                        <Typography variant="body1">
                          {new Date(consultationData.followUpDate).toLocaleDateString()}
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Grid>

                {/* Medications Summary */}
                {consultationData.medications.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Medications ({consultationData.medications.length})
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell>Medicine</TableCell>
                            <TableCell>Dose</TableCell>
                            <TableCell>Frequency</TableCell>
                            <TableCell>Duration</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {consultationData.medications.map((med, index) => (
                            <TableRow key={index}>
                              <TableCell>{med.name}</TableCell>
                              <TableCell>{med.dose}</TableCell>
                              <TableCell>{med.frequency}</TableCell>
                              <TableCell>{med.duration}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Investigations */}
                {consultationData.investigations.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Investigations
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {consultationData.investigations.map((inv, i) => (
                        <Chip key={i} label={inv} variant="outlined" size="small" />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
              >
                Print Prescription
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleNewConsultation}
              >
                New Consultation
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/')}
              >
                Go to Dashboard
              </Button>
            </Box>
          </Paper>
        )}
      </Container>

      {/* New Patient Dialog */}
      <Dialog
        open={showNewPatientDialog}
        onClose={() => setShowNewPatientDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Register New Patient</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={newPatient.firstName}
                onChange={(e) =>
                  setNewPatient((prev) => ({ ...prev, firstName: e.target.value }))
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={newPatient.lastName}
                onChange={(e) =>
                  setNewPatient((prev) => ({ ...prev, lastName: e.target.value }))
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                value={newPatient.dateOfBirth}
                onChange={(e) =>
                  setNewPatient((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={newPatient.gender}
                  label="Gender"
                  onChange={(e) =>
                    setNewPatient((prev) => ({ ...prev, gender: e.target.value }))
                  }
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newPatient.phone}
                onChange={(e) =>
                  setNewPatient((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newPatient.email}
                onChange={(e) =>
                  setNewPatient((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Known Allergies"
                placeholder="Enter allergies separated by commas"
                value={newPatient.allergies?.join(', ') || ''}
                onChange={(e) =>
                  setNewPatient((prev) => ({
                    ...prev,
                    allergies: e.target.value
                      .split(',')
                      .map((a) => a.trim())
                      .filter((a) => a),
                  }))
                }
                helperText="e.g., Penicillin, Sulfa, Aspirin"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewPatientDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddPatient}
            variant="contained"
            disabled={!newPatient.firstName || !newPatient.lastName || !newPatient.phone}
          >
            Register Patient
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientConsultation;