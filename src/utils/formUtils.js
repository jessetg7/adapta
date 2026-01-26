/**
 * Form Utilities for ADAPTA LCNC Platform
 * Handles template loading, saving, and management
 */

// Import the templates registry
import templatesRegistry from '../data/templates.json';

/**
 * Get all template metadata (from registry)
 * Used for template galleries, listings, search
 */
export const getTemplatesRegistry = () => {
  // First check localStorage for any user-created templates
  const storedTemplates = localStorage.getItem('adapta_templates_registry');
  if (storedTemplates) {
    try {
      return JSON.parse(storedTemplates);
    } catch (e) {
      console.error('Error parsing stored templates registry:', e);
    }
  }
  return templatesRegistry;
};

/**
 * Get all template categories
 */
export const getTemplateCategories = () => {
  const registry = getTemplatesRegistry();
  return registry.categories || [];
};

/**
 * Get template metadata by ID (from registry)
 */
export const getTemplateMetadata = (templateId) => {
  const registry = getTemplatesRegistry();
  return registry.templates.find(t => t.id === templateId) || null;
};

/**
 * Load full template definition
 * Dynamically imports from templates folder or localStorage
 */
export const loadTemplateDefinition = async (templateId) => {
  // First check localStorage for user-modified templates
  const storedTemplate = localStorage.getItem(`adapta_template_${templateId}`);
  if (storedTemplate) {
    try {
      return JSON.parse(storedTemplate);
    } catch (e) {
      console.error('Error parsing stored template:', e);
    }
  }

  // Get metadata to find the file name
  const metadata = getTemplateMetadata(templateId);
  if (!metadata) {
    throw new Error(`Template not found: ${templateId}`);
  }

  // Dynamic import based on file name
  try {
    let templateModule;
    switch (metadata.file) {
      case 'cardiology.json':
        templateModule = await import('../data/templates/cardiology.json');
        break;
      case 'generalOPD.json':
        templateModule = await import('../data/templates/generalOPD.json');
        break;
      case 'pediatrics.json':
        templateModule = await import('../data/templates/pediatrics.json');
        break;
      default:
        throw new Error(`Unknown template file: ${metadata.file}`);
    }
    return templateModule.default || templateModule;
  } catch (error) {
    console.error('Error loading template:', error);
    throw error;
  }
};

/**
 * Save template to localStorage
 */
export const saveTemplate = (template) => {
  // Save the full template definition
  localStorage.setItem(`adapta_template_${template.id}`, JSON.stringify(template));

  // Update the registry
  const registry = getTemplatesRegistry();
  const existingIndex = registry.templates.findIndex(t => t.id === template.id);

  const metadata = {
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    version: template.version,
    author: template.author,
    icon: template.icon,
    color: template.color,
    file: `${template.id}.json`,
    tags: template.tags || [],
    isPublished: template.isPublished ?? false,
    createdAt: template.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: template.usageCount || 0
  };

  if (existingIndex >= 0) {
    registry.templates[existingIndex] = metadata;
  } else {
    registry.templates.push(metadata);
  }

  localStorage.setItem('adapta_templates_registry', JSON.stringify(registry));

  return template;
};

/**
 * Delete template
 */
export const deleteTemplate = (templateId) => {
  // Remove from localStorage
  localStorage.removeItem(`adapta_template_${templateId}`);

  // Update registry
  const registry = getTemplatesRegistry();
  registry.templates = registry.templates.filter(t => t.id !== templateId);
  localStorage.setItem('adapta_templates_registry', JSON.stringify(registry));
};

/**
 * Export template as downloadable JSON
 */
