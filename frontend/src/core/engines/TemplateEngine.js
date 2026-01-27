// src/core/engines/TemplateEngine.js
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import RuleEngine from './RuleEngine';

/**
 * ADAPTA Template Engine
 * Manages form templates, prescription templates, and their lifecycle
 * Everything is JSON-driven and configurable
 */
class TemplateEngine {
  constructor(ruleEngine = null) {
    this.templates = new Map();
    this.prescriptionTemplates = new Map();
    this.ruleEngine = ruleEngine || new RuleEngine();
  }

  // ============================================
  // TEMPLATE MANAGEMENT
  // ============================================
  
  registerTemplate(template) {
    this.templates.set(template.id, template);
  }

  unregisterTemplate(templateId) {
    this.templates.delete(templateId);
  }

  getTemplate(templateId) {
    return this.templates.get(templateId);
  }

  getAllTemplates() {
    return Array.from(this.templates.values());
  }

  getTemplatesByType(type) {
    return this.getAllTemplates().filter(t => t.type === type);
  }

  getTemplatesByCategory(category) {
    return this.getAllTemplates().filter(t => t.category === category);
  }

  getTemplatesByDepartment(department) {
    return this.getAllTemplates().filter(t => t.department === department);
  }

  getActiveTemplates() {
    return this.getAllTemplates().filter(t => t.metadata?.isActive !== false);
  }

  // ============================================
  // AGE CALCULATION HELPER
  // ============================================
  
