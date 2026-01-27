// src/core/registry/FieldRegistry.jsx
import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  InputLabel,
  FormHelperText,
  Autocomplete,
  Chip,
  Switch,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// TEXT FIELD RENDERER
// ============================================
export const TextFieldRenderer = ({ field, value, onChange, error, disabled }) => (
  <TextField
    fullWidth
    label={field.label}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    required={field.required}
    disabled={disabled}
    error={!!error}
    helperText={error || field.description || field.config?.helpText}
    placeholder={field.config?.placeholder}
    InputProps={{
      startAdornment: field.config?.prefix ? (
        <Typography sx={{ mr: 1, color: 'text.secondary' }}>{field.config.prefix}</Typography>
      ) : undefined,
      endAdornment: field.config?.suffix ? (
        <Typography sx={{ ml: 1, color: 'text.secondary' }}>{field.config.suffix}</Typography>
      ) : undefined,
    }}
    size="small"
  />
);

// ============================================
// NUMBER FIELD RENDERER
// ============================================
export const NumberFieldRenderer = ({ field, value, onChange, error, disabled }) => (
  <TextField
    fullWidth
    type="number"
    label={field.label}
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
    required={field.required}
    disabled={disabled}
    error={!!error}
    helperText={error || field.description || field.config?.helpText}
    placeholder={field.config?.placeholder}
    InputProps={{
      endAdornment: field.config?.unit ? (
        <Typography sx={{ ml: 1, color: 'text.secondary' }}>{field.config.unit}</Typography>
      ) : undefined,
    }}
    inputProps={{
      min: field.config?.min,
      max: field.config?.max,
      step: field.config?.step || 1,
    }}
    size="small"
  />
);

// ============================================
// TEXTAREA FIELD RENDERER
// ============================================
export const TextareaFieldRenderer = ({ field, value, onChange, error, disabled }) => (
  <TextField
    fullWidth
    multiline
    rows={field.config?.rows || 4}
    label={field.label}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    required={field.required}
    disabled={disabled}
    error={!!error}
    helperText={error || field.description}
    placeholder={field.config?.placeholder}
    inputProps={{ maxLength: field.config?.maxLength }}
    size="small"
  />
);

// ============================================
// DATE FIELD RENDERER
// ============================================
export const DateFieldRenderer = ({ field, value, onChange, error, disabled }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      label={field.label}
      value={value ? dayjs(value) : null}
      onChange={(date) => onChange(date ? date.format('YYYY-MM-DD') : null)}
      disabled={disabled}
      slotProps={{
        textField: {
          fullWidth: true,
          required: field.required,
          error: !!error,
          helperText: error || field.description,
          size: 'small',
        },
      }}
    />
  </LocalizationProvider>
);

// ============================================
// TIME FIELD RENDERER
// ============================================
export const TimeFieldRenderer = ({ field, value, onChange, error, disabled }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <TimePicker
      label={field.label}
      value={value ? dayjs(value, 'HH:mm') : null}
      onChange={(time) => onChange(time ? time.format('HH:mm') : null)}
      disabled={disabled}
      slotProps={{
        textField: {
          fullWidth: true,
          required: field.required,
          error: !!error,
          helperText: error || field.description,
          size: 'small',
        },
      }}
    />
  </LocalizationProvider>
);

// ============================================
// DATETIME FIELD RENDERER
// ============================================
export const DateTimeFieldRenderer = ({ field, value, onChange, error, disabled }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DateTimePicker
      label={field.label}
      value={value ? dayjs(value) : null}
      onChange={(date) => onChange(date ? date.toISOString() : null)}
      disabled={disabled}
      slotProps={{
        textField: {
          fullWidth: true,
          required: field.required,
          error: !!error,
          helperText: error || field.description,
          size: 'small',
        },
      }}
    />
  </LocalizationProvider>
);