export const exportTemplateAsJSON = async (templateId) => {
  const template = await loadTemplateDefinition(templateId);
  const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-template.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import template from JSON file
 */
export const importTemplateFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const template = JSON.parse(e.target.result);
        
        // Validate template structure
        if (!template.id || !template.name || !template.sections) {
          throw new Error('Invalid template structure');
        }

        // Generate new ID to avoid conflicts
        template.id = `${template.id}-imported-${Date.now()}`;
        template.createdAt = new Date().toISOString();
        template.updatedAt = new Date().toISOString();
        
        // Save the imported template
        saveTemplate(template);
        resolve(template);
      } catch (error) {
        reject(new Error('Failed to parse template JSON: ' + error.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Duplicate a template
 */
export const duplicateTemplate = async (templateId) => {
  const original = await loadTemplateDefinition(templateId);
  const duplicate = {
    ...original,
    id: `${original.id}-copy-${Date.now()}`,
    name: `${original.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0
  };
  
  return saveTemplate(duplicate);
};

/**
 * Generate unique field ID
 */
export const generateFieldId = () => {
  return `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate unique section ID
 */
export const generateSectionId = () => {
  return `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate form data against template
 */
export const validateFormData = (template, formData) => {
  const errors = {};

  template.sections.forEach(section => {
    section.fields.forEach(field => {
      const value = formData[field.id];

      // Check required fields
      if (field.required && (value === undefined || value === null || value === '')) {
        errors[field.id] = `${field.label} is required`;
        return;
      }

      // Skip validation if field is empty and not required
      if (value === undefined || value === null || value === '') {
        return;
      }

      // Validate based on field type and validation rules
      if (field.validation) {
        if (field.validation.minLength && value.length < field.validation.minLength) {
          errors[field.id] = `${field.label} must be at least ${field.validation.minLength} characters`;
        }
        if (field.validation.maxLength && value.length > field.validation.maxLength) {
          errors[field.id] = `${field.label} must be at most ${field.validation.maxLength} characters`;
        }
        if (field.validation.min !== undefined && Number(value) < field.validation.min) {
          errors[field.id] = `${field.label} must be at least ${field.validation.min}`;
        }
        if (field.validation.max !== undefined && Number(value) > field.validation.max) {
          errors[field.id] = `${field.label} must be at most ${field.validation.max}`;
        }
        if (field.validation.pattern) {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(value)) {
            errors[field.id] = `${field.label} has invalid format`;
          }
        }
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Check if field should be visible based on conditional visibility
 */
export const isFieldVisible = (field, formData) => {
  if (!field.conditionalVisibility) {
    return true;
  }

  const { dependsOn, condition, value } = field.conditionalVisibility;
  const dependentValue = formData[dependsOn];

  switch (condition) {
    case 'equals':
      return dependentValue === value;
    case 'notEquals':
      return dependentValue !== value;
    case 'contains':
      return String(dependentValue).includes(value);
    case 'greaterThan':
      return Number(dependentValue) > Number(value);
    case 'lessThan':
      return Number(dependentValue) < Number(value);
    case 'in':
      return Array.isArray(value) && value.includes(dependentValue);
    case 'notIn':
      return Array.isArray(value) && !value.includes(dependentValue);
    case 'isEmpty':
      return !dependentValue || dependentValue === '';
    case 'isNotEmpty':
      return dependentValue && dependentValue !== '';
    default:
      return true;
  }
};

/**
 * Get default form values from template
 */
export const getDefaultFormValues = (template) => {
  const values = {};
  
  template.sections.forEach(section => {
    section.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        values[field.id] = field.defaultValue;
      }
    });
  });

  return values;
};

/**
 * Flatten all fields from a template
 */
export const flattenTemplateFields = (template) => {
  const fields = [];
  
  template.sections.forEach(section => {
    section.fields.forEach(field => {
      fields.push({
        ...field,
        sectionId: section.id,
        sectionTitle: section.title
      });
    });
  });

  return fields.sort((a, b) => a.order - b.order);
};

/**
 * Search templates
 */
export const searchTemplates = (query, category = null) => {
  const registry = getTemplatesRegistry();
  let templates = registry.templates;

  if (category) {
    templates = templates.filter(t => 
      t.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (query) {
    const lowerQuery = query.toLowerCase();
    templates = templates.filter(t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }

  return templates;
};

export default {
  getTemplatesRegistry,
  getTemplateCategories,
  getTemplateMetadata,
  loadTemplateDefinition,
  saveTemplate,
  deleteTemplate,
  exportTemplateAsJSON,
  importTemplateFromJSON,
  duplicateTemplate,
  generateFieldId,
  generateSectionId,
  validateFormData,
  isFieldVisible,
  getDefaultFormValues,
  flattenTemplateFields,
  searchTemplates
};