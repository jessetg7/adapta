import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Chip,
  Stack,
  Alert,
  Autocomplete,
  Box,
  Divider,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  MedicalServices as MedIcon,
  Warning as WarningIcon,
  Calculate as CalculateIcon,
  LocalHospital as EmergencyIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useMedication } from '../../context/MedicationContext';

export default function MedicationModal({ open, onClose, editMedication = null }) {
  const {
    getMedicationDatabase,
    getCategories,
    addMedication,
    updateMedication,
    checkAllergyConflict,
    calculateDose,
    patientWeight
  } = useMedication();

  // Form state
  const [selectedMed, setSelectedMed] = useState(null);
  const [formData, setFormData] = useState({
    dose: '',
    route: '',
    frequency: '',
    notes: ''
  });
  const [allergyWarning, setAllergyWarning] = useState(null);
  const [calculatedDose, setCalculatedDose] = useState(null);
  const [errors, setErrors] = useState({});

  // Get medications from database
  const medications = getMedicationDatabase();
  const categories = getCategories();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      if (editMedication) {
        // Editing existing medication
        const med = medications.find(m => m.id === editMedication.medicationId);
        setSelectedMed(med || null);
        setFormData({
          dose: editMedication.dose || '',
          route: editMedication.route || '',
          frequency: editMedication.frequency || '',
          notes: editMedication.notes || ''
        });
      } else {
        // New medication - reset form
        setSelectedMed(null);
        setFormData({
          dose: '',
          route: '',
          frequency: '',
          notes: ''
        });
      }
      setAllergyWarning(null);
      setCalculatedDose(null);
      setErrors({});
    }
  }, [open, editMedication, medications]);

  // Check allergy and auto-fill when medication is selected
  useEffect(() => {
    if (selectedMed) {
      // Check for allergies
      const check = checkAllergyConflict(selectedMed);
      setAllergyWarning(check.hasConflict ? check.warnings : null);

      // Auto-fill defaults if not editing
      if (!editMedication) {
        setFormData(prev => ({
          ...prev,
          route: prev.route || selectedMed.routes[0] || '',
          frequency: prev.frequency || selectedMed.frequency || '',
          dose: prev.dose || selectedMed.standardDose || ''
        }));
      }

      // Calculate dose if weight-based and weight is available
      if (selectedMed.weightBased && patientWeight) {
        const doseInfo = calculateDose(selectedMed, patientWeight);
        setCalculatedDose(doseInfo);
      } else {
        setCalculatedDose(null);
      }
    } else {
      setAllergyWarning(null);
      setCalculatedDose(null);
    }
  }, [selectedMed, checkAllergyConflict, calculateDose, patientWeight, editMedication]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!selectedMed) {
      newErrors.medication = 'Please select a medication';
    }
    if (!formData.dose.trim()) {
      newErrors.dose = 'Dose is required';
    }
    if (!formData.route) {
      newErrors.route = 'Route is required';
    }
    if (!formData.frequency) {
      newErrors.frequency = 'Frequency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editMedication) {
      // Update existing medication
      updateMedication(editMedication.id, {
        dose: formData.dose,
        route: formData.route,
        frequency: formData.frequency,
        notes: formData.notes
      });
    } else {
      // Add new medication
      addMedication(
        selectedMed.id,
        formData.dose,
        formData.route,
        formData.frequency,
        formData.notes
      );
    }

    onClose();
  };

  // Use calculated dose
  const handleUseCalculatedDose = () => {
    if (calculatedDose && calculatedDose.calculated) {
      setFormData(prev => ({ ...prev, dose: calculatedDose.dose }));
    }
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      {/* Dialog Title */}
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          bgcolor: editMedication ? 'primary.50' : 'success.50',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <MedIcon color={editMedication ? 'primary' : 'success'} />
        <Typography variant="h6">
          {editMedication ? 'Edit Medication' : 'Add New Medication'}
        </Typography>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2.5}>
          
          {/* Medication Selection */}
          <Grid item xs={12}>
            <Autocomplete
              options={medications}
              groupBy={(option) => option.category}
              getOptionLabel={(option) => option.name}
              value={selectedMed}
              onChange={(event, newValue) => {
                setSelectedMed(newValue);
                if (errors.medication) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.medication;
                    return newErrors;
                  });
                }
              }}
              disabled={!!editMedication}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.id}>
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={1.5} 
                    sx={{ width: '100%' }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: option.color || 'grey.400',
                        flexShrink: 0
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.standardDose} • {option.routes.join(', ')}
                      </Typography>
                    </Box>
                    {option.emergency && (
                      <Chip 
                        icon={<EmergencyIcon />}
                        label="Emergency" 
                        size="small" 
                        color="error"
                        sx={{ height: 24 }}
                      />
                    )}
                  </Stack>
                </Box>
              )}
              renderGroup={(params) => (
                <Box key={params.key}>
                  <Typography
                    variant="overline"
                    sx={{
                      px: 2,
                      py: 1,
                      display: 'block',
                      bgcolor: 'grey.100',
                      fontWeight: 'bold',
                      color: 'text.secondary'
                    }}
                  >
                    {params.group}
                  </Typography>
                  {params.children}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Medication *"
                  placeholder="Search by name..."
                  error={!!errors.medication}
                  helperText={errors.medication}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <MedIcon color="action" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Grid>

          {/* Allergy Warning Alert */}
          {allergyWarning && allergyWarning.length > 0 && (
            <Grid item xs={12}>
              <Alert 
                severity="error" 
                icon={<WarningIcon />}
                sx={{ 
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  ⚠️ ALLERGY / CONTRAINDICATION ALERT
                </Typography>
                {allergyWarning.map((warning, idx) => (
                  <Typography key={idx} variant="body2" sx={{ mt: 0.5 }}>
                    • <strong>{warning.type}:</strong> {warning.message}
                  </Typography>
                ))}
                <Typography variant="caption" color="error.dark" sx={{ mt: 1, display: 'block' }}>
                  Proceed with extreme caution. Document reason if administering.
                </Typography>
              </Alert>
            </Grid>
          )}

          {/* Selected Medication Info Card */}
          {selectedMed && (
            <Grid item xs={12}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50',
                  borderColor: selectedMed.color || 'grey.300'
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Medication Details
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={selectedMed.category}
                    size="small"
                    sx={{ 
                      bgcolor: selectedMed.color || 'grey.500', 
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  <Chip
                    label={`Standard: ${selectedMed.standardDose}`}
                    size="small"
                    variant="outlined"
                  />
                  {selectedMed.maxDose && (
                    <Chip
                      label={`Max: ${selectedMed.maxDose} ${selectedMed.unit}`}
                      size="small"
                      variant="outlined"
                      color="warning"
                    />
                  )}
                  {selectedMed.weightBased && (
                    <Chip
                      icon={<CalculateIcon />}
                      label={`${selectedMed.dosePerKg} ${selectedMed.unit}/kg`}
                      size="small"
                      color="info"
                    />
                  )}
                  {selectedMed.emergency && (
                    <Chip
                      icon={<EmergencyIcon />}
                      label="Emergency Drug"
                      size="small"
                      color="error"
                    />
                  )}
                </Stack>
                
                {/* Contraindications */}
                {selectedMed.contraindications?.length > 0 && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Contraindications:
                    </Typography>
                    <Typography variant="caption" color="warning.dark" display="block">
                      {selectedMed.contraindications.join(', ')}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          )}

          {/* Calculated Dose Alert (for weight-based medications) */}
          {calculatedDose && calculatedDose.calculated && (
            <Grid item xs={12}>
              <Alert
                severity="info"
                icon={<CalculateIcon />}
                action={
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={handleUseCalculatedDose}
                  >
                    Use This Dose
                  </Button>
                }
              >
                <Typography variant="subtitle2">
                  Weight-Based Calculated Dose:
                </Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  {calculatedDose.dose}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Formula: {calculatedDose.formula}
                  {calculatedDose.cappedAtMax && (
                    <Chip 
                      label={`Capped at max: ${calculatedDose.maxDose}`} 
                      size="small" 
                      color="warning"
                      sx={{ ml: 1, height: 20 }}
                    />
                  )}
                </Typography>
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Dose Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dose *"
              value={formData.dose}
              onChange={(e) => handleFieldChange('dose', e.target.value)}
              placeholder="e.g., 500 mg, 2 ml"
              error={!!errors.dose}
              helperText={errors.dose || 'Enter dose with unit'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="caption" color="text.secondary">Rx</Typography>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Route Field */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.route}>
              <InputLabel>Route *</InputLabel>
              <Select
                value={formData.route}
                label="Route *"
                onChange={(e) => handleFieldChange('route', e.target.value)}
              >
                {selectedMed?.routes ? (
                  selectedMed.routes.map((route) => (
                    <MenuItem key={route} value={route}>
                      {route}
                    </MenuItem>
                  ))
                ) : (
                  // Default routes if no medication selected
                  <>
                    <MenuItem value="Oral">Oral</MenuItem>
                    <MenuItem value="IV">IV (Intravenous)</MenuItem>
                    <MenuItem value="IM">IM (Intramuscular)</MenuItem>
                    <MenuItem value="SC">SC (Subcutaneous)</MenuItem>
                    <MenuItem value="SL">SL (Sublingual)</MenuItem>
                    <MenuItem value="Inhalation">Inhalation</MenuItem>
                    <MenuItem value="Topical">Topical</MenuItem>
                    <MenuItem value="Rectal">Rectal</MenuItem>
                    <MenuItem value="Nasal">Nasal</MenuItem>
                    <MenuItem value="Ophthalmic">Ophthalmic (Eye)</MenuItem>
                    <MenuItem value="Otic">Otic (Ear)</MenuItem>
                  </>
                )}
              </Select>
              {errors.route && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.route}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Frequency Field */}
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.frequency}>
              <InputLabel>Frequency *</InputLabel>
              <Select
                value={formData.frequency}
                label="Frequency *"
                onChange={(e) => handleFieldChange('frequency', e.target.value)}
              >
                <MenuItem value="STAT">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip label="STAT" size="small" color="error" />
                    <Typography variant="body2">Immediately / Once Now</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="Once">Once Only</MenuItem>
                <Divider />
                <MenuItem value="Q1H">Q1H - Every 1 hour</MenuItem>
                <MenuItem value="Q2H">Q2H - Every 2 hours</MenuItem>
                <MenuItem value="Q4H">Q4H - Every 4 hours</MenuItem>
                <MenuItem value="Q6H">Q6H - Every 6 hours</MenuItem>
                <MenuItem value="Q8H">Q8H - Every 8 hours</MenuItem>
                <MenuItem value="Q12H">Q12H - Every 12 hours</MenuItem>
                <MenuItem value="Q24H">Q24H - Once daily</MenuItem>
                <Divider />
                <MenuItem value="OD">OD - Once daily (morning)</MenuItem>
                <MenuItem value="BD">BD - Twice daily</MenuItem>
                <MenuItem value="TDS">TDS - Three times daily</MenuItem>
                <MenuItem value="QID">QID - Four times daily</MenuItem>
                <Divider />
                <MenuItem value="PRN">PRN - As needed</MenuItem>
                <MenuItem value="AC">AC - Before meals</MenuItem>
                <MenuItem value="PC">PC - After meals</MenuItem>
                <MenuItem value="HS">HS - At bedtime</MenuItem>
                <Divider />
                <MenuItem value="Continuous">Continuous infusion</MenuItem>
              </Select>
              {errors.frequency && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.frequency}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Notes Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Notes / Special Instructions"
              value={formData.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              placeholder="e.g., Give with food, monitor vitals after administration, dilute in 100ml NS..."
              helperText="Optional: Add any special instructions or notes"
            />
          </Grid>

          {/* Info Box */}
          {!editMedication && (
            <Grid item xs={12}>
              <Alert severity="info" icon={<InfoIcon />}>
                <Typography variant="caption">
                  Medication will be added with status <strong>"Ordered"</strong>. 
                  Use the "Administer" action in the medication grid to mark it as given.
                </Typography>
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
        <Button 
          onClick={onClose}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedMed}
          color={allergyWarning ? 'warning' : 'primary'}
          startIcon={allergyWarning ? <WarningIcon /> : <MedIcon />}
        >
          {allergyWarning 
            ? 'Add with Caution' 
            : (editMedication ? 'Update Medication' : 'Add Medication')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
}