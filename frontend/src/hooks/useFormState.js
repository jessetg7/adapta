// src/hooks/useFormState.js
import { useState, useCallback, useMemo, useEffect } from 'react';
import useRuleEngine from './useRuleEngine';

/**
 * Hook to manage form state with rule engine integration
 */
export const useFormState = (template, initialData = {}, rules = [], context = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const { evaluateVisibility, getActiveAlerts, evaluationLog } = useRuleEngine(rules);

  // Build evaluation context
  const evaluationContext = useMemo(() => ({
    ...context,
    formData,
    timestamp: new Date().toISOString(),
  }), [context, formData]);

  // Get active alerts
  const alerts = useMemo(() => {
    return getActiveAlerts(evaluationContext);
  }, [getActiveAlerts, evaluationContext]);

  // Compute field states
  const fieldStates = useMemo(() => {
    const states = {};
    
    if (!template?.sections) return states;

    template.sections.forEach(section => {
      section.fields?.forEach(field => {
        const state = evaluateVisibility(field.visibilityRules, evaluationContext);
        state.required = state.required || field.required;
        states[field.id] = state;
      });
    });

    return states;
  }, [template, evaluateVisibility, evaluationContext]);

  // Compute section states
  const sectionStates = useMemo(() => {
    const states = {};
    
    if (!template?.sections) return states;

    template.sections.forEach(section => {
      const state = evaluateVisibility(section.visibilityRules, evaluationContext);
      states[section.id] = state;
    });

    return states;
  }, [template, evaluateVisibility, evaluationContext]);

  // Set field value
  const setFieldValue = useCallback((fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
    setIsDirty(true);

    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  }, [errors]);

  // Set multiple field values
  const setFieldValues = useCallback((values) => {
    setFormData(prev => ({
      ...prev,
      ...values,
    }));
    setIsDirty(true);
  }, []);

  // Mark field as touched
  const setFieldTouched = useCallback((fieldId, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldId]: isTouched,
    }));
  }, []);

  // Validate single field
  const validateField = useCallback((field, value) => {
    const fieldState = fieldStates[field.id] || {};
    const isRequired = fieldState.required || field.required;

    // Required validation
    if (isRequired && (value === undefined || value === null || value === '')) {
      return `${field.label} is required`;
    }

    // Custom validations
    if (field.validation && value) {
      for (const rule of field.validation) {
        switch (rule.type) {
          case 'min':
            if (Number(value) < rule.value) {
              return rule.message || `Minimum value is ${rule.value}`;
            }
            break;
          case 'max':
            if (Number(value) > rule.value) {
              return rule.message || `Maximum value is ${rule.value}`;
            }
            break;
          case 'minLength':
            if (String(value).length < rule.value) {
              return rule.message || `Minimum length is ${rule.value}`;
            }
            break;
          case 'maxLength':
            if (String(value).length > rule.value) {
              return rule.message || `Maximum length is ${rule.value}`;
            }
            break;
          case 'pattern':
            if (!new RegExp(rule.value).test(String(value))) {
              return rule.message || 'Invalid format';
            }
            break;
          case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
              return rule.message || 'Invalid email address';
            }
            break;
          case 'phone':
            if (!/^[\d\s\-+()]{10,}$/.test(String(value))) {
              return rule.message || 'Invalid phone number';
            }
            break;
        }
      }
    }

    return null;
  }, [fieldStates]);

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};

    template.sections?.forEach(section => {
      const sectionState = sectionStates[section.id];
      if (sectionState?.visible === false) return;

      section.fields?.forEach(field => {
        const fieldState = fieldStates[field.id];
        if (fieldState?.visible === false) return;

        const value = formData[field.id];
        const error = validateField(field, value);
        
        if (error) {
          newErrors[field.id] = error;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [template, formData, fieldStates, sectionStates, validateField]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialData]);

  // Get field props helper
  const getFieldProps = useCallback((fieldId) => {
    const fieldState = fieldStates[fieldId] || {};
    
    return {
      value: formData[fieldId],
      onChange: (value) => setFieldValue(fieldId, value),
      onBlur: () => setFieldTouched(fieldId),
      error: errors[fieldId],
      disabled: !fieldState.enabled,
      required: fieldState.required,
    };
  }, [formData, fieldStates, errors, setFieldValue, setFieldTouched]);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    isDirty,
    alerts,
    fieldStates,
    sectionStates,
    setFieldValue,
    setFieldValues,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    setIsSubmitting,
    getFieldProps,
    evaluationContext,
    evaluationLog,
  };
};

export default useFormState;