import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Chip,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Collapse,
  LinearProgress
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  LocalHospital as HospitalIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useEmergency } from '../../context/EmergencyContext';

export default function TriageCalculator({ onTriageComplete, initialVitals = {} }) {
  const { calculateTriageLevel, setTriageLevel, activateEmergencyMode, triageLevel } = useEmergency();
  
  const [vitals, setVitals] = useState({
    systolicBP: initialVitals.systolicBP || '',
    diastolicBP: initialVitals.diastolicBP || '',
    heartRate: initialVitals.heartRate || '',
    oxygenSaturation: initialVitals.oxygenSaturation || '',
    temperature: initialVitals.temperature || '',
    respiratoryRate: initialVitals.respiratoryRate || '',
    consciousness: initialVitals.consciousness || 'alert'
  });
  
  const [showResults, setShowResults] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const handleVitalChange = (field) => (event) => {
    setVitals(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setShowResults(false);
  };

  const handleCalculate = () => {
    setCalculating(true);
    
    // Simulate calculation delay for UX
    setTimeout(() => {
      const numericVitals = {
        systolicBP: parseFloat(vitals.systolicBP) || 120,
        heartRate: parseFloat(vitals.heartRate) || 80,
        oxygenSaturation: parseFloat(vitals.oxygenSaturation) || 98,
        temperature: parseFloat(vitals.temperature) || 37,
        consciousness: vitals.consciousness
      };
      
      const result = calculateTriageLevel(numericVitals);
      setTriageLevel(result);
      setShowResults(true);
      setCalculating(false);
      
      // Auto-activate emergency mode if critical
      if (result.level <= 2) {
        activateEmergencyMode(`Triage Level: ${result.label}`);
      }
      
      if (onTriageComplete) {
        onTriageComplete(result);
      }
    }, 800);
  };

  const getProgressColor = () => {
    if (!triageLevel) return 'primary';
    if (triageLevel.level <= 2) return 'error';
    if (triageLevel.level <= 3) return 'warning';
    return 'success';
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <SpeedIcon color="primary" />
        <Typography variant="h6">Triage Assessment</Typography>
      </Stack>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Systolic BP (mmHg)"
            type="number"
            value={vitals.systolicBP}
            onChange={handleVitalChange('systolicBP')}
            placeholder="120"
            InputProps={{
              inputProps: { min: 0, max: 300 }
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Diastolic BP (mmHg)"
            type="number"
            value={vitals.diastolicBP}
            onChange={handleVitalChange('diastolicBP')}
            placeholder="80"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Heart Rate (bpm)"
            type="number"
            value={vitals.heartRate}
            onChange={handleVitalChange('heartRate')}
            placeholder="80"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Oxygen Saturation (%)"
            type="number"
            value={vitals.oxygenSaturation}
            onChange={handleVitalChange('oxygenSaturation')}
            placeholder="98"
            InputProps={{
              inputProps: { min: 0, max: 100 }
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Temperature (°C)"
            type="number"
            value={vitals.temperature}
            onChange={handleVitalChange('temperature')}
            placeholder="37.0"
            inputProps={{ step: 0.1 }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Respiratory Rate (/min)"
            type="number"
            value={vitals.respiratoryRate}
            onChange={handleVitalChange('respiratoryRate')}
            placeholder="16"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Consciousness Level</InputLabel>
            <Select
              value={vitals.consciousness}
              label="Consciousness Level"
              onChange={handleVitalChange('consciousness')}
            >
              <MenuItem value="alert">Alert & Oriented</MenuItem>
              <MenuItem value="verbal">Responds to Verbal</MenuItem>
              <MenuItem value="pain">Responds to Pain</MenuItem>
              <MenuItem value="drowsy">Drowsy/Confused</MenuItem>
              <MenuItem value="confused">Confused/Disoriented</MenuItem>
              <MenuItem value="unresponsive">Unresponsive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleCalculate}
            disabled={calculating}
            startIcon={<CalculateIcon />}
            sx={{ height: '56px' }}
          >
            {calculating ? 'Calculating...' : 'Calculate Triage Level'}
          </Button>
        </Grid>
      </Grid>

      {calculating && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
        </Box>
      )}

      <Collapse in={showResults && triageLevel}>
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          
          <Paper
            sx={{
              p: 3,
              bgcolor: triageLevel?.color + '15',
              border: `2px solid ${triageLevel?.color}`
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Triage Level
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Chip
                    icon={triageLevel?.level <= 2 ? <WarningIcon /> : <CheckIcon />}
                    label={`Level ${triageLevel?.level}: ${triageLevel?.label}`}
                    sx={{
                      bgcolor: triageLevel?.color,
                      color: triageLevel?.level <= 2 ? 'white' : 'inherit',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      height: 40,
                      '& .MuiChip-label': { px: 2 }
                    }}
                  />
                  <Typography variant="body1" fontWeight="medium">
                    {triageLevel?.action}
                  </Typography>
                </Stack>
              </Box>
              
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary">
                  Severity Score
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={triageLevel?.color}>
                  {triageLevel?.score}/100
                </Typography>
              </Box>
            </Stack>

            {triageLevel?.reasons?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Critical Indicators:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {triageLevel.reasons.map((reason, idx) => (
                    <Chip
                      key={idx}
                      icon={<WarningIcon />}
                      label={reason}
                      color="error"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>

          {triageLevel?.level <= 2 && (
            <Alert severity="error" sx={{ mt: 2 }} icon={<HospitalIcon />}>
              <strong>IMMEDIATE ATTENTION REQUIRED</strong> - Emergency Mode has been automatically activated.
              Patient requires urgent medical intervention.
            </Alert>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}