// ============================================
// DROPDOWN FIELD RENDERER
// ============================================
export const DropdownFieldRenderer = ({ field, value, onChange, error, disabled }) => (
  <FormControl fullWidth error={!!error} size="small" required={field.required}>
    <InputLabel>{field.label}</InputLabel>
    <Select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      label={field.label}
      disabled={disabled}
    >
      <MenuItem value="">
        <em>Select...</em>
      </MenuItem>
      {(field.options || []).map((option) => (
        <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
    {(error || field.description) && (
      <FormHelperText>{error || field.description}</FormHelperText>
    )}
  </FormControl>
);

// ============================================
// MULTI-SELECT FIELD RENDERER
// ============================================
export const MultiSelectFieldRenderer = ({ field, value, onChange, error, disabled }) => (
  <Autocomplete
    multiple
    options={field.options || []}
    getOptionLabel={(option) => option.label || option}
    value={
      Array.isArray(value)
        ? (field.options || []).filter((o) => value.includes(o.value))
        : []
    }
    onChange={(_, newValue) => onChange(newValue.map((v) => v.value))}
    disabled={disabled}
    renderInput={(params) => (
      <TextField
        {...params}
        label={field.label}
        required={field.required}
        error={!!error}
        helperText={error || field.description}
        size="small"
      />
    )}
    renderTags={(tagValue, getTagProps) =>
      tagValue.map((option, index) => (
        <Chip
          label={option.label}
          size="small"
          {...getTagProps({ index })}
          key={option.value}
        />
      ))
    }
  />
);

// ============================================
// CHECKBOX FIELD RENDERER
// ============================================
export const CheckboxFieldRenderer = ({ field, value, onChange, disabled }) => (
  <FormControlLabel
    control={
      <Checkbox
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
    }
    label={
      <Typography>
        {field.label}
        {field.required && <span style={{ color: 'red' }}> *</span>}
      </Typography>
    }
  />
);

// ============================================
// RADIO FIELD RENDERER
// ============================================
export const RadioFieldRenderer = ({ field, value, onChange, error, disabled }) => (
  <FormControl error={!!error} disabled={disabled} component="fieldset">
    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
      {field.label}
      {field.required && <span style={{ color: 'red' }}> *</span>}
    </Typography>
    <RadioGroup
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      row={(field.options || []).length <= 4}
    >
      {(field.options || []).map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<Radio size="small" />}
          label={option.label}
          disabled={option.disabled}
        />
      ))}
    </RadioGroup>
    {(error || field.description) && (
      <FormHelperText>{error || field.description}</FormHelperText>
    )}
  </FormControl>
);

// ============================================
// TOGGLE/SWITCH FIELD RENDERER
// ============================================
export const ToggleFieldRenderer = ({ field, value, onChange, disabled }) => (
  <FormControlLabel
    control={
      <Switch
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
    }
    label={field.label}
  />
);

