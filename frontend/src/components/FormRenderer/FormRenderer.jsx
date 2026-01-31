// src/components/FormRenderer/FormRenderer.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Collapse,
  IconButton,
  Alert,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import DynamicField from './DynamicField';
import RuleEngine from '../../core/engines/RuleEngine';

/**
 * FormRenderer - Renders a complete form from JSON template
 * Handles rule evaluation, validation, and state management
 */
const FormRenderer = ({
  template,
  initialData = {},
  context = {},
  onSubmit,
  onSave,
  rules = [],
  readOnly = false,
  showSubmit = true,
  showSave = true,
  onChange,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [collapsedSections, setCollapsedSections] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize rule engine
  const ruleEngine = useMemo(() => new RuleEngine(rules), [rules]);

  // Build evaluation context
  const evaluationContext = useMemo(() => ({
    ...context,
    formData,
    timestamp: new Date().toISOString(),
  }), [context, formData]);

  // Compute field states based on rules
  const fieldStates = useMemo(() => {
    const states = new Map();

    if (!template?.sections) return states;

    template.sections.forEach(section => {
      section.fields?.forEach(field => {
        const state = ruleEngine.evaluateVisibility(field.visibilityRules, evaluationContext);
        state.required = state.required || field.required;
        states.set(field.id, state);
      });
    });

    return states;
  }, [template, ruleEngine, evaluationContext]);

  // Compute section states
  const sectionStates = useMemo(() => {
    const states = new Map();

    if (!template?.sections) return states;

    template.sections.forEach(section => {
      const state = ruleEngine.evaluateVisibility(section.visibilityRules, evaluationContext);
      states.set(section.id, state);
    });

    return states;
  }, [template, ruleEngine, evaluationContext]);

  // Get active alerts
  useEffect(() => {
    const activeAlerts = ruleEngine.getActiveAlerts(evaluationContext);
    setAlerts(activeAlerts);
  }, [ruleEngine, evaluationContext]);

  // Handle field change
  const handleFieldChange = useCallback((fieldId, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [fieldId]: value,
      };

      // Notify parent of change
      if (onChange) {
        onChange(newData);
      }

      return newData;
    });

    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  }, [errors, onChange]);

  // Toggle section collapse
  const toggleSection = useCallback((sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};

    template.sections?.forEach(section => {
      const sectionState = sectionStates.get(section.id);
      if (!sectionState?.visible) return;

      section.fields?.forEach(field => {
        const fieldState = fieldStates.get(field.id);
        if (!fieldState?.visible) return;

        const value = formData[field.id];
        const isRequired = fieldState.required || field.required;

        // Required validation
        if (isRequired && (value === undefined || value === null || value === '')) {
          newErrors[field.id] = `${field.label} is required`;
          return;
        }

        // Custom validations
        if (field.validation && value) {
          for (const rule of field.validation) {
            switch (rule.type) {
              case 'min':
                if (Number(value) < rule.value) {
                  newErrors[field.id] = rule.message || `Minimum value is ${rule.value}`;
                }
                break;
              case 'max':
                if (Number(value) > rule.value) {
                  newErrors[field.id] = rule.message || `Maximum value is ${rule.value}`;
                }
                break;
              case 'minLength':
                if (String(value).length < rule.value) {
                  newErrors[field.id] = rule.message || `Minimum length is ${rule.value}`;
                }
                break;
              case 'maxLength':
                if (String(value).length > rule.value) {
                  newErrors[field.id] = rule.message || `Maximum length is ${rule.value}`;
                }
                break;
              case 'pattern':
                if (!new RegExp(rule.value).test(String(value))) {
                  newErrors[field.id] = rule.message || 'Invalid format';
                }
                break;
              case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
                  newErrors[field.id] = rule.message || 'Invalid email address';
                }
                break;
              case 'phone':
                if (!/^[\d\s\-+()]{10,}$/.test(String(value))) {
                  newErrors[field.id] = rule.message || 'Invalid phone number';
                }
                break;
            }
          }
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [template, formData, fieldStates, sectionStates]);

  // Handle submit
  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save (draft)
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave?.(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!template) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No template provided</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Alerts */}
      {alerts.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              severity={alert.severity || 'warning'}
              sx={{ mb: 1 }}
            >
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Sections */}
      {template.sections
        ?.filter(section => {
          const state = sectionStates.get(section.id);
          return state?.visible !== false;
        })
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(section => {
          const isCollapsed = collapsedSections[section.id] ?? section.defaultCollapsed;

          return (
            <Paper key={section.id} sx={{ mb: 2, overflow: 'hidden' }}>
              {/* Section Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: 'grey.50',
                  borderBottom: isCollapsed ? 0 : 1,
                  borderColor: 'divider',
                  cursor: section.collapsible ? 'pointer' : 'default',
                }}
                onClick={() => section.collapsible && toggleSection(section.id)}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {section.icon && <span style={{ marginRight: 8 }}>{section.icon}</span>}
                    {section.title}
                  </Typography>
                  {section.description && (
                    <Typography variant="body2" color="text.secondary">
                      {section.description}
                    </Typography>
                  )}
                </Box>
                {section.collapsible && (
                  <IconButton size="small">
                    {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </IconButton>
                )}
              </Box>

              {/* Section Content */}
              <Collapse in={!isCollapsed}>
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    mx: -1,
                  }}
                >
                  {section.fields
                    ?.filter(field => {
                      const state = fieldStates.get(field.id);
                      return state?.visible !== false;
                    })
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map(field => {
                      const fieldState = fieldStates.get(field.id) || {};

                      return (
                        <DynamicField
                          key={field.id}
                          field={{
                            ...field,
                            required: fieldState.required || field.required,
                          }}
                          value={formData[field.id] ?? field.defaultValue}
                          onChange={(value) => handleFieldChange(field.id, value)}
                          error={errors[field.id]}
                          disabled={readOnly || !fieldState.enabled}
                          context={evaluationContext}
                        />
                      );
                    })}
                </Box>
              </Collapse>
            </Paper>
          );
        })}

      {/* Action Buttons */}
      {(showSubmit || showSave) && !readOnly && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          {showSave && onSave && (
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={isSubmitting}
            >
              Save Draft
            </Button>
          )}
          {showSubmit && (
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FormRenderer;