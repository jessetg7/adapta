// src/components/RuleBuilder/ActionEditor.jsx
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ACTION_TYPES } from '../../core/registry/fieldConfigs';

/**
 * ActionEditor - Edits a single action in a rule
 */
const ActionEditor = ({ action, index, onChange, onDelete }) => {
  const actionConfig = ACTION_TYPES[action.type] || {};
  
  // Determine what additional fields to show based on action type
  const showTarget = ['show', 'hide', 'enable', 'disable', 'require', 'optional', 'setValue', 'clearValue', 'calculate'].includes(action.type);
  const showValue = ['setValue'].includes(action.type);
  const showFormula = ['calculate'].includes(action.type);
  const showMessage = ['showAlert', 'showWarning'].includes(action.type);

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
          bgcolor: 'secondary.main',
          color: 'white',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          fontWeight: 600,
        }}
      >
        {index + 1}
      </Typography>

      {/* Action Type */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Action Type</InputLabel>
        <Select
          value={action.type}
          label="Action Type"
          onChange={(e) => onChange({ type: e.target.value })}
        >
          {Object.entries(ACTION_TYPES).map(([key, config]) => (
            <MenuItem key={key} value={key}>
              {config.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Target Field/Section */}
      {showTarget && (
        <TextField
          size="small"
          label="Target (Field/Section ID)"
          value={action.target || ''}
          onChange={(e) => onChange({ target: e.target.value })}
          placeholder="e.g., field-gender, section-medical"
          sx={{ minWidth: 200 }}
        />
      )}

      {/* Value for setValue */}
      {showValue && (
        <TextField
          size="small"
          label="Value"
          value={action.value ?? ''}
          onChange={(e) => onChange({ value: e.target.value })}
          sx={{ minWidth: 120 }}
        />
      )}

      {/* Formula for calculate */}
      {showFormula && (
        <TextField
          size="small"
          label="Formula"
          value={action.formula || ''}
          onChange={(e) => onChange({ formula: e.target.value })}
          placeholder="e.g., {weight} / ({height}/100)^2"
          sx={{ minWidth: 200 }}
        />
      )}

      {/* Message for alerts/warnings */}
      {showMessage && (
        <TextField
          size="small"
          label="Message"
          value={action.message || ''}
          onChange={(e) => onChange({ message: e.target.value })}
          placeholder="Alert/warning message"
          sx={{ flexGrow: 1 }}
        />
      )}

      {/* Delete Button */}
      <Tooltip title="Delete Action">
        <IconButton size="small" color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default ActionEditor;