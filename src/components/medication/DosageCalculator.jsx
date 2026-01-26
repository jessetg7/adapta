import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  ChildCare as ChildIcon
} from '@mui/icons-material';
import { useMedication } from '../../context/MedicationContext';

export default function DosageCalculator() {
  const { 
    getMedicationDatabase, 
    calculateDose, 
    patientWeight,
    setPatientWeight 
  } = useMedication();

  const [weight, setWeight] = useState(patientWeight || '');
  const [selectedMedId, setSelectedMedId] = useState('');
  const [result, setResult] = useState(null);

  const medications = getMedicationDatabase().filter(m => m.weightBased);

  const handleCalculate = () => {
    if (!weight || !selectedMedId) return;

    const med = medications.find(m => m.id === selectedMedId);
    if (!med) return;

    const doseInfo = calculateDose(med, parseFloat(weight));
    setResult({
      medication: med.name,
      ...doseInfo
    });

    // Update patient weight in context
    setPatientWeight(parseFloat(weight));
  };

  return (
    <Paper 
      sx={{ 
        p: 2, 
        bgcolor: 'primary.50', 
        border: '1px solid', 
        borderColor: 'primary.200' 
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <ChildIcon color="primary" />
        <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
          Pediatric / Weight-Based Dosage Calculator
        </Typography>
      </Stack>

      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            label="Patient Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              setResult(null);
            }}
            inputProps={{ min: 0, max: 200, step: 0.1 }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Medication</InputLabel>
            <Select
              value={selectedMedId}
              label="Medication"
              onChange={(e) => {
                setSelectedMedId(e.target.value);
                setResult(null);
              }}
            >
              {medications.map((med) => (
                <MenuItem key={med.id} value={med.id}>
                  {med.name} ({med.dosePerKg} {med.unit}/kg)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleCalculate}
            disabled={!weight || !selectedMedId}
            startIcon={<CalculateIcon />}
          >
            Calculate
          </Button>
        </Grid>
      </Grid>

      {result && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ my: 1 }} />
          <Alert severity="info" icon={false}>
            <Typography variant="subtitle2" gutterBottom>
              Calculated Dose for <strong>{result.medication}</strong>:
            </Typography>
            <Typography variant="h5" color="primary.main" fontWeight="bold">
              {result.dose}
            </Typography>
            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" useFlexGap>
              <Chip 
                label={`Formula: ${result.formula}`} 
                size="small" 
                variant="outlined" 
              />
              {result.cappedAtMax && (
                <Chip 
                  label={`Capped at max: ${result.maxDose}`} 
                  size="small" 
                  color="warning" 
                />
              )}
              {result.belowMin && (
                <Chip 
                  label="Using minimum dose" 
                  size="small" 
                  color="info" 
                />
              )}
            </Stack>
          </Alert>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        💡 Only weight-based medications are shown. Calculated doses respect min/max limits.
      </Typography>
    </Paper>
  );
}