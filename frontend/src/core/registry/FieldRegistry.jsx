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
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import { medicalService } from '../../services/medicalService';
import {
  MEDICATION_ROUTES,
  MEDICATION_FREQUENCIES,
  DEFAULT_VITALS_CONFIG
} from '../../config/prescriptionConfig';

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
);

// ============================================
// TIME FIELD RENDERER
// ============================================
export const TimeFieldRenderer = ({ field, value, onChange, error, disabled }) => (
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
);

// ============================================
// DATETIME FIELD RENDERER
// ============================================
export const DateTimeFieldRenderer = ({ field, value, onChange, error, disabled }) => (
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
                    ) : col.type === 'autocomplete' ? (
                      <Autocomplete
                        freeSolo
                        size="small"
                        options={col.options || []}
                        value={row[col.id] || ''}
                        onChange={(e, newValue) => updateRow(rowIndex, col.id, newValue)}
                        onInputChange={(e, newValue) => updateRow(rowIndex, col.id, newValue)}
                        disabled={disabled}
                        renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                      />
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
export const VitalsTableRenderer = ({ field, value, onChange, disabled, context }) => {
  const vitals = value || {};

  // Priority: 1. Store via context, 2. Field config, 3. Hardcoded default
  const vitalsConfig = context?.vitals || field.config?.fields || DEFAULT_VITALS_CONFIG;

  const updateVital = (key, newValue) => {
    onChange({ ...vitals, [key]: newValue });
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        🩺 {field.label || 'Vitals'}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2 }}>
        {vitalsConfig.map((v) => (
          <TextField
            key={v.id || v.label}
            label={v.label}
            type="number"
            size="small"
            value={vitals[v.id] ?? ''}
            onChange={(e) =>
              updateVital(v.id, e.target.value ? Number(e.target.value) : null)
            }
            disabled={disabled}
            placeholder={v.config?.placeholder}
            InputProps={{
              endAdornment: v.unit ? (
                <Typography variant="caption" color="text.secondary">
                  {v.unit}
                </Typography>
              ) : undefined,
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
export const MedicationGridRenderer = ({ field, value: medications = [], onChange, disabled, context }) => {
  const [drugOptions, setDrugOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const columns = field.config?.columns || [
    { id: 'name', header: 'Medicine', type: 'text', width: '30%' },
    { id: 'dose', header: 'Dose', type: 'text', width: '15%' },
    { id: 'route', header: 'Route', type: 'dropdown', width: '15%', options: (context?.medicationRoutes || []).map(r => ({ label: r, value: r })) },
    { id: 'frequency', header: 'Freq', type: 'dropdown', width: '15%', options: (context?.frequencies || []).map(f => ({ label: f.label, value: f.value })) },
    { id: 'duration', header: 'Duration', type: 'text', width: '15%' },
  ];

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

  const addMedication = () => {
    const newMed = { id: uuidv4(), name: '', dose: '', route: '', frequency: '', duration: '' };
    onChange([...medications, newMed]);
  };

  const updateMedication = (index, columnId, newValue) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [columnId]: newValue };

    if (columnId === 'name') {
      const drug = drugOptions.find(d => d.name === newValue);
      if (drug) {
        updated[index] = {
          ...updated[index],
          name: drug.name,
          dose: drug.defaultDose || updated[index].dose,
          route: drug.defaultRoute || updated[index].route,
          frequency: drug.defaultFrequency || updated[index].frequency,
          duration: drug.defaultDuration || updated[index].duration,
        };
      }
    }
    onChange(updated);
  };

  const deleteMedication = (index) => {
    onChange(medications.filter((_, i) => i !== index));
  };

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
                            variant="standard"
                          >
                            <MenuItem value="">-</MenuItem>
                            {(col.options || []).map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : col.id === 'name' ? (
                          <Autocomplete
                            freeSolo
                            size="small"
                            options={drugOptions.map(m => m.name)}
                            loading={loading}
                            value={med.name || ''}
                            onInputChange={(e, newValue) => {
                              handleSearch(newValue);
                              updateMedication(index, 'name', newValue);
                            }}
                            onChange={(e, newValue) => updateMedication(index, 'name', typeof newValue === 'object' ? newValue?.name || '' : newValue)}
                            disabled={disabled}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                placeholder="Search..."
                                error={!!allergyWarning}
                                InputProps={{
                                  ...params.InputProps,
                                  disableUnderline: true,
                                }}
                              />
                            )}
                          />
                        ) : (
                          <TextField
                            size="small"
                            fullWidth
                            value={med[col.id] || ''}
                            onChange={(e) => updateMedication(index, col.id, e.target.value)}
                            disabled={disabled}
                            variant="standard"
                            InputProps={{
                              disableUnderline: true,
                            }}
                          />
                        )}
                      </TableCell>
                    ))}
                    {!disabled && (
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => deleteMedication(index)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                  {allergyWarning && (
                    <TableRow>
                      <TableCell colSpan={columns.length + 2} sx={{ py: 0, borderBottom: 'none' }}>
                        <Typography variant="caption" color="error" sx={{ px: 2 }}>
                          {allergyWarning}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
            {medications.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">No medications added.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!disabled && (
        <Button startIcon={<AddIcon />} onClick={addMedication} size="small" sx={{ mt: 1 }}>
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
// INVESTIGATIONS RENDERER
// ============================================
export const InvestigationsRenderer = ({ field, value: investigations = [], onChange, disabled }) => {
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async (query) => {
    if (!query || query.length < 2) return;
    setLoading(true);
    try {
      const results = await medicalService.searchInvestigations(query);
      setOptions(results.data.map(i => i.name));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fieldConfig = {
    ...field,
    config: {
      ...field.config,
      columns: field.config?.columns || [
        {
          id: 'name',
          header: 'Investigation Name',
          type: 'autocomplete',
          width: '70%',
          options: options
        },
        { id: 'result', header: 'Result (Optional)', type: 'text', width: '30%' },
      ]
    }
  };

  return <TableFieldRenderer
    field={fieldConfig}
    value={investigations}
    onChange={onChange}
    disabled={disabled}
    onAutocompleteSearch={handleSearch}
    loading={loading}
  />;
};

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
  investigations: InvestigationsRenderer,
  sectionHeader: SectionHeaderRenderer,
  divider: DividerRenderer,
  spacer: SpacerRenderer,
};

// Get renderer for field type
export const getFieldRenderer = (fieldType) => {
  return FIELD_RENDERERS[fieldType] || TextFieldRenderer;
};

export default FIELD_RENDERERS;