// ============================================
// TABLE FIELD RENDERER
// ============================================
export const TableFieldRenderer = ({ field, value, onChange, disabled }) => {
  const rows = Array.isArray(value) ? value : [];
  const columns = field.config?.columns || [];

  const addRow = () => {
    const newRow = { id: uuidv4() };
    columns.forEach((col) => {
      newRow[col.id] = col.defaultValue ?? '';
    });
    onChange([...rows, newRow]);
  };

  const updateRow = (rowIndex, columnId, newValue) => {
    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [columnId]: newValue };
    onChange(newRows);
  };

  const deleteRow = (rowIndex) => {
    onChange(rows.filter((_, i) => i !== rowIndex));
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {field.label}
        {field.required && <span style={{ color: 'red' }}> *</span>}
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              {columns.map((col) => (
                <TableCell key={col.id} sx={{ fontWeight: 600, width: col.width }}>
                  {col.header}
                </TableCell>
              ))}
              {!disabled && field.config?.allowDeleteRow !== false && (
                <TableCell width={50} />
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={row.id || rowIndex}>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {col.type === 'dropdown' ? (
                      <Select
                        fullWidth
                        size="small"
                        value={row[col.id] || ''}
                        onChange={(e) => updateRow(rowIndex, col.id, e.target.value)}
                        disabled={disabled}
                      >
                        <MenuItem value="">-</MenuItem>
                        {(col.options || []).map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : col.type === 'number' ? (
                      <TextField
                        type="number"
                        size="small"
                        fullWidth
                        value={row[col.id] ?? ''}
                        onChange={(e) =>
                          updateRow(rowIndex, col.id, e.target.value ? Number(e.target.value) : '')
                        }
                        disabled={disabled}
                      />
                    ) : (
                      <TextField
                        size="small"
                        fullWidth
                        value={row[col.id] || ''}
                        onChange={(e) => updateRow(rowIndex, col.id, e.target.value)}
                        disabled={disabled}
                      />
                    )}
                  </TableCell>
                ))}
                {!disabled && field.config?.allowDeleteRow !== false && (
                  <TableCell>
                    <IconButton size="small" onClick={() => deleteRow(rowIndex)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">No data. Click "Add Row" to begin.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!disabled && field.config?.allowAddRow !== false && (
        <Button startIcon={<AddIcon />} onClick={addRow} size="small" sx={{ mt: 1 }}>
          Add Row
        </Button>
      )}
    </Box>
  );
};

// ============================================
// VITALS TABLE RENDERER
// ============================================
export const VitalsTableRenderer = ({ field, value, onChange, disabled }) => {
  const vitals = value || {};

  const vitalsConfig = field.config?.fields || [
    { id: 'temperature', label: 'Temperature', unit: '°C' },
    { id: 'bloodPressureSystolic', label: 'BP Systolic', unit: 'mmHg' },
    { id: 'bloodPressureDiastolic', label: 'BP Diastolic', unit: 'mmHg' },
    { id: 'heartRate', label: 'Heart Rate', unit: 'bpm' },
    { id: 'respiratoryRate', label: 'Resp. Rate', unit: '/min' },
    { id: 'oxygenSaturation', label: 'SpO2', unit: '%' },
    { id: 'weight', label: 'Weight', unit: 'kg' },
    { id: 'height', label: 'Height', unit: 'cm' },
  ];

  const updateVital = (key, newValue) => {
    onChange({ ...vitals, [key]: newValue });
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        {field.label || 'Vitals'}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2 }}>
        {vitalsConfig.map((vital) => (
          <TextField
            key={vital.id}
            label={vital.label}
            type="number"
            size="small"
            value={vitals[vital.id] ?? ''}
            onChange={(e) =>
              updateVital(vital.id, e.target.value ? Number(e.target.value) : null)
            }
            disabled={disabled}
            InputProps={{
              endAdornment: (
                <Typography variant="caption" color="text.secondary">
                  {vital.unit}
                </Typography>
              ),
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

// ============================================
// MEDICATION GRID RENDERER
// ============================================
export const MedicationGridRenderer = ({ field, value, onChange, disabled, context }) => {
  const medications = Array.isArray(value) ? value : [];
  
  const columns = field.config?.columns || [
    { id: 'name', header: 'Medicine Name', type: 'text', width: '25%' },
    { id: 'dose', header: 'Dose', type: 'text', width: '15%' },
    { id: 'route', header: 'Route', type: 'dropdown', width: '15%', options: [
      { label: 'Oral', value: 'oral' },
      { label: 'IV', value: 'iv' },
      { label: 'IM', value: 'im' },
      { label: 'SC', value: 'sc' },
      { label: 'Topical', value: 'topical' },
    ]},
    { id: 'frequency', header: 'Frequency', type: 'dropdown', width: '15%', options: [
      { label: 'OD', value: 'OD' },
      { label: 'BD', value: 'BD' },
      { label: 'TDS', value: 'TDS' },
      { label: 'QID', value: 'QID' },
      { label: 'PRN', value: 'PRN' },
    ]},
    { id: 'duration', header: 'Duration', type: 'text', width: '15%' },
    { id: 'instructions', header: 'Instructions', type: 'text', width: '15%' },
  ];

  const addMedication = () => {
    const newMed = { id: uuidv4() };
    columns.forEach((col) => {
      newMed[col.id] = '';
    });
    onChange([...medications, newMed]);
  };

  const updateMedication = (index, columnId, newValue) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [columnId]: newValue };
    onChange(updated);
  };

  const deleteMedication = (index) => {
    onChange(medications.filter((_, i) => i !== index));
  };

  // Check for drug allergies if context is provided
  const checkAllergy = (medName) => {
    if (!context?.patient?.allergies || !medName) return null;
    const allergies = context.patient.allergies.map(a => a.toLowerCase());
    if (allergies.some(a => medName.toLowerCase().includes(a))) {
      return 'Patient may be allergic to this medication!';
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        💊 {field.label || 'Medications'}
        {field.required && <span style={{ color: 'red' }}> *</span>}
      </Typography>
      
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.50' }}>
              <TableCell sx={{ fontWeight: 600, width: 40 }}>#</TableCell>
              {columns.map((col) => (
                <TableCell key={col.id} sx={{ fontWeight: 600, width: col.width }}>
                  {col.header}
                </TableCell>
              ))}
              {!disabled && <TableCell width={50} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {medications.map((med, index) => {
              const allergyWarning = checkAllergy(med.name);
              return (
                <React.Fragment key={med.id || index}>
                  <TableRow sx={allergyWarning ? { backgroundColor: 'error.50' } : {}}>
                    <TableCell>{index + 1}</TableCell>
                    {columns.map((col) => (
                      <TableCell key={col.id}>
                        {col.type === 'dropdown' ? (
                          <Select
                            fullWidth
                            size="small"
                            value={med[col.id] || ''}
                            onChange={(e) => updateMedication(index, col.id, e.target.value)}
                            disabled={disabled}
                          >
                            <MenuItem value="">-</MenuItem>
                            {(col.options || []).map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          <TextField
                            size="small"
                            fullWidth
                            value={med[col.id] || ''}
                            onChange={(e) => updateMedication(index, col.id, e.target.value)}
                            disabled={disabled}
                            error={col.id === 'name' && !!allergyWarning}
                          />
                        )}
                      </TableCell>
                    ))}
                    {!disabled && (
                      <TableCell>
                        <IconButton size="small" onClick={() => deleteMedication(index)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                  {allergyWarning && (
                    <TableRow>
                      <TableCell colSpan={columns.length + 2} sx={{ py: 0.5, border: 0 }}>
                        <Alert severity="warning" sx={{ py: 0 }}>
                          {allergyWarning}
                        </Alert>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
            {medications.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center" sx={{ py: 3 }}>
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
          size="small" 
          variant="outlined"
          sx={{ mt: 1 }}
        >
          Add Medication
        </Button>
      )}
    </Box>
  );
};

// ============================================
// SECTION HEADER RENDERER
// ============================================
export const SectionHeaderRenderer = ({ field }) => (
  <Typography 
    variant="h6" 
    sx={{ 
      mt: 2, 
      mb: 1, 
      color: 'primary.main',
      borderBottom: '2px solid',
      borderColor: 'primary.main',
      pb: 0.5,
    }}
  >
    {field.label}
  </Typography>
);

// ============================================
// DIVIDER RENDERER
// ============================================
export const DividerRenderer = () => <Divider sx={{ my: 2 }} />;

// ============================================
// SPACER RENDERER
// ============================================
export const SpacerRenderer = ({ field }) => (
  <Box sx={{ height: field.config?.height || 24 }} />
);

// ============================================
// FIELD TYPE TO RENDERER MAPPING
// ============================================
export const FIELD_RENDERERS = {
  text: TextFieldRenderer,
  email: TextFieldRenderer,
  phone: TextFieldRenderer,
  number: NumberFieldRenderer,
  textarea: TextareaFieldRenderer,
  date: DateFieldRenderer,
  time: TimeFieldRenderer,
  datetime: DateTimeFieldRenderer,
  dropdown: DropdownFieldRenderer,
  multiselect: MultiSelectFieldRenderer,
  checkbox: CheckboxFieldRenderer,
  radio: RadioFieldRenderer,
  toggle: ToggleFieldRenderer,
  table: TableFieldRenderer,
  vitals: VitalsTableRenderer,
  medications: MedicationGridRenderer,
  investigations: TableFieldRenderer,
  sectionHeader: SectionHeaderRenderer,
  divider: DividerRenderer,
  spacer: SpacerRenderer,
};

// Get renderer for field type
export const getFieldRenderer = (fieldType) => {
  return FIELD_RENDERERS[fieldType] || TextFieldRenderer;
};

export default FIELD_RENDERERS;