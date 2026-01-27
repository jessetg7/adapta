// src/utils/validators.js
/**
 * ADAPTA Validation Utilities
 * All validation logic is configurable via JSON rules
 */

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^[\d\s\-+()]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

/**
 * Validate minimum length
 */
export const minLength = (value, min) => {
  if (!value) return false;
  return String(value).length >= min;
};

/**
 * Validate maximum length
 */
export const maxLength = (value, max) => {
  if (!value) return true;
  return String(value).length <= max;
};

/**
 * Validate minimum value (numeric)
 */
export const minValue = (value, min) => {
  if (value === null || value === undefined || value === '') return true;
  return Number(value) >= min;
};

/**
 * Validate maximum value (numeric)
 */
export const maxValue = (value, max) => {
  if (value === null || value === undefined || value === '') return true;
  return Number(value) <= max;
};

/**
 * Validate pattern (regex)
 */
export const matchesPattern = (value, pattern) => {
  if (!value) return true;
  try {
    const regex = new RegExp(pattern);
    return regex.test(String(value));
  } catch {
    return false;
  }
};

/**
 * Validate date is in the past
 */
export const isPastDate = (value) => {
  if (!value) return true;
  const date = new Date(value);
  return date < new Date();
};

/**
 * Validate date is in the future
 */
export const isFutureDate = (value) => {
  if (!value) return true;
  const date = new Date(value);
  return date > new Date();
};

/**
 * Validate age range
 */
export const isValidAge = (dateOfBirth, minAge = 0, maxAge = 150) => {
  if (!dateOfBirth) return false;
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= minAge && age <= maxAge;
};

/**
 * Validate numeric value
 */
export const isNumeric = (value) => {
  if (value === null || value === undefined || value === '') return false;
  return !isNaN(Number(value));
};

/**
 * Validate integer
 */
export const isInteger = (value) => {
  if (!isNumeric(value)) return false;
  return Number.isInteger(Number(value));
};

/**
 * Validate positive number
 */
export const isPositive = (value) => {
  if (!isNumeric(value)) return false;
  return Number(value) > 0;
};

/**
 * Validate value is in list
 */
export const isInList = (value, list) => {
  if (!value || !Array.isArray(list)) return false;
  return list.includes(value);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate field based on validation rules array
 * @param {any} value - Field value
 * @param {Array} rules - Array of validation rule objects
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (value, rules = []) => {
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!isRequired(value)) {
          return rule.message || 'This field is required';
        }
        break;

      case 'email':
        if (value && !isValidEmail(value)) {
          return rule.message || 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (value && !isValidPhone(value)) {
          return rule.message || 'Please enter a valid phone number';
        }
        break;

      case 'minLength':
        if (value && !minLength(value, rule.value)) {
          return rule.message || `Minimum ${rule.value} characters required`;
        }
        break;

      case 'maxLength':
        if (!maxLength(value, rule.value)) {
          return rule.message || `Maximum ${rule.value} characters allowed`;
        }
        break;

      case 'min':
        if (!minValue(value, rule.value)) {
          return rule.message || `Minimum value is ${rule.value}`;
        }
        break;

      case 'max':
        if (!maxValue(value, rule.value)) {
          return rule.message || `Maximum value is ${rule.value}`;
        }
        break;

      case 'pattern':
        if (value && !matchesPattern(value, rule.value)) {
          return rule.message || 'Invalid format';
        }
        break;

      case 'numeric':
        if (value && !isNumeric(value)) {
          return rule.message || 'Please enter a valid number';
        }
        break;

      case 'integer':
        if (value && !isInteger(value)) {
          return rule.message || 'Please enter a whole number';
        }
        break;

      case 'positive':
        if (value && !isPositive(value)) {
          return rule.message || 'Please enter a positive number';
        }
        break;

      case 'url':
        if (value && !isValidUrl(value)) {
          return rule.message || 'Please enter a valid URL';
        }
        break;

      case 'pastDate':
        if (value && !isPastDate(value)) {
          return rule.message || 'Date must be in the past';
        }
        break;

      case 'futureDate':
        if (value && !isFutureDate(value)) {
          return rule.message || 'Date must be in the future';
        }
        break;

      case 'custom':
        // Custom validation function stored as string
        if (rule.customFunction) {
          try {
            const fn = new Function('value', rule.customFunction);
            if (!fn(value)) {
              return rule.message || 'Validation failed';
            }
          } catch (error) {
            console.error('Custom validation error:', error);
          }
        }
        break;

      default:
        break;
    }
  }

  return null; // No errors
};

/**
 * Validate entire form
 * @param {Object} formData - Form data object
 * @param {Array} fields - Array of field configurations
 * @returns {Object} - Object with field errors { fieldId: errorMessage }
 */
export const validateForm = (formData, fields) => {
  const errors = {};

  for (const field of fields) {
    const value = formData[field.id] ?? formData[field.name];
    
    // Check required
    if (field.required && !isRequired(value)) {
      errors[field.id] = `${field.label} is required`;
      continue;
    }

    // Check validation rules
    if (field.validation && field.validation.length > 0) {
      const error = validateField(value, field.validation);
      if (error) {
        errors[field.id] = error;
      }
    }
  }

  return errors;
};

/**
 * Check if form has any errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

export default {
  isValidEmail,
  isValidPhone,
  isRequired,
  minLength,
  maxLength,
  minValue,
  maxValue,
  matchesPattern,
  isPastDate,
  isFutureDate,
  isValidAge,
  isNumeric,
  isInteger,
  isPositive,
  isInList,
  isValidUrl,
  validateField,
  validateForm,
  hasErrors,
};