// src/components/RuleBuilder/ConditionEditor.jsx
import React from 'react';
import {
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Typography,
  Tooltip,
  Autocomplete,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { OPERATORS } from '../../core/registry/fieldConfigs';

// Common field paths for autocomplete
const COMMON_FIELDS = [
  'patient.gender',
  'patient.age',
  'patient.dateOfBirth',
  'patient.allergies',
  'patient.medicalConditions',
  'visit.type',
  'visit.department',
  'formData.chiefComplaint',
  'formData.diagnosis',
  'formData.severity',
  'vitals.temperature',
  'vitals.bloodPressureSystolic',
  'vitals.bloodPressureDiastolic',
  'vitals.heartRate',
  'vitals.weight',
  'vitals.height',
  'vitals.bmi',
  'custom.isEmergency',
  'custom.isFollowUp',
];

/**
 * ConditionEditor - Edits a single condition in a rule
 */
const ConditionEditor = ({ condition, index, onChange, onDelete }) => {
  const operatorConfig = OPERATORS[condition.operator] || {};

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: 'grey.50',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          fontWeight: 600,
        }}
      >
        {index + 1}
      </Typography>

      {/* Field Path */}
      <Autocomplete
        freeSolo
        size="small"
        options={COMMON_FIELDS}
        value={condition.field}
        onChange={(e, newValue) => onChange({ field: newValue || '' })}
        onInputChange={(e, newValue) => onChange({ field: newValue })}
        sx={{ minWidth: 200 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Field"
            placeholder="e.g., patient.gender"
          />
        )}
      />

      {/* Operator */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Operator</InputLabel>
        <Select
          value={condition.operator}
          label="Operator"
          onChange={(e) => onChange({ operator: e.target.value })}
        >
          {Object.entries(OPERATORS).map(([key, config]) => (
            <MenuItem key={key} value={key}>
              {config.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Value (if required) */}
      {operatorConfig.valueRequired !== false && (
        operatorConfig.array ? (
          <TextField
            size="small"
            label="Values (comma-separated)"
            value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
            onChange={(e) => onChange({
              value: e.target.value.split(',').map(v => v.trim())
            })}
            sx={{ minWidth: 180 }}
          />
        ) : operatorConfig.range ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              type="number"
              label="Min"
              value={Array.isArray(condition.value) ? condition.value[0] : ''}
              onChange={(e) => onChange({
                value: [Number(e.target.value), condition.value?.[1] || 0]
              })}
              sx={{ width: 80 }}
            />
            <TextField
              size="small"
              type="number"
              label="Max"
              value={Array.isArray(condition.value) ? condition.value[1] : ''}
              onChange={(e) => onChange({
                value: [condition.value?.[0] || 0, Number(e.target.value)]
              })}
              sx={{ width: 80 }}
            />
          </Box>
        ) : (
          <TextField
            size="small"
            label="Value"
            value={condition.value ?? ''}
            onChange={(e) => onChange({ value: e.target.value })}
            type={operatorConfig.numeric ? 'number' : 'text'}
            sx={{ minWidth: 150 }}
          />
        )
      )}

      {/* Delete Button */}
      <Tooltip title="Delete Condition">
        <IconButton size="small" color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default ConditionEditor;