  calculateAge(dateOfBirth) {
    if (!dateOfBirth) return undefined;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  // ============================================
  // TEMPLATE FILTERING BY CONTEXT
  // ============================================
  
  getApplicableTemplates(context) {
    return this.getActiveTemplates().filter(template => {
      // Check gender specificity
      if (template.genderSpecific && template.genderSpecific !== 'all') {
        const patientGender = context.patient?.gender;
        if (template.genderSpecific === 'pediatric') {
          const age = context.patient?.age ?? this.calculateAge(context.patient?.dateOfBirth);
          if (!age || age > 18) return false;
        } else if (patientGender !== template.genderSpecific) {
          return false;
        }
      }

      // Check age range
      if (template.ageRange) {
        const age = context.patient?.age ?? this.calculateAge(context.patient?.dateOfBirth);
        if (age !== undefined) {
          if (template.ageRange.min !== undefined && age < template.ageRange.min) return false;
          if (template.ageRange.max !== undefined && age > template.ageRange.max) return false;
        }
      }

      // Check visit type
      if (template.visitType && template.visitType !== 'all') {
        if (context.visit?.type !== template.visitType) return false;
      }

      // Check visibility rules
      if (template.visibilityRules && template.visibilityRules.length > 0) {
        const visibility = this.ruleEngine.evaluateVisibility(template.visibilityRules, context);
        if (!visibility.visible) return false;
      }

      return true;
    });
  }

  // ============================================
  // TEMPLATE RENDERING
  // ============================================
  
  renderTemplate(templateId, context) {
    const template = this.templates.get(templateId);
    if (!template) return null;

    const hiddenFields = new Set();
    const disabledFields = new Set();
    const requiredFields = new Set();

    // Deep clone to avoid mutations
    const renderedSections = cloneDeep(template.sections);

    // Process each section
    const visibleSections = renderedSections.filter(section => {
      const sectionVisibility = this.ruleEngine.evaluateVisibility(section.visibilityRules, context);
      return sectionVisibility.visible;
    });

    // Process fields in visible sections
    for (const section of visibleSections) {
      section.fields = section.fields.filter(field => {
        const fieldState = this.ruleEngine.evaluateVisibility(field.visibilityRules, context);
        
        if (!fieldState.visible) {
          hiddenFields.add(field.id);
          return false;
        }
        
        if (!fieldState.enabled) {
          disabledFields.add(field.id);
        }
        
        if (fieldState.required || field.required) {
          requiredFields.add(field.id);
        }

        return true;
      });
    }

    return {
      sections: visibleSections,
      hiddenFields,
      disabledFields,
      requiredFields,
    };
  }

  // ============================================
  // TEMPLATE CREATION & MODIFICATION
  // ============================================
  
  createTemplate(name, type, category, options = {}) {
    const template = {
      id: uuidv4(),
      name,
      type,
      category,
      version: 1,
      department: options.department,
      genderSpecific: options.genderSpecific ?? 'all',
      ageRange: options.ageRange,
      visitType: options.visitType ?? 'all',
      sections: options.sections || [],
      visibilityRules: options.visibilityRules,
      metadata: {
        author: options.metadata?.author || 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: options.metadata?.description,
        tags: options.metadata?.tags,
        isSystem: false,
        isActive: true,
        usageCount: 0,
      },
      printConfig: options.printConfig,
    };

    this.templates.set(template.id, template);
    return template;
  }

  updateTemplate(templateId, updates) {
    const existing = this.templates.get(templateId);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      version: existing.version + 1,
      metadata: {
        ...existing.metadata,
        ...updates.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    this.templates.set(templateId, updated);
    return updated;
  }

  cloneTemplate(templateId, newName = null) {
    const original = this.templates.get(templateId);
    if (!original) return null;

    const cloned = {
      ...cloneDeep(original),
      id: uuidv4(),
      name: newName || `${original.name} (Copy)`,
      version: 1,
      metadata: {
        ...original.metadata,
        author: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSystem: false,
      },
    };

    // Regenerate IDs for sections and fields
    cloned.sections = cloned.sections.map(section => ({
      ...section,
      id: uuidv4(),
      fields: section.fields.map(field => ({
        ...field,
        id: uuidv4(),
      })),
    }));

    this.templates.set(cloned.id, cloned);
    return cloned;
  }

  deleteTemplate(templateId) {
    const template = this.templates.get(templateId);
    if (!template || template.metadata?.isSystem) {
      return false;
    }
    return this.templates.delete(templateId);
  }

  // ============================================
  // SECTION MANAGEMENT
  // ============================================
  
  addSection(templateId, sectionData) {
    const template = this.templates.get(templateId);
    if (!template) return null;

    const newSection = {
      id: uuidv4(),
      title: sectionData.title || 'New Section',
      description: sectionData.description,
      collapsible: sectionData.collapsible ?? true,
      defaultCollapsed: sectionData.defaultCollapsed ?? false,
      fields: sectionData.fields || [],
      visibilityRules: sectionData.visibilityRules,
      order: template.sections.length,
      columns: sectionData.columns ?? 2,
      icon: sectionData.icon,
      color: sectionData.color,
    };

    template.sections.push(newSection);
    template.metadata.updatedAt = new Date().toISOString();
    template.version++;

    return newSection;
  }

  updateSection(templateId, sectionId, updates) {
    const template = this.templates.get(templateId);
    if (!template) return false;

    const sectionIndex = template.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return false;

    template.sections[sectionIndex] = {
      ...template.sections[sectionIndex],
      ...updates,
    };
    template.metadata.updatedAt = new Date().toISOString();
    template.version++;

    return true;
  }

  removeSection(templateId, sectionId) {
    const template = this.templates.get(templateId);
    if (!template) return false;

    const initialLength = template.sections.length;
    template.sections = template.sections.filter(s => s.id !== sectionId);
    
    if (template.sections.length < initialLength) {
      // Reorder remaining sections
      template.sections.forEach((s, i) => (s.order = i));
      template.metadata.updatedAt = new Date().toISOString();
      template.version++;
      return true;
    }
    return false;
  }

  reorderSections(templateId, sectionIds) {
    const template = this.templates.get(templateId);
    if (!template) return false;

    const sectionMap = new Map(template.sections.map(s => [s.id, s]));
    const reorderedSections = [];

    for (let i = 0; i < sectionIds.length; i++) {
      const section = sectionMap.get(sectionIds[i]);
      if (section) {
        reorderedSections.push({ ...section, order: i });
      }
    }

    template.sections = reorderedSections;
    template.metadata.updatedAt = new Date().toISOString();
    template.version++;

    return true;
  }

  // ============================================
  // FIELD MANAGEMENT
  // ============================================
  
  addField(templateId, sectionId, fieldData) {
    const template = this.templates.get(templateId);
    if (!template) return null;

    const section = template.sections.find(s => s.id === sectionId);
    if (!section) return null;

    const newField = {
      id: uuidv4(),
      type: fieldData.type || 'text',
      name: fieldData.name || `field_${Date.now()}`,
      label: fieldData.label || 'New Field',
      required: fieldData.required ?? false,
      defaultValue: fieldData.defaultValue,
      validation: fieldData.validation,
      visibilityRules: fieldData.visibilityRules,
      options: fieldData.options,
      config: fieldData.config,
      order: section.fields.length,
      width: fieldData.width ?? 'full',
      description: fieldData.description,
      tags: fieldData.tags,
    };

    section.fields.push(newField);
    template.metadata.updatedAt = new Date().toISOString();
    template.version++;

    return newField;
  }

  updateField(templateId, sectionId, fieldId, updates) {
    const template = this.templates.get(templateId);
    if (!template) return false;

    const section = template.sections.find(s => s.id === sectionId);
    if (!section) return false;

    const fieldIndex = section.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex === -1) return false;

    section.fields[fieldIndex] = {
      ...section.fields[fieldIndex],
      ...updates,
    };
    template.metadata.updatedAt = new Date().toISOString();
    template.version++;

    return true;
  }

  removeField(templateId, sectionId, fieldId) {
    const template = this.templates.get(templateId);
    if (!template) return false;

    const section = template.sections.find(s => s.id === sectionId);
    if (!section) return false;

    const initialLength = section.fields.length;
    section.fields = section.fields.filter(f => f.id !== fieldId);
    
    if (section.fields.length < initialLength) {
      section.fields.forEach((f, i) => (f.order = i));
      template.metadata.updatedAt = new Date().toISOString();
      template.version++;
      return true;
    }
    return false;
  }

  moveField(templateId, fromSectionId, toSectionId, fieldId, newIndex) {
    const template = this.templates.get(templateId);
    if (!template) return false;

    const fromSection = template.sections.find(s => s.id === fromSectionId);
    const toSection = template.sections.find(s => s.id === toSectionId);
    if (!fromSection || !toSection) return false;

    const fieldIndex = fromSection.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex === -1) return false;

    const [field] = fromSection.fields.splice(fieldIndex, 1);
    toSection.fields.splice(newIndex, 0, { ...field, order: newIndex });

    // Update orders
    toSection.fields.forEach((f, i) => (f.order = i));
    fromSection.fields.forEach((f, i) => (f.order = i));

    template.metadata.updatedAt = new Date().toISOString();
    template.version++;

    return true;
  }

