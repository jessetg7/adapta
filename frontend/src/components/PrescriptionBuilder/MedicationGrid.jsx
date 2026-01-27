// src/components/PrescriptionBuilder/MedicationGrid.jsx
import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  Alert,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import { v4 as uuidv4 } from 'uuid';

import { medicationDatabase } from '../../data/medicationDatabase';

// Route options
const ROUTES = [
  { value: 'oral', label: 'Oral' },
  { value: 'iv', label: 'IV' },
  { value: 'im', label: 'IM' },
  { value: 'sc', label: 'SC' },
  { value: 'topical', label: 'Topical' },
  { value: 'inhalation', label: 'Inhalation' },
  { value: 'sublingual', label: 'Sublingual' },
  { value: 'rectal', label: 'Rectal' },
  { value: 'ophthalmic', label: 'Ophthalmic' },
  { value: 'otic', label: 'Otic' },
  { value: 'nasal', label: 'Nasal' },
];

// Frequency options
const FREQUENCIES = [
  { value: 'OD', label: 'Once daily (OD)' },
  { value: 'BD', label: 'Twice daily (BD)' },
  { value: 'TDS', label: 'Three times daily (TDS)' },
  { value: 'QID', label: 'Four times daily (QID)' },
  { value: 'Q4H', label: 'Every 4 hours' },
  { value: 'Q6H', label: 'Every 6 hours' },
  { value: 'Q8H', label: 'Every 8 hours' },
  { value: 'Q12H', label: 'Every 12 hours' },
  { value: 'PRN', label: 'As needed (PRN)' },
  { value: 'STAT', label: 'Immediately (STAT)' },
  { value: 'HS', label: 'At bedtime (HS)' },
  { value: 'AC', label: 'Before meals (AC)' },
  { value: 'PC', label: 'After meals (PC)' },
  { value: 'Weekly', label: 'Weekly' },
];

// Duration presets
const DURATIONS = [
  '3 days', '5 days', '7 days', '10 days', '14 days', '21 days', '1 month', '2 months', '3 months', 'Continuous'
];

/**
 * MedicationGrid - Enhanced medication entry component
 * Supports auto-complete, allergy warnings, pediatric dosing
 */
