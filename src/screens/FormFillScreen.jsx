import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  OutlinedInput,
  Divider,
  Badge,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  CheckCircle as CheckIcon,
  Send as SendIcon,
  ArrowBack as BackIcon,
  Warning as WarningIcon,
  LocalHospital as HospitalIcon,
  Schedule as DeferIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as HiddenIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { useForm } from '../context/FormContext';
import { useAudit } from '../context/AuditContext';
import { useEmergency, EmergencyProvider } from '../context/EmergencyContext';

import EmergencyBanner from '../components/emergency/EmergencyBanner';
import ModeSelector from '../components/emergency/ModeSelector';
import TriageCalculator from '../components/emergency/TriageCalculator';
import MedicationGrid from '../components/medication/MedicationGrid';
import DeferredFieldsAlert from '../components/emergency/DeferredFieldsAlert';
import ExplainabilityPanel from '../components/explainability/ExplainabilityPanel';

// Field Renderer Component
function FieldRenderer({ field, value, onChange, error, onDefer, isEmergencyMode }) {
  const { addDeferredField } = useEmergency();
  
  const handleDefer = () => {
    addDeferredField(field.id, field.label, field.sectionId);
    if (onDefer) onDefer(field.id);
  };

  const commonProps = {
    fullWidth: true,
    error: !!error,
    helperText: error || field.helpText,
    required: field.required,
    size: isEmergencyMode ? 'medium' : 'small',
  };

  const renderDeferButton = () => {
    if (!isEmergencyMode || field.required) return null;
    return (
      <Tooltip title="Defer this field for later">
        <IconButton size="small" onClick={handleDefer} sx={{ ml: 1 }}>
          <DeferIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  };

  switch (field.type) {
    case 'text':
      return (
        <Stack direction="row" alignItems="flex-start">
          <TextField
            {...commonProps}
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
          {renderDeferButton()}
        </Stack>
      );

    case 'number':
      return (
        <Stack direction="row" alignItems="flex-start">
          <TextField
            {...commonProps}
            type="number"
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            inputProps={{
              min: field.validation?.min,
              max: field.validation?.max
            }}
          />
          {renderDeferButton()}
        </Stack>
      );

    case 'textarea':
      return (
        <Stack direction="row" alignItems="flex-start">
          <TextField
            {...commonProps}
            multiline
            rows={3}
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
          {renderDeferButton()}
        </Stack>
      );

    case 'dropdown':
      return (
        <Stack direction="row" alignItems="flex-start">
          <FormControl fullWidth error={!!error} required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              label={field.label}
              onChange={(e) => onChange(field.id, e.target.value)}
              size={isEmergencyMode ? 'medium' : 'small'}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
            {(error || field.helpText) && (
              <FormHelperText>{error || field.helpText}</FormHelperText>
            )}
          </FormControl>
          {renderDeferButton()}
        </Stack>
      );

    case 'multiselect':
      return (
        <Stack direction="row" alignItems="flex-start">
          <FormControl fullWidth error={!!error} required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              multiple
              value={value || []}
              label={field.label}
              onChange={(e) => onChange(field.id, e.target.value)}
              input={<OutlinedInput label={field.label} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((v) => (
                    <Chip key={v} label={v} size="small" />
                  ))}
                </Box>
              )}
              size={isEmergencyMode ? 'medium' : 'small'}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
            {(error || field.helpText) && (
              <FormHelperText>{error || field.helpText}</FormHelperText>
            )}
          </FormControl>
          {renderDeferButton()}
        </Stack>
      );

    case 'checkbox':
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!value}
              onChange={(e) => onChange(field.id, e.target.checked)}
            />
          }
          label={
            <Typography variant="body2">
              {field.label}
              {field.required && <span style={{ color: 'red' }}> *</span>}
            </Typography>
          }
        />
      );

    case 'date':
      return (
        <Stack direction="row" alignItems="flex-start">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={field.label}
              value={value ? dayjs(value) : null}
              onChange={(date) => onChange(field.id, date?.toISOString())}
              slotProps={{
                textField: {
                  ...commonProps,
                  size: isEmergencyMode ? 'medium' : 'small'
                }
              }}
            />
          </LocalizationProvider>
          {renderDeferButton()}
        </Stack>
      );

    default:
      return (
        <TextField
          {...commonProps}
          label={field.label}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      );
  }
}

