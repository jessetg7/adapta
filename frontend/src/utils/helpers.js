// src/utils/helpers.js
/**
 * ADAPTA Helper Utilities
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate unique ID
 */
export const generateId = () => uuidv4();

/**
 * Deep clone an object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

/**
 * Format date to locale string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
};

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export const formatDateISO = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Format time
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  const date = new Date(`2000-01-01T${timeString}`);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get nested value from object using dot notation
 */
export const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Set nested value in object using dot notation
 */
export const setNestedValue = (obj, path, value) => {
  if (!obj || !path) return obj;
  
  const clone = deepClone(obj);
  const keys = path.split('.');
  let current = clone;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
  return clone;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert camelCase to Title Case
 */
export const camelToTitle = (str) => {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

/**
 * Convert string to slug
 */
export const toSlug = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Truncate string
 */
export const truncate = (str, length = 50, suffix = '...') => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length).trim() + suffix;
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string') return obj.trim().length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Merge objects deeply
 */
export const deepMerge = (target, source) => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

/**
 * Sort array of objects by key
 */
export const sortByKey = (array, key, ascending = true) => {
  return [...array].sort((a, b) => {
    const aVal = getNestedValue(a, key);
    const bVal = getNestedValue(b, key);
    
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = getNestedValue(item, key) || 'undefined';
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {});
};

/**
 * Remove duplicates from array
 */
export const unique = (array, key = null) => {
  if (!key) {
    return [...new Set(array)];
  }
  const seen = new Set();
  return array.filter((item) => {
    const value = getNestedValue(item, key);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * Calculate BMI
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  // Weight in kg, height in cm
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10;
};

/**
 * Get BMI category
 */
export const getBMICategory = (bmi) => {
  if (!bmi) return 'Unknown';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

/**
 * Convert temperature Celsius to Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
  if (celsius === null || celsius === undefined) return null;
  return Math.round((celsius * 9 / 5 + 32) * 10) / 10;
};

/**
 * Convert temperature Fahrenheit to Celsius
 */
export const fahrenheitToCelsius = (fahrenheit) => {
  if (fahrenheit === null || fahrenheit === undefined) return null;
  return Math.round(((fahrenheit - 32) * 5 / 9) * 10) / 10;
};

/**
 * Convert weight kg to lb
 */
export const kgToLb = (kg) => {
  if (kg === null || kg === undefined) return null;
  return Math.round(kg * 2.20462 * 10) / 10;
};

/**
 * Convert weight lb to kg
 */
export const lbToKg = (lb) => {
  if (lb === null || lb === undefined) return null;
  return Math.round(lb / 2.20462 * 10) / 10;
};

/**
 * Convert height cm to feet and inches
 */
export const cmToFeetInches = (cm) => {
  if (cm === null || cm === undefined) return null;
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches, display: `${feet}'${inches}"` };
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate random color
 */
export const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Download file from data
 */
export const downloadFile = (data, filename, type = 'application/json') => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Parse JSON safely
 */
export const safeJsonParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

export default {
  generateId,
  deepClone,
  calculateAge,
  formatDate,
  formatDateISO,
  formatTime,
  getNestedValue,
  setNestedValue,
  debounce,
  throttle,
  capitalize,
  camelToTitle,
  toSlug,
  truncate,
  isEmpty,
  deepMerge,
  sortByKey,
  groupBy,
  unique,
  calculateBMI,
  getBMICategory,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  kgToLb,
  lbToKg,
  cmToFeetInches,
  formatFileSize,
  randomColor,
  copyToClipboard,
  downloadFile,
  safeJsonParse,
};