const MedicationGrid = ({
  value = [],
  onChange,
  disabled = false,
  patientAllergies = [],
  patientAge = null,
  patientWeight = null,
}) => {
  const [medications, setMedications] = useState(value);
  const [showDrugInfo, setShowDrugInfo] = useState(null);
  const [warnings, setWarnings] = useState([]);

  // Sync with external value
  React.useEffect(() => {
    setMedications(value);
  }, [value]);

  // Update parent
  const updateMedications = useCallback((newMeds) => {
    setMedications(newMeds);
    onChange?.(newMeds);
  }, [onChange]);

  // Add new medication
  const addMedication = useCallback(() => {
    const newMed = {
      id: uuidv4(),
      name: '',
      genericName: '',
      dose: '',
      route: 'oral',
      frequency: 'OD',
      duration: '5 days',
      timing: '',
      instructions: '',
      quantity: null,
    };
    updateMedications([...medications, newMed]);
  }, [medications, updateMedications]);

  // Update medication
  const updateMedication = useCallback((index, field, value) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };

    // If selecting from database, auto-fill defaults
    if (field === 'name') {
      const dbMed = medicationDatabase.find(m => m.name === value);
      if (dbMed) {
        updated[index] = {
          ...updated[index],
          genericName: dbMed.genericName,
          dose: dbMed.defaultDose,
          route: dbMed.defaultRoute,
          frequency: dbMed.defaultFrequency,
          duration: dbMed.defaultDuration,
        };

        // Check for allergies
        checkAllergies(dbMed, index);

        // Calculate pediatric dose if applicable
        if (patientAge && patientAge < 18 && patientWeight && dbMed.pediatricDosing) {
          const pedDose = calculatePediatricDose(dbMed.pediatricDosing, patientWeight);
          if (pedDose) {
            updated[index].dose = pedDose;
            updated[index].instructions = `Pediatric dose based on ${patientWeight}kg`;
          }
        }
      }
    }

    updateMedications(updated);
  }, [medications, updateMedications, patientAge, patientWeight, patientAllergies]);

  // Delete medication
  const deleteMedication = useCallback((index) => {
    updateMedications(medications.filter((_, i) => i !== index));
    // Remove any warnings for this index
    setWarnings(prev => prev.filter(w => w.index !== index));
  }, [medications, updateMedications]);

  // Duplicate medication
  const duplicateMedication = useCallback((index) => {
    const med = medications[index];
    const newMed = { ...med, id: uuidv4() };
    const updated = [...medications];
    updated.splice(index + 1, 0, newMed);
    updateMedications(updated);
  }, [medications, updateMedications]);

  // Check allergies
  const checkAllergies = useCallback((medication, index) => {
    if (!patientAllergies || patientAllergies.length === 0) return;

    const allergyMatches = [];
    const medName = medication.name.toLowerCase();
    const genericName = (medication.genericName || '').toLowerCase();
    const contraindications = medication.contraindications || [];

    patientAllergies.forEach(allergy => {
      const allergyLower = allergy.toLowerCase();
      if (medName.includes(allergyLower) || genericName.includes(allergyLower)) {
        allergyMatches.push(allergy);
      }
      if (contraindications.some(c => c.toLowerCase().includes(allergyLower))) {
        allergyMatches.push(allergy);
      }
    });

    if (allergyMatches.length > 0) {
      setWarnings(prev => {
        const filtered = prev.filter(w => w.index !== index);
        return [...filtered, {
          index,
          type: 'allergy',
          message: `⚠️ Patient may be allergic: ${allergyMatches.join(', ')}`,
        }];
      });
    }
  }, [patientAllergies]);

  // Calculate pediatric dose
  const calculatePediatricDose = (pedDosing, weight) => {
    if (!pedDosing || !weight) return null;

    const calculatedDose = pedDosing.perKgDose * weight;
    const finalDose = Math.min(calculatedDose, pedDosing.maxDose);
    return `${Math.round(finalDose)}${pedDosing.unit}`;
  };

  // Get warning for medication
  const getWarning = (index) => {
    return warnings.find(w => w.index === index);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: 24 }}>℞</span> Medications
        </Typography>
        
        {patientAge && patientAge < 18 && (
          <Chip
            icon={<InfoIcon />}
            label={`Pediatric Patient: ${patientAge} years${patientWeight ? `, ${patientWeight}kg` : ''}`}
            color="info"
            size="small"
          />
        )}
      </Box>

      {/* Allergy Alert */}
      {patientAllergies && patientAllergies.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <strong>Known Allergies:</strong> {patientAllergies.join(', ')}
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.50' }}>
              <TableCell sx={{ fontWeight: 600, width: 40 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Medicine</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 100 }}>Dose</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 100 }}>Route</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 120 }}>Frequency</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 100 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Instructions</TableCell>
              <TableCell sx={{ width: 80 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {medications.map((med, index) => {
              const warning = getWarning(index);
              return (
                <React.Fragment key={med.id}>
                  <TableRow sx={warning ? { bgcolor: 'error.50' } : {}}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Autocomplete
                        freeSolo
                        size="small"
                        options={medicationDatabase.map(m => m.name)}
                        value={med.name}
                        onChange={(e, newValue) => updateMedication(index, 'name', newValue || '')}
                        onInputChange={(e, newValue) => updateMedication(index, 'name', newValue)}
                        disabled={disabled}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Medicine name"
                            error={!!warning}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        value={med.dose}
                        onChange={(e) => updateMedication(index, 'dose', e.target.value)}
                        placeholder="e.g., 500mg"
                        disabled={disabled}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        fullWidth
                        value={med.route}
                        onChange={(e) => updateMedication(index, 'route', e.target.value)}
                        disabled={disabled}
                      >
                        {ROUTES.map(r => (
                          <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        fullWidth
                        value={med.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        disabled={disabled}
                      >
                        {FREQUENCIES.map(f => (
                          <MenuItem key={f.value} value={f.value}>{f.value}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Autocomplete
                        freeSolo
                        size="small"
                        options={DURATIONS}
                        value={med.duration}
                        onChange={(e, newValue) => updateMedication(index, 'duration', newValue || '')}
                        onInputChange={(e, newValue) => updateMedication(index, 'duration', newValue)}
                        disabled={disabled}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Duration" />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        value={med.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                        placeholder="e.g., After food"
                        disabled={disabled}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Duplicate">
                          <IconButton
                            size="small"
                            onClick={() => duplicateMedication(index)}
                            disabled={disabled}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => deleteMedication(index)}
                            disabled={disabled}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  {warning && (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ py: 0.5, bgcolor: 'error.50' }}>
                        <Alert severity="warning" sx={{ py: 0 }} icon={<WarningIcon />}>
                          {warning.message}
                        </Alert>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
            {medications.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No medications added. Click "Add Medication" to begin.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!disabled && (
        <Button
          startIcon={<AddIcon />}
          onClick={addMedication}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Add Medication
        </Button>
      )}
    </Box>
  );
};

export default MedicationGrid;