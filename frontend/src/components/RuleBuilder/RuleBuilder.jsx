// src/components/RuleBuilder/RuleBuilder.jsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import RuleIcon from '@mui/icons-material/Rule';
import { v4 as uuidv4 } from 'uuid';

import useRuleStore from '../../core/store/useRuleStore';
import { OPERATORS, ACTION_TYPES } from '../../core/registry/fieldConfigs';
import ConditionEditor from './ConditionEditor';
import ActionEditor from './ActionEditor';

/**
 * RuleBuilder - Visual rule creation interface
 * Enables non-technical users to create conditional logic
 */
const RuleBuilder = ({ ruleId, onSave, onClose }) => {
  const { rules, addRule, updateRule, deleteRule } = useRuleStore();

  // Initialize rule
  const [rule, setRule] = useState(() => {
    if (ruleId && rules[ruleId]) {
      return JSON.parse(JSON.stringify(rules[ruleId]));
    }
    return {
      id: uuidv4(),
      name: 'New Rule',
      description: '',
      enabled: true,
      priority: 0,
      conditions: {
        id: uuidv4(),
        operator: 'AND',
        conditions: [],
      },
      actions: [],
      category: 'custom',
      tags: [],
    };
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [testResult, setTestResult] = useState(null);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [testContext, setTestContext] = useState('{\n  "patient": {\n    "gender": "female",\n    "age": 25\n  },\n  "formData": {}\n}');

  // Update rule
  const updateRuleData = useCallback((updates) => {
    setRule(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Add condition
  const addCondition = useCallback(() => {
    setRule(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        conditions: [
          ...prev.conditions.conditions,
          {
            id: uuidv4(),
            field: '',
            operator: 'equals',
            value: '',
          },
        ],
      },
    }));
  }, []);

  // Update condition
  const updateCondition = useCallback((conditionId, updates) => {
    setRule(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        conditions: prev.conditions.conditions.map(c =>
          c.id === conditionId ? { ...c, ...updates } : c
        ),
      },
    }));
  }, []);

  // Delete condition
  const deleteCondition = useCallback((conditionId) => {
    setRule(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        conditions: prev.conditions.conditions.filter(c => c.id !== conditionId),
      },
    }));
  }, []);

  // Add action
  const addAction = useCallback(() => {
    setRule(prev => ({
      ...prev,
      actions: [
        ...prev.actions,
        {
          id: uuidv4(),
          type: 'show',
          target: '',
          value: null,
          message: '',
        },
      ],
    }));
  }, []);

  // Update action
  const updateAction = useCallback((actionId, updates) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions.map(a =>
        a.id === actionId ? { ...a, ...updates } : a
      ),
    }));
  }, []);

  // Delete action
  const deleteAction = useCallback((actionId) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions.filter(a => a.id !== actionId),
    }));
  }, []);

  // Save rule
  const handleSave = useCallback(() => {
    if (!rule.name?.trim()) {
      setSnackbar({ open: true, message: 'Rule name is required', severity: 'error' });
      return;
    }

    if (rule.conditions.conditions.length === 0) {
      setSnackbar({ open: true, message: 'At least one condition is required', severity: 'error' });
      return;
    }

    if (rule.actions.length === 0) {
      setSnackbar({ open: true, message: 'At least one action is required', severity: 'error' });
      return;
    }

    if (ruleId && rules[ruleId]) {
      updateRule(ruleId, rule);
    } else {
      addRule(rule);
    }

    setSnackbar({ open: true, message: 'Rule saved successfully!', severity: 'success' });
    onSave?.(rule);
  }, [rule, ruleId, rules, addRule, updateRule, onSave]);

  // Test rule
  const testRule = useCallback(() => {
    try {
      const context = JSON.parse(testContext);
      
      // Simple evaluation for testing
      let allMatch = rule.conditions.operator === 'AND';
      
      for (const condition of rule.conditions.conditions) {
        const fieldValue = getNestedValue(context, condition.field);
        const match = evaluateCondition(condition.operator, fieldValue, condition.value);
        
        if (rule.conditions.operator === 'AND') {
          allMatch = allMatch && match;
        } else {
          allMatch = allMatch || match;
        }
      }

      setTestResult({
        matched: allMatch,
        actions: allMatch ? rule.actions : [],
        timestamp: new Date().toISOString(),
      });
      setShowTestDialog(true);
    } catch (error) {
      setSnackbar({ open: true, message: `Test failed: ${error.message}`, severity: 'error' });
    }
  }, [testContext, rule]);

  // Helper functions
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const evaluateCondition = (operator, fieldValue, conditionValue) => {
    switch (operator) {
      case 'equals': return fieldValue === conditionValue;
      case 'notEquals': return fieldValue !== conditionValue;
      case 'greaterThan': return Number(fieldValue) > Number(conditionValue);
      case 'lessThan': return Number(fieldValue) < Number(conditionValue);
      case 'contains': return String(fieldValue).includes(String(conditionValue));
      case 'isEmpty': return !fieldValue;
      case 'isNotEmpty': return !!fieldValue;
      default: return false;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <RuleIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Rule Builder
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={rule.enabled}
                onChange={(e) => updateRuleData({ enabled: e.target.checked })}
              />
            }
            label="Enabled"
          />
          
          {onClose && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {/* Basic Info */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Rule Name"
              value={rule.name}
              onChange={(e) => updateRuleData({ name: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={rule.category}
                label="Category"
                onChange={(e) => updateRuleData({ category: e.target.value })}
              >
                <MenuItem value="gender">Gender</MenuItem>
                <MenuItem value="age">Age</MenuItem>
                <MenuItem value="safety">Safety</MenuItem>
                <MenuItem value="workflow">Workflow</MenuItem>
                <MenuItem value="clinical">Clinical</MenuItem>
                <MenuItem value="calculation">Calculation</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Priority"
              value={rule.priority}
              onChange={(e) => updateRuleData({ priority: Number(e.target.value) })}
              helperText="Lower = higher priority"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={rule.description}
              onChange={(e) => updateRuleData({ description: e.target.value })}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Conditions */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Conditions
            </Typography>
            <FormControl size="small" sx={{ minWidth: 100, mr: 2 }}>
              <Select
                value={rule.conditions.operator}
                onChange={(e) => updateRuleData({
                  conditions: { ...rule.conditions, operator: e.target.value }
                })}
              >
                <MenuItem value="AND">ALL (AND)</MenuItem>
                <MenuItem value="OR">ANY (OR)</MenuItem>
              </Select>
            </FormControl>
            <Button startIcon={<AddIcon />} onClick={addCondition} variant="outlined" size="small">
              Add Condition
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {rule.conditions.operator === 'AND'
              ? 'Rule triggers when ALL conditions are true'
              : 'Rule triggers when ANY condition is true'}
          </Typography>

          {rule.conditions.conditions.length === 0 ? (
            <Alert severity="info">
              No conditions defined. Add at least one condition for the rule to work.
            </Alert>
          ) : (
            rule.conditions.conditions.map((condition, index) => (
              <ConditionEditor
                key={condition.id}
                condition={condition}
                index={index}
                onChange={(updates) => updateCondition(condition.id, updates)}
                onDelete={() => deleteCondition(condition.id)}
              />
            ))
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Actions */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Actions
            </Typography>
            <Button startIcon={<AddIcon />} onClick={addAction} variant="outlined" size="small">
              Add Action
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Actions to execute when conditions are met
          </Typography>

          {rule.actions.length === 0 ? (
            <Alert severity="info">
              No actions defined. Add at least one action for the rule to have effect.
            </Alert>
          ) : (
            rule.actions.map((action, index) => (
              <ActionEditor
                key={action.id}
                action={action}
                index={index}
                onChange={(updates) => updateAction(action.id, updates)}
                onDelete={() => deleteAction(action.id)}
              />
            ))
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Actions Bar */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Rule
          </Button>
          <Button
            variant="outlined"
            startIcon={<PlayArrowIcon />}
            onClick={() => setShowTestDialog(true)}
          >
            Test Rule
          </Button>
        </Box>
      </Paper>

      {/* Test Dialog */}
      <Dialog open={showTestDialog} onClose={() => setShowTestDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Test Rule</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Test Context (JSON)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={testContext}
            onChange={(e) => setTestContext(e.target.value)}
            sx={{ fontFamily: 'monospace', mb: 2 }}
          />

          <Button variant="contained" onClick={testRule} startIcon={<PlayArrowIcon />}>
            Run Test
          </Button>

          {testResult && (
            <Box sx={{ mt: 2 }}>
              <Alert severity={testResult.matched ? 'success' : 'info'}>
                {testResult.matched
                  ? `✅ Rule matched! ${testResult.actions.length} action(s) would execute.`
                  : '❌ Rule did not match.'}
              </Alert>

              {testResult.matched && testResult.actions.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Actions to execute:</Typography>
                  {testResult.actions.map((action, i) => (
                    <Chip
                      key={i}
                      label={`${action.type}: ${action.target}`}
                      sx={{ mr: 1, mt: 1 }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTestDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RuleBuilder;