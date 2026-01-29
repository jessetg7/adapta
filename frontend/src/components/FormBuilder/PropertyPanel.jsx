// src/components/FormBuilder/PropertyPanel.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Button,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

import { FIELD_TYPES, WIDTH_OPTIONS, OPERATORS, ACTION_TYPES } from '../../core/registry/fieldConfigs';

// Tab Panel Component
const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
  </div>
);

const PropertyPanel = ({
  selectedSection,
  selectedField,
  onUpdateSection,
  onUpdateField,
}) => {
  const [tab, setTab] = useState(0);

  // If nothing is selected
  if (!selectedSection && !selectedField) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Select a section or field to view its properties
        </Typography>
      </Box>
    );
  }

  // Section Properties
  if (selectedSection && !selectedField) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Section Properties
        </Typography>

        <TextField
          fullWidth
          label="Section Title"
          value={selectedSection.title || ''}
          onChange={(e) => onUpdateSection({ title: e.target.value })}
          sx={{ mb: 2 }}
          size="small"
        />

        <TextField
          fullWidth
          label="Description"
          value={selectedSection.description || ''}
          onChange={(e) => onUpdateSection({ description: e.target.value })}
          multiline
          rows={2}
          sx={{ mb: 2 }}
          size="small"
        />

        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel>Columns</InputLabel>
          <Select
            value={selectedSection.columns || 2}
            label="Columns"
            onChange={(e) => onUpdateSection({ columns: e.target.value })}
          >
            <MenuItem value={1}>1 Column</MenuItem>
            <MenuItem value={2}>2 Columns</MenuItem>
            <MenuItem value={3}>3 Columns</MenuItem>
            <MenuItem value={4}>4 Columns</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={selectedSection.collapsible ?? true}
              onChange={(e) => onUpdateSection({ collapsible: e.target.checked })}
            />
          }
          label="Collapsible"
        />

        <FormControlLabel
          control={
            <Switch
              checked={selectedSection.defaultCollapsed ?? false}
              onChange={(e) => onUpdateSection({ defaultCollapsed: e.target.checked })}
            />
          }
          label="Collapsed by Default"
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Visibility Rules
        </Typography>
        <VisibilityRulesEditor
          rules={selectedSection.visibilityRules || []}
          onChange={(rules) => onUpdateSection({ visibilityRules: rules })}
        />
      </Box>
    );
  }

  // Field Properties
  if (selectedField) {
    const fieldTypeConfig = FIELD_TYPES[selectedField.type];

    // Helper to auto-generate name from label
    const handleLabelChange = (newLabel) => {
      // Create a slug from the label (e.g. "Blood Pressure" -> "blood_pressure")
      const slug = newLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

      const updates = { label: newLabel };
      // Only auto-update name if it looks like it was auto-generated (or empty)
      // Check if current name matches the old label slug or is default "field_..."
      const currentName = selectedField.name || '';
      const oldLabelSlug = (selectedField.label || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

      if (!currentName || currentName.startsWith('field_') || currentName === oldLabelSlug) {
        updates.name = slug;
      }

      onUpdateField(updates);
    };

    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Field
          </Typography>
          <Chip
            label={fieldTypeConfig?.label || selectedField.type}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        <TextField
          fullWidth
          label="Question Label"
          value={selectedField.label || ''}
          onChange={(e) => handleLabelChange(e.target.value)}
          sx={{ mb: 2 }}
          size="small"
          autoFocus
          helperText="The question displayed to the user"
        />

        <FormControlLabel
          control={
            <Switch
              checked={selectedField.required ?? false}
              onChange={(e) => onUpdateField({ required: e.target.checked })}
            />
          }
          label="Required Answer"
          sx={{ mb: 2, display: 'block' }}
        />

        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          sx={{ mb: 1, borderBottom: 1, borderColor: 'divider' }}
          variant="fullWidth"
        >
          <Tab label="Options" />
          <Tab label="Rules" />
        </Tabs>

        {/* General/Options Tab */}
        <TabPanel value={tab} index={0}>
          {/* Field Specific Configs (Placeholder, Min/Max, Options) */}
          <FieldSpecificOptions
            field={selectedField}
            onUpdate={onUpdateField}
          />

          <Box sx={{ mt: 2 }}>
            <Accordion variant="outlined" sx={{ bgcolor: 'transparent' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" color="text.secondary">Advanced Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  label="System ID (Auto-generated)"
                  value={selectedField.name || ''}
                  onChange={(e) => onUpdateField({ name: e.target.value })}
                  sx={{ mb: 2 }}
                  size="small"
                  helperText="Unique database identifier"
                />

                <TextField
                  fullWidth
                  label="Description / Help Text"
                  value={selectedField.description || ''}
                  onChange={(e) => onUpdateField({ description: e.target.value })}
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                  size="small"
                />

                <FormControl fullWidth sx={{ mb: 2 }} size="small">
                  <InputLabel>Field Width</InputLabel>
                  <Select
                    value={selectedField.width || 'full'}
                    label="Field Width"
                    onChange={(e) => onUpdateField({ width: e.target.value })}
                  >
                    {WIDTH_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </AccordionDetails>
            </Accordion>
          </Box>
        </TabPanel>

        {/* Rules/Validation Tab */}
        <TabPanel value={tab} index={1}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Validation
          </Typography>
          <ValidationEditor
            field={selectedField}
            onUpdate={onUpdateField}
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Visibility Logic
          </Typography>
          <VisibilityRulesEditor
            rules={selectedField.visibilityRules || []}
            onChange={(rules) => onUpdateField({ visibilityRules: rules })}
          />
        </TabPanel>
      </Box>
    );
  }

  return null;
};

// Field-Specific Options Component
const FieldSpecificOptions = ({ field, onUpdate }) => {
  const updateConfig = (key, value) => {
    onUpdate({
      config: {
        ...field.config,
        [key]: value,
      },
    });
  };

  switch (field.type) {
    case 'text':
    case 'textarea':
      return (
        <>
          <TextField
            fullWidth
            label="Example Text (shown inside box)"
            placeholder="e.g. Enter patient name here"
            value={field.config?.placeholder || ''}
            onChange={(e) => updateConfig('placeholder', e.target.value)}
            sx={{ mb: 2 }}
            size="small"
            helperText="Gray text that disappears when they start typing"
          />
          <TextField
            fullWidth
            label="Maximum Characters Allowed"
            type="number"
            value={field.config?.maxLength || ''}
            onChange={(e) => updateConfig('maxLength', e.target.value ? Number(e.target.value) : null)}
            sx={{ mb: 2 }}
            size="small"
          />
          {field.type === 'textarea' && (
            <TextField
              fullWidth
              label="Height (number of lines)"
              type="number"
              value={field.config?.rows || 4}
              onChange={(e) => updateConfig('rows', Number(e.target.value))}
              size="small"
            />
          )}
        </>
      );

    case 'number':
      return (
        <>
          <TextField
            fullWidth
            label="Minimum Allowed Value"
            type="number"
            value={field.config?.min ?? ''}
            onChange={(e) => updateConfig('min', e.target.value ? Number(e.target.value) : null)}
            sx={{ mb: 2 }}
            size="small"
          />
          <TextField
            fullWidth
            label="Maximum Allowed Value"
            type="number"
            value={field.config?.max ?? ''}
            onChange={(e) => updateConfig('max', e.target.value ? Number(e.target.value) : null)}
            sx={{ mb: 2 }}
            size="small"
          />
          <TextField
            fullWidth
            label="Step Amount"
            placeholder="1"
            type="number"
            value={field.config?.step || 1}
            onChange={(e) => updateConfig('step', Number(e.target.value))}
            sx={{ mb: 2 }}
            size="small"
            helperText="Increments when using up/down arrows (e.g. 0.1 or 1)"
          />
          <TextField
            fullWidth
            label="Unit Label"
            placeholder="e.g. kg, ml, mg"
            value={field.config?.unit || ''}
            onChange={(e) => updateConfig('unit', e.target.value)}
            size="small"
            helperText="Displayed next to the number"
          />
        </>
      );

    case 'dropdown':
    case 'multiselect':
    case 'radio':
      return (
        <OptionsEditor
          options={field.options || []}
          onChange={(options) => onUpdate({ options })}
        />
      );

    default:
      return null;
  }
};

// Options Editor for dropdowns, radio, etc.
const OptionsEditor = ({ options, onChange }) => {
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

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Options
      </Typography>

      {options.map((option, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            size="small"
            placeholder="Label"
            value={option.label || ''}
            onChange={(e) => updateOption(index, 'label', e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            size="small"
            placeholder="Value"
            value={option.value || ''}
            onChange={(e) => updateOption(index, 'value', e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <IconButton size="small" onClick={() => deleteOption(index)} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={addOption}
        size="small"
        variant="outlined"
      >
        Add Option
      </Button>
    </Box>
  );
};

// Validation Editor Component
const ValidationEditor = ({ field, onUpdate }) => {
  const validation = field.validation || [];

  const addValidation = () => {
    onUpdate({
      validation: [
        ...validation,
        { type: 'required', message: 'This field is required' },
      ],
    });
  };

  const updateValidation = (index, updates) => {
    const updated = [...validation];
    updated[index] = { ...updated[index], ...updates };
    onUpdate({ validation: updated });
  };

  const deleteValidation = (index) => {
    onUpdate({
      validation: validation.filter((_, i) => i !== index),
    });
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
                sx={{ flexGrow: 1 }}
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

// Visibility Rules Editor Component
const VisibilityRulesEditor = ({ rules, onChange }) => {
  const addRule = () => {
    onChange([
      ...rules,
      {
        id: uuidv4(),
        conditions: {
          id: uuidv4(),
          operator: 'AND',
          conditions: [
            { id: uuidv4(), field: '', operator: 'equals', value: '' },
          ],
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
                  sx={{ flexGrow: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={cond.operator}
                    onChange={(e) => updateCondition(ruleIndex, condIndex, { operator: e.target.value })}
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
                  sx={{ flexGrow: 1 }}
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

            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => addCondition(ruleIndex)}
            >
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

export default PropertyPanel;