// Main Form Fill Content
function FormFillContent() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { getTemplateById } = useForm();
  const { logAction } = useAudit();
  const {
    isEmergencyActive,
    currentMode,
    isSectionVisible,
    detectEmergencyFromFormData,
    deferredFields
  } = useEmergency();

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [showHiddenSections, setShowHiddenSections] = useState(false);

  const template = getTemplateById(templateId);

  useEffect(() => {
    if (template) {
      // Initialize expanded state - in emergency mode, expand critical sections
      const expanded = {};
      template.sections?.forEach((section, idx) => {
        expanded[section.id] = isEmergencyActive ? isSectionVisible(section.id) : idx === 0;
      });
      setExpandedSections(expanded);
      
      logAction('FORM_STARTED', { templateId: template.id, templateName: template.name });
    }
  }, [template, isEmergencyActive]);

  // Monitor form data for emergency triggers
  useEffect(() => {
    detectEmergencyFromFormData(formData);
  }, [formData, detectEmergencyFromFormData]);

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Check conditional visibility
  const isFieldVisible = (field) => {
    if (!field.conditionalVisibility) return true;
    
    const { dependsOn, condition, value } = field.conditionalVisibility;
    const dependsOnValue = formData[dependsOn];
    
    switch (condition) {
      case 'equals':
        return dependsOnValue === value;
      case 'notEquals':
        return dependsOnValue !== value;
      case 'in':
        return Array.isArray(value) ? value.includes(dependsOnValue) : dependsOnValue === value;
      default:
        return true;
    }
  };

  // Calculate progress
  const progress = useMemo(() => {
    if (!template?.sections) return 0;
    
    let totalRequired = 0;
    let filledRequired = 0;
    
    template.sections.forEach(section => {
      // Skip hidden sections in emergency mode
      if (isEmergencyActive && !isSectionVisible(section.id)) return;
      
      section.fields?.forEach(field => {
        if (field.required && isFieldVisible(field)) {
          totalRequired++;
          if (formData[field.id]) filledRequired++;
        }
      });
    });
    
    return totalRequired > 0 ? Math.round((filledRequired / totalRequired) * 100) : 0;
  }, [template, formData, isEmergencyActive, isSectionVisible]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    template.sections?.forEach(section => {
      // Skip hidden sections in emergency mode
      if (isEmergencyActive && !isSectionVisible(section.id)) return;
      
      section.fields?.forEach(field => {
        if (field.required && isFieldVisible(field)) {
          const value = formData[field.id];
          if (!value || (Array.isArray(value) && value.length === 0)) {
            newErrors[field.id] = 'This field is required';
            isValid = false;
          }
        }
        
        // Number validation
        if (field.type === 'number' && formData[field.id]) {
          const numValue = parseFloat(formData[field.id]);
          if (field.validation?.min && numValue < field.validation.min) {
            newErrors[field.id] = `Minimum value is ${field.validation.min}`;
            isValid = false;
          }
          if (field.validation?.max && numValue > field.validation.max) {
            newErrors[field.id] = `Maximum value is ${field.validation.max}`;
            isValid = false;
          }
        }
      });
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowSubmitDialog(true);
    }
  };

  const confirmSubmit = () => {
    // Save submission
    const submissions = JSON.parse(localStorage.getItem('adapta_submissions') || '[]');
    const newSubmission = {
      id: `submission_${Date.now()}`,
      templateId: template.id,
      templateName: template.name,
      data: formData,
      mode: currentMode.id,
      deferredFields: deferredFields.map(f => f.fieldId),
      submittedAt: new Date().toISOString()
    };
    submissions.push(newSubmission);
    localStorage.setItem('adapta_submissions', JSON.stringify(submissions));
    
    logAction('FORM_SUBMITTED', {
      templateId: template.id,
      templateName: template.name,
      mode: currentMode.id,
      deferredCount: deferredFields.length
    });
    
    setShowSubmitDialog(false);
    setSubmitted(true);
  };

  if (!template) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Template not found</Alert>
        <Button onClick={() => navigate('/templates')} sx={{ mt: 2 }}>
          Back to Templates
        </Button>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
          <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Form Submitted Successfully!
          </Typography>
          <Typography color="text.secondary" paragraph>
            {template.name} has been submitted.
            {deferredFields.length > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {deferredFields.length} field(s) were deferred and need to be completed later.
              </Alert>
            )}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
            <Button variant="outlined" onClick={() => navigate('/templates')}>
              Back to Templates
            </Button>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // Filter sections based on mode
  const visibleSections = template.sections?.filter(section => 
    showHiddenSections || !isEmergencyActive || isSectionVisible(section.id)
  ) || [];

  const hiddenSectionCount = isEmergencyActive 
    ? template.sections?.filter(s => !isSectionVisible(s.id)).length || 0
    : 0;

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      {/* Back Button */}
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate('/templates')}
        sx={{ mb: 2 }}
      >
        Back to Templates
      </Button>

      {/* Emergency Banner */}
      <EmergencyBanner />

      {/* Deferred Fields Alert */}
      <DeferredFieldsAlert />

      {/* Explainability Panel */}
      <ExplainabilityPanel formData={formData} />

      {/* Mode Selector */}
      <ModeSelector />

      {/* Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderTop: 4,
          borderColor: template.color || 'primary.main'
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4">{template.name}</Typography>
            <Typography color="text.secondary">{template.description}</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip
              label={template.category}
              sx={{ bgcolor: template.color, color: 'white' }}
            />
            <Chip
              label={`v${template.version}`}
              variant="outlined"
            />
          </Stack>
        </Stack>

        {/* Progress Bar */}
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Progress: {progress}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {visibleSections.length} section{visibleSections.length !== 1 ? 's' : ''}
              {hiddenSectionCount > 0 && (
                <Chip
                  size="small"
                  label={`${hiddenSectionCount} hidden`}
                  color="warning"
                  sx={{ ml: 1 }}
                  onClick={() => setShowHiddenSections(!showHiddenSections)}
                  icon={showHiddenSections ? <VisibilityIcon /> : <HiddenIcon />}
                />
              )}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: isEmergencyActive ? 'error.100' : 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: isEmergencyActive ? 'error.main' : 'primary.main'
              }
            }}
          />
        </Box>
      </Paper>

      {/* Triage Calculator (show in emergency mode or when visiting vital signs section) */}
      {(isEmergencyActive || formData.visitType === 'Emergency') && (
        <TriageCalculator
          initialVitals={{
            systolicBP: formData.systolicBP || formData.bp_systolic,
            heartRate: formData.heartRate || formData.pulse,
            oxygenSaturation: formData.oxygenSaturation || formData.spo2,
            temperature: formData.temperature
          }}
        />
      )}

      {/* Form Sections */}
      {visibleSections.map((section) => {
        const isSectionHiddenByMode = isEmergencyActive && !isSectionVisible(section.id);
        const visibleFields = section.fields?.filter(isFieldVisible) || [];
        
        return (
          <Accordion
            key={section.id}
            expanded={expandedSections[section.id] || false}
            onChange={() => setExpandedSections(prev => ({
              ...prev,
              [section.id]: !prev[section.id]
            }))}
            sx={{
              mb: 1,
              opacity: isSectionHiddenByMode ? 0.5 : 1,
              border: isSectionHiddenByMode ? '2px dashed' : 'none',
              borderColor: 'warning.main'
            }}
          >
            <AccordionSummary expandIcon={<ExpandIcon />}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {section.title}
                </Typography>
                <Chip
                  label={`${visibleFields.length} fields`}
                  size="small"
                  variant="outlined"
                />
                {isSectionHiddenByMode && (
                  <Chip
                    icon={<HiddenIcon />}
                    label="Hidden in Emergency"
                    size="small"
                    color="warning"
                  />
                )}
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              {section.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {section.description}
                </Typography>
              )}
              
              {/* Medication Grid for medication sections */}
              {section.id.toLowerCase().includes('medication') && (
                <MedicationGrid
                  allergies={formData.knownAllergies?.split(',').map(a => a.trim()) || []}
                  patientWeight={formData.weight ? parseFloat(formData.weight) : null}
                />
              )}
              
              <Stack spacing={2}>
                {visibleFields.map((field) => (
                  <Box key={field.id}>
                    <FieldRenderer
                      field={{ ...field, sectionId: section.id }}
                      value={formData[field.id]}
                      onChange={handleFieldChange}
                      error={errors[field.id]}
                      isEmergencyMode={isEmergencyActive}
                    />
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Submit Section */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {Object.keys(errors).length > 0 && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  Please fix {Object.keys(errors).length} error(s) before submitting
                </Alert>
              )}
              {deferredFields.length > 0 && (
                <Alert severity="warning">
                  {deferredFields.length} field(s) deferred - can be completed later
                </Alert>
              )}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setFormData({});
                setErrors({});
              }}
            >
              Reset Form
            </Button>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSubmit}
              size="large"
              color={isEmergencyActive ? 'error' : 'primary'}
            >
              {isEmergencyActive ? 'Submit Emergency' : 'Submit Form'}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>
          {isEmergencyActive ? '🚨 Confirm Emergency Submission' : 'Confirm Submission'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit <strong>{template.name}</strong>?
          </Typography>
          {deferredFields.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <strong>{deferredFields.length} field(s)</strong> have been deferred and will need to be completed later.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={confirmSubmit}
            color={isEmergencyActive ? 'error' : 'primary'}
          >
            Confirm Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Wrapper with EmergencyProvider
export default function FormFillScreen() {
  return (
    <EmergencyProvider>
      <FormFillContent />
    </EmergencyProvider>
  );
}