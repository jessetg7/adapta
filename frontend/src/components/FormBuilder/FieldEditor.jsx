// src/components/FormBuilder/FieldEditor.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
  Chip,
  Paper,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

import { FIELD_TYPES, WIDTH_OPTIONS, OPERATORS } from '../../core/registry/fieldConfigs';

/**
 * Tab Panel Component
 */
const TabPanel = ({ children, value, index }) => (
  <Box hidden={value !== index} sx={{ pt: 2 }}>
    {value === index && children}
  </Box>
);

/**
 * Options Editor for dropdown/radio/multiselect
 */
const OptionsEditor = ({ options = [], onChange }) => {
  const addOption = () => {
    onChange([
      ...options,
      { value: `option_${Date.now()}`, label: `Option ${options.length + 1}` },
    ]);
  };

  const updateOption = (index, field, value) => {
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const deleteOption = (index) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const moveOption = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= options.length) return;
    
    const updated = [...options];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Options
      </Typography>

      {options.map((option, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Label"
            value={option.label || ''}
            onChange={(e) => updateOption(index, 'label', e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            placeholder="Value"
            value={option.value || ''}
            onChange={(e) => updateOption(index, 'value', e.target.value)}
            sx={{ flex: 1 }}
          />
          <IconButton size="small" onClick={() => deleteOption(index)} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Button startIcon={<AddIcon />} onClick={addOption} size="small" variant="outlined">
        Add Option
      </Button>
    </Box>
  );
};

/**
 * Validation Rules Editor
 */
const ValidationEditor = ({ validation = [], onChange }) => {
  const addValidation = () => {
    onChange([
      ...validation,
      { type: 'required', message: 'This field is required' },
    ]);
  };

  const updateValidation = (index, updates) => {
    const updated = [...validation];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const deleteValidation = (index) => {
    onChange(validation.filter((_, i) => i !== index));
  };

  return (
    <Box>
      {validation.map((rule, index) => (
        <Paper key={index} variant="outlined" sx={{ p: 1.5, mb: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={rule.type}
                label="Type"
                onChange={(e) => updateValidation(index, { type: e.target.value })}
              >
                <MenuItem value="required">Required</MenuItem>
                <MenuItem value="min">Min Value</MenuItem>
                <MenuItem value="max">Max Value</MenuItem>
                <MenuItem value="minLength">Min Length</MenuItem>
                <MenuItem value="maxLength">Max Length</MenuItem>
                <MenuItem value="pattern">Pattern</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="phone">Phone</MenuItem>
              </Select>
            </FormControl>

            {['min', 'max', 'minLength', 'maxLength'].includes(rule.type) && (
              <TextField
                size="small"
                type="number"
                label="Value"
                value={rule.value || ''}
                onChange={(e) => updateValidation(index, { value: Number(e.target.value) })}
                sx={{ width: 100 }}
              />
            )}

            {rule.type === 'pattern' && (
              <TextField
                size="small"
                label="Pattern"
                value={rule.value || ''}
                onChange={(e) => updateValidation(index, { value: e.target.value })}
                sx={{ flex: 1 }}
                placeholder="Regular expression"
              />
            )}

            <IconButton size="small" onClick={() => deleteValidation(index)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            size="small"
            label="Error Message"
            value={rule.message || ''}
            onChange={(e) => updateValidation(index, { message: e.target.value })}
          />
        </Paper>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={addValidation}
        size="small"
        variant="outlined"
        fullWidth
      >
        Add Validation Rule
      </Button>
    </Box>
  );
};

/**
 * Visibility Rules Editor for Fields
 */
const VisibilityRulesEditor = ({ rules = [], onChange }) => {
  const addRule = () => {
    onChange([
      ...rules,
      {
        id: uuidv4(),
        conditions: {
          id: uuidv4(),
          operator: 'AND',
          conditions: [{ id: uuidv4(), field: '', operator: 'equals', value: '' }],
        },
        action: 'show',
      },
    ]);
  };

  const updateRule = (index, updates) => {
    const updated = [...rules];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const deleteRule = (index) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  const addCondition = (ruleIndex) => {
    const updated = [...rules];
    updated[ruleIndex].conditions.conditions.push({
      id: uuidv4(),
      field: '',
      operator: 'equals',
      value: '',
    });
    onChange(updated);
  };

  const updateCondition = (ruleIndex, condIndex, updates) => {
    const updated = [...rules];
    updated[ruleIndex].conditions.conditions[condIndex] = {
      ...updated[ruleIndex].conditions.conditions[condIndex],
      ...updates,
    };
    onChange(updated);
  };

  const deleteCondition = (ruleIndex, condIndex) => {
    const updated = [...rules];
    updated[ruleIndex].conditions.conditions = updated[ruleIndex].conditions.conditions.filter(
      (_, i) => i !== condIndex
    );
    onChange(updated);
  };

  return (
    <Box>
      {rules.map((rule, ruleIndex) => (
        <Accordion key={rule.id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <Typography variant="body2">Rule {ruleIndex + 1}</Typography>
              <Chip label={rule.action} size="small" color="primary" />
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRule(ruleIndex);
                }}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Action</InputLabel>
              <Select
                value={rule.action}
                label="Action"
                onChange={(e) => updateRule(ruleIndex, { action: e.target.value })}
              >
                <MenuItem value="show">Show</MenuItem>
                <MenuItem value="hide">Hide</MenuItem>
                <MenuItem value="enable">Enable</MenuItem>
                <MenuItem value="disable">Disable</MenuItem>
                <MenuItem value="require">Make Required</MenuItem>
                <MenuItem value="optional">Make Optional</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              When ALL conditions match:
            </Typography>

            {rule.conditions.conditions.map((cond, condIndex) => (
              <Box key={cond.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Field"
                  value={cond.field || ''}
                  onChange={(e) => updateCondition(ruleIndex, condIndex, { field: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={cond.operator}
                    onChange={(e) =>
                      updateCondition(ruleIndex, condIndex, { operator: e.target.value })
                    }
                  >
                    {Object.entries(OPERATORS).map(([key, { label }]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  placeholder="Value"
                  value={cond.value || ''}
                  onChange={(e) => updateCondition(ruleIndex, condIndex, { value: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <IconButton
                  size="small"
                  onClick={() => deleteCondition(ruleIndex, condIndex)}
                  color="error"
                  disabled={rule.conditions.conditions.length <= 1}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            <Button size="small" startIcon={<AddIcon />} onClick={() => addCondition(ruleIndex)}>
              Add Condition
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={addRule}
        size="small"
        variant="outlined"
        fullWidth
        sx={{ mt: 1 }}
      >
        Add Visibility Rule
      </Button>
    </Box>
  );
};

/**
 * Field-Specific Configuration Options
 */
const FieldSpecificOptions = ({ field, onChange }) => {
  const updateConfig = (key, value) => {
    onChange({
      ...field,
      config: { ...field.config, [key]: value },
    });
  };

  const fieldType = field.type;

  switch (fieldType) {
    case 'text':
    case 'email':
    case 'phone':
      return (
        <Box>
          <TextField
            fullWidth
            label="Placeholder"
            value={field.config?.placeholder || ''}
            onChange={(e) => updateConfig('placeholder', e.target.value)}
            sx={{ mb: 2 }}
            size="small"
          />
          <TextField
            fullWidth
            label="Max Length"
            type="number"
            value={field.config?.maxLength || ''}
            onChange={(e) =>
              updateConfig('maxLength', e.target.value ? Number(e.target.value) : null)
            }
            sx={{ mb: 2 }}
            size="small"
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Prefix"
                value={field.config?.prefix || ''}
                onChange={(e) => updateConfig('prefix', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Suffix"
                value={field.config?.suffix || ''}
                onChange={(e) => updateConfig('suffix', e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>
        </Box>
      );

    case 'number':
      return (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Minimum"
                type="number"
                value={field.config?.min ?? ''}
                onChange={(e) =>
                  updateConfig('min', e.target.value ? Number(e.target.value) : null)
                }
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Maximum"
                type="number"
                value={field.config?.max ?? ''}
                onChange={(e) =>
                  updateConfig('max', e.target.value ? Number(e.target.value) : null)
                }
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Step"
                type="number"
                value={field.config?.step || 1}
                onChange={(e) => updateConfig('step', Number(e.target.value))}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Unit"
                value={field.config?.unit || ''}
                onChange={(e) => updateConfig('unit', e.target.value)}
                size="small"
                placeholder="e.g., kg, cm, %"
              />
            </Grid>
          </Grid>
        </Box>
      );

    case 'textarea':
      return (
        <Box>
          <TextField
            fullWidth
            label="Placeholder"
            value={field.config?.placeholder || ''}
            onChange={(e) => updateConfig('placeholder', e.target.value)}
            sx={{ mb: 2 }}
            size="small"
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Rows"
                type="number"
                value={field.config?.rows || 4}
                onChange={(e) => updateConfig('rows', Number(e.target.value))}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max Length"
                type="number"
                value={field.config?.maxLength || ''}
                onChange={(e) =>
                  updateConfig('maxLength', e.target.value ? Number(e.target.value) : null)
                }
                size="small"
              />
            </Grid>
          </Grid>
        </Box>
      );

    case 'dropdown':
    case 'multiselect':
    case 'radio':
      return (
        <Box>
          <OptionsEditor
            options={field.options || []}
            onChange={(options) => onChange({ ...field, options })}
          />
        </Box>
      );

    case 'date':
      return (
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={field.config?.disablePast || false}
                onChange={(e) => updateConfig('disablePast', e.target.checked)}
              />
            }
            label="Disable Past Dates"
          />
          <FormControlLabel
            control={
              <Switch
                checked={field.config?.disableFuture || false}
                onChange={(e) => updateConfig('disableFuture', e.target.checked)}
              />
            }
            label="Disable Future Dates"
          />
        </Box>
      );

    case 'table':
    case 'medications':
    case 'investigations':
      return (
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={field.config?.allowAddRow !== false}
                onChange={(e) => updateConfig('allowAddRow', e.target.checked)}
              />
            }
            label="Allow Add Row"
          />
          <FormControlLabel
            control={
              <Switch
                checked={field.config?.allowDeleteRow !== false}
                onChange={(e) => updateConfig('allowDeleteRow', e.target.checked)}
              />
            }
            label="Allow Delete Row"
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Min Rows"
                type="number"
                value={field.config?.minRows || 0}
                onChange={(e) => updateConfig('minRows', Number(e.target.value))}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max Rows"
                type="number"
                value={field.config?.maxRows || ''}
                onChange={(e) =>
                  updateConfig('maxRows', e.target.value ? Number(e.target.value) : null)
                }
                size="small"
              />
            </Grid>
          </Grid>
        </Box>
      );

    default:
      return null;
  }
};

/**
 * Main Field Editor Component
 */
const FieldEditor = ({ field, onChange }) => {
  const [tab, setTab] = useState(0);

  if (!field) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select a field to edit its properties
        </Typography>
      </Box>
    );
  }

  const fieldTypeConfig = FIELD_TYPES[field.type];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Field Properties
      </Typography>

      <Chip
        label={fieldTypeConfig?.label || field.type}
        size="small"
        color="primary"
        sx={{ mb: 2 }}
      />

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        sx={{ mb: 1, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="General" />
        <Tab label="Validation" />
        <Tab label="Rules" />
      </Tabs>

      {/* General Tab */}
      <TabPanel value={tab} index={0}>
        <TextField
          fullWidth
          label="Label"
          value={field.label || ''}
          onChange={(e) => onChange({ ...field, label: e.target.value })}
          sx={{ mb: 2 }}
          size="small"
        />

        <TextField
          fullWidth
          label="Field Name (ID)"
          value={field.name || ''}
          onChange={(e) => onChange({ ...field, name: e.target.value })}
          sx={{ mb: 2 }}
          size="small"
          helperText="Unique identifier for data binding"
        />

        <TextField
          fullWidth
          label="Description / Help Text"
          value={field.description || ''}
          onChange={(e) => onChange({ ...field, description: e.target.value })}
          multiline
          rows={2}
          sx={{ mb: 2 }}
          size="small"
        />

        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel>Width</InputLabel>
          <Select
            value={field.width || 'full'}
            label="Width"
            onChange={(e) => onChange({ ...field, width: e.target.value })}
          >
            {WIDTH_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={field.required ?? false}
              onChange={(e) => onChange({ ...field, required: e.target.checked })}
            />
          }
          label="Required"
        />

        <FormControlLabel
          control={
            <Switch
              checked={field.disabled ?? false}
              onChange={(e) => onChange({ ...field, disabled: e.target.checked })}
            />
          }
          label="Disabled"
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Field-Specific Settings
        </Typography>
        <FieldSpecificOptions field={field} onChange={onChange} />
      </TabPanel>

      {/* Validation Tab */}
      <TabPanel value={tab} index={1}>
        <ValidationEditor
          validation={field.validation || []}
          onChange={(validation) => onChange({ ...field, validation })}
        />
      </TabPanel>

      {/* Rules Tab */}
      <TabPanel value={tab} index={2}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Visibility Rules
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Define conditions for when this field should be shown, hidden, enabled, or disabled.
        </Typography>
        <VisibilityRulesEditor
          rules={field.visibilityRules || []}
          onChange={(rules) => onChange({ ...field, visibilityRules: rules })}
        />
      </TabPanel>
    </Box>
  );
};

export default FieldEditor;