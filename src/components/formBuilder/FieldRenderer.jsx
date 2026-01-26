import React from 'react';
import {
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Box,
  Chip
} from '@mui/material';

const FieldRenderer = ({ field, value, onChange, error }) => {
  const handleChange = (newValue) => {
    onChange(field.id, newValue);
  };

  switch (field.type) {
    case 'text':
      return (
        <TextField
          fullWidth
          label={field.label}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          required={field.required}
          error={!!error}
          helperText={error || field.helpText}
          size="small"
        />
      );

    case 'number':
      return (
        <TextField
          fullWidth
          type="number"
          label={field.label}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          required={field.required}
          error={!!error}
          helperText={error || field.helpText}
          size="small"
          inputProps={{
            min: field.validation?.min,
            max: field.validation?.max
          }}
        />
      );

    case 'textarea':
      return (
        <TextField
          fullWidth
          multiline
          rows={4}
          label={field.label}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          required={field.required}
          error={!!error}
          helperText={error || field.helpText}
          size="small"
        />
      );

    case 'dropdown':
      return (
        <FormControl fullWidth size="small" error={!!error} required={field.required}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={value || ''}
            label={field.label}
            onChange={(e) => handleChange(e.target.value)}
          >
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {(error || field.helpText) && (
            <FormHelperText>{error || field.helpText}</FormHelperText>
          )}
        </FormControl>
      );

    case 'multiselect':
      return (
        <FormControl fullWidth size="small" error={!!error} required={field.required}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            multiple
            value={value || []}
            label={field.label}
            onChange={(e) => handleChange(e.target.value)}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((val) => {
                  const option = field.options?.find(o => o.value === val);
                  return <Chip key={val} label={option?.label || val} size="small" />;
                })}
              </Box>
            )}
          >
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {(error || field.helpText) && (
            <FormHelperText>{error || field.helpText}</FormHelperText>
          )}
        </FormControl>
      );

    case 'checkbox':
      return (
        <FormControl error={!!error}>
          <FormControlLabel
            control={
              <Checkbox
                checked={value || false}
                onChange={(e) => handleChange(e.target.checked)}
              />
            }
            label={field.checkboxLabel || field.label}
          />
          {(error || field.helpText) && (
            <FormHelperText>{error || field.helpText}</FormHelperText>
          )}
        </FormControl>
      );

    case 'date':
      return (
        <TextField
          fullWidth
          type="date"
          label={field.label}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          required={field.required}
          error={!!error}
          helperText={error || field.helpText}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      );

    default:
      return (
        <TextField
          fullWidth
          label={field.label}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          size="small"
        />
      );
  }
};

export default FieldRenderer;