  // ============================================
  // PRESCRIPTION TEMPLATES
  // ============================================
  
  registerPrescriptionTemplate(template) {
    this.prescriptionTemplates.set(template.id, template);
  }

  getPrescriptionTemplate(templateId) {
    return this.prescriptionTemplates.get(templateId);
  }

  getAllPrescriptionTemplates() {
    return Array.from(this.prescriptionTemplates.values());
  }

  // ============================================
  // VALIDATION
  // ============================================
  
  validateTemplate(template) {
    const errors = [];

    if (!template.name || template.name.trim() === '') {
      errors.push('Template name is required');
    }

    if (!template.type) {
      errors.push('Template type is required');
    }

    if (!template.sections || template.sections.length === 0) {
      errors.push('Template must have at least one section');
    }

    // Check for duplicate field names
    const fieldNames = new Set();
    for (const section of (template.sections || [])) {
      for (const field of (section.fields || [])) {
        if (fieldNames.has(field.name)) {
          errors.push(`Duplicate field name: ${field.name}`);
        }
        fieldNames.add(field.name);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // ============================================
  // SERIALIZATION
  // ============================================
  
  exportTemplate(templateId) {
    const template = this.templates.get(templateId);
    if (!template) return null;
    return JSON.stringify(template, null, 2);
  }

  exportAllTemplates() {
    return JSON.stringify(Array.from(this.templates.values()), null, 2);
  }

  importTemplate(json) {
    try {
      const template = JSON.parse(json);
      template.id = uuidv4();
      template.metadata.isSystem = false;
      this.templates.set(template.id, template);
      return template;
    } catch {
      return null;
    }
  }

  importTemplates(json) {
    try {
      const templates = JSON.parse(json);
      templates.forEach(t => {
        t.id = uuidv4();
        t.metadata.isSystem = false;
        this.templates.set(t.id, t);
      });
      return templates.length;
    } catch {
      return 0;
    }
  }
}

// Factory function
export const createTemplateEngine = (ruleEngine) => new TemplateEngine(ruleEngine);

export default TemplateEngine;