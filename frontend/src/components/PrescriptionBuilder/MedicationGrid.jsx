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

import { medicalService } from '../../services/medicalService';
import useTemplateStore from '../../core/store/useTemplateStore';

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
  const [drugOptions, setDrugOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { medicationRoutes, frequencies } = useTemplateStore();

  // Sync with external value
  React.useEffect(() => {
    setMedications(value);
  }, [value]);

  // Update parent
  const updateMedications = useCallback((newMeds) => {
    setMedications(newMeds);
    onChange?.(newMeds);
  }, [onChange]);

  // Handle drug search
  const handleSearch = async (query) => {
    if (!query || query.length < 2) return;
    setLoading(true);
    try {
      const results = await medicalService.searchDrugs(query);
      setDrugOptions(results.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add new medication
  const addMedication = useCallback(() => {
    const newMed = {
      id: uuidv4(),
      name: '',
      genericName: '',
      dose: '',
      route: medicationRoutes[0] || '',
      frequency: frequencies[0]?.id || '',
      duration: '5 days',
      timing: '',
      instructions: '',
      quantity: null,
    };
    updateMedications([...medications, newMed]);
  }, [medications, updateMedications, medicationRoutes, frequencies]);

  // Update medication
  const updateMedication = useCallback((index, field, value) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };

    // If selecting from database, auto-fill defaults
    if (field === 'name') {
      const dbMed = drugOptions.find(m => m.name === value);
      if (dbMed) {
        updated[index] = {
          ...updated[index],
          genericName: dbMed.category, // Using category as generic name if genericName not in Drug model
          dose: dbMed.defaultDose || updated[index].dose,
          route: dbMed.defaultRoute || updated[index].route,
          frequency: dbMed.defaultFrequency || updated[index].frequency,
          duration: dbMed.defaultDuration || updated[index].duration,
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
    updateMedications(updated);
  }, [medications, updateMedications, patientAge, patientWeight, drugOptions, patientAllergies]);

  // Check allergies
  const checkAllergies = (drug, index) => {
    if (!patientAllergies || patientAllergies.length === 0) return;

    // Simple string matching for demo purposes
    const isAllergic = patientAllergies.some(allergy =>
      drug.name.toLowerCase().includes(allergy.toLowerCase()) ||
      (drug.category && drug.category.toLowerCase().includes(allergy.toLowerCase()))
    );

    if (isAllergic) {
      setWarnings(prev => [...prev, { index, message: `Patient is allergic to ${drug.name}!` }]);
    } else {
      setWarnings(prev => prev.filter(w => w.index !== index));
    }
  };

  // Calculate pediatric dose
  const calculatePediatricDose = (dosing, weight) => {
    if (!dosing || !weight) return null;
    // Simple calculation: dose/kg * weight
    // detailed logic would be more complex
    return `${dosing}mg/kg -> ${Math.round(dosing * weight)}mg`;
  };

  // Get warning for index
  const getWarning = (index) => {
    return warnings.find(w => w.index === index);
  };

  // Duplicate medication
  const duplicateMedication = (index) => {
    const med = medications[index];
    const newMed = { ...med, id: uuidv4() };
    const newMeds = [...medications];
    newMeds.splice(index + 1, 0, newMed);
    updateMedications(newMeds);
  };

  // Delete medication
  const deleteMedication = (index) => {
    const newMeds = medications.filter((_, i) => i !== index);
    updateMedications(newMeds);
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
                        options={drugOptions.map(m => m.name)}
                        loading={loading}
                        value={med.name}
                        onInputChange={(e, newValue) => {
                          handleSearch(newValue);
                          updateMedication(index, 'name', newValue);
                        }}
                        onChange={(e, newValue) => updateMedication(index, 'name', typeof newValue === 'object' ? newValue?.name || '' : newValue)}
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
                        {medicationRoutes.map(r => (
                          <MenuItem key={r} value={r}>{r}</MenuItem>
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
                        {frequencies.map(f => (
                          <MenuItem key={f.id} value={f.id}>{f.id}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Autocomplete
                        freeSolo
                        size="small"
                        options={['3 days', '5 days', '7 days', '10 days', '14 days', '21 days', '1 month', 'Continuous']}
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