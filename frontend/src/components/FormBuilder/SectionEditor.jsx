// src/components/FormBuilder/SectionEditor.jsx
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

import { OPERATORS } from '../../core/registry/fieldConfigs';

/**
 * Section Editor Component
 * Edits section properties including visibility rules
 */
const SectionEditor = ({ section, onChange }) => {
  const [expanded, setExpanded] = useState('basic');

  if (!section) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select a section to edit its properties
        </Typography>
      </Box>
    );
  }

  const handleChange = (field, value) => {
    onChange?.({ ...section, [field]: value });
  };

  // Visibility rules management
  const addVisibilityRule = () => {
    const newRule = {
      id: uuidv4(),
      conditions: {
        id: uuidv4(),
        operator: 'AND',
        conditions: [
          { id: uuidv4(), field: '', operator: 'equals', value: '' },
        ],
      },
      action: 'show',
    };

    handleChange('visibilityRules', [...(section.visibilityRules || []), newRule]);
  };

  const updateVisibilityRule = (ruleIndex, updates) => {
    const updated = [...(section.visibilityRules || [])];
    updated[ruleIndex] = { ...updated[ruleIndex], ...updates };
    handleChange('visibilityRules', updated);
  };

  const deleteVisibilityRule = (ruleIndex) => {
    const updated = (section.visibilityRules || []).filter((_, i) => i !== ruleIndex);
    handleChange('visibilityRules', updated);
  };

  const addCondition = (ruleIndex) => {
    const updated = [...(section.visibilityRules || [])];
    updated[ruleIndex].conditions.conditions.push({
      id: uuidv4(),
      field: '',
      operator: 'equals',
      value: '',
    });
    handleChange('visibilityRules', updated);
  };

  const updateCondition = (ruleIndex, condIndex, updates) => {
    const updated = [...(section.visibilityRules || [])];
    updated[ruleIndex].conditions.conditions[condIndex] = {
      ...updated[ruleIndex].conditions.conditions[condIndex],
      ...updates,
    };
    handleChange('visibilityRules', updated);
  };

  const deleteCondition = (ruleIndex, condIndex) => {
    const updated = [...(section.visibilityRules || [])];
    updated[ruleIndex].conditions.conditions = updated[ruleIndex].conditions.conditions.filter(
      (_, i) => i !== condIndex
    );
    handleChange('visibilityRules', updated);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Section Properties
      </Typography>

      <Chip
        label={`${section.fields?.length || 0} fields`}
        size="small"
        color="primary"
        sx={{ mb: 2 }}
      />

      {/* Basic Properties */}
      <Accordion
        expanded={expanded === 'basic'}
        onChange={() => setExpanded(expanded === 'basic' ? '' : 'basic')}
        disableGutters
        elevation={0}
        sx={{ '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={500}>Basic Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            label="Section Title"
            value={section.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            label="Description"
            value={section.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={2}
            sx={{ mb: 2 }}
            size="small"
          />

          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>Columns</InputLabel>
            <Select
              value={section.columns || 2}
              label="Columns"
              onChange={(e) => handleChange('columns', e.target.value)}
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
                checked={section.collapsible ?? true}
                onChange={(e) => handleChange('collapsible', e.target.checked)}
              />
            }
            label="Collapsible"
          />

          <FormControlLabel
            control={
              <Switch
                checked={section.defaultCollapsed ?? false}
                onChange={(e) => handleChange('defaultCollapsed', e.target.checked)}
              />
            }
            label="Collapsed by Default"
          />
        </AccordionDetails>
      </Accordion>

      {/* Styling */}
      <Accordion
        expanded={expanded === 'styling'}
        onChange={() => setExpanded(expanded === 'styling' ? '' : 'styling')}
        disableGutters
        elevation={0}
        sx={{ '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={500}>Styling</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            label="Icon (emoji or name)"
            value={section.icon || ''}
            onChange={(e) => handleChange('icon', e.target.value)}
            sx={{ mb: 2 }}
            size="small"
            placeholder="e.g., 📋 or PersonIcon"
          />

          <TextField
            fullWidth
            label="Background Color"
            type="color"
            value={section.color || '#ffffff'}
            onChange={(e) => handleChange('color', e.target.value)}
            sx={{ mb: 2 }}
            size="small"
          />
        </AccordionDetails>
      </Accordion>

      {/* Visibility Rules */}
      <Accordion
        expanded={expanded === 'visibility'}
        onChange={() => setExpanded(expanded === 'visibility' ? '' : 'visibility')}
        disableGutters
        elevation={0}
        sx={{ '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={500}>
            Visibility Rules
            {(section.visibilityRules?.length || 0) > 0 && (
              <Chip
                label={section.visibilityRules.length}
                size="small"
                sx={{ ml: 1, height: 20 }}
              />
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Define when this section should be shown or hidden
          </Typography>

          {(section.visibilityRules || []).map((rule, ruleIndex) => (
            <Paper key={rule.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                  Rule {ruleIndex + 1}
                </Typography>
                <FormControl size="small" sx={{ minWidth: 100, mr: 1 }}>
                  <Select
                    value={rule.action}
                    onChange={(e) => updateVisibilityRule(ruleIndex, { action: e.target.value })}
                  >
                    <MenuItem value="show">Show</MenuItem>
                    <MenuItem value="hide">Hide</MenuItem>
                  </Select>
                </FormControl>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => deleteVisibilityRule(ruleIndex)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>

              <Typography variant="caption" color="text.secondary" gutterBottom>
                When{' '}
                <Select
                  size="small"
                  value={rule.conditions.operator}
                  onChange={(e) =>
                    updateVisibilityRule(ruleIndex, {
                      conditions: { ...rule.conditions, operator: e.target.value },
                    })
                  }
                  sx={{ mx: 0.5 }}
                >
                  <MenuItem value="AND">ALL</MenuItem>
                  <MenuItem value="OR">ANY</MenuItem>
                </Select>{' '}
                conditions match:
              </Typography>

              {rule.conditions.conditions.map((cond, condIndex) => (
                <Box
                  key={cond.id}
                  sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}
                >
                  <TextField
                    size="small"
                    placeholder="Field"
                    value={cond.field || ''}
                    onChange={(e) =>
                      updateCondition(ruleIndex, condIndex, { field: e.target.value })
                    }
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
                    onChange={(e) =>
                      updateCondition(ruleIndex, condIndex, { value: e.target.value })
                    }
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteCondition(ruleIndex, condIndex)}
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
                sx={{ mt: 1 }}
              >
                Add Condition
              </Button>
            </Paper>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={addVisibilityRule}
            variant="outlined"
            size="small"
            fullWidth
          >
            Add Visibility Rule
          </Button>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SectionEditor;