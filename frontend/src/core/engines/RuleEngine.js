// src/core/engines/RuleEngine.js
import { v4 as uuidv4 } from 'uuid';
import { get } from 'lodash';

/**
 * ADAPTA Rule Engine
 * Evaluates conditions and executes actions dynamically
 * All rules are JSON-configurable - ZERO hardcoding
 */
class RuleEngine {
  constructor(rules = []) {
    this.rules = new Map();
    this.evaluationLog = [];
    this.listeners = new Map();
    
    rules.forEach(rule => this.registerRule(rule));
  }

  // ============================================
  // RULE MANAGEMENT
  // ============================================
  
  registerRule(rule) {
    this.rules.set(rule.id, rule);
  }

  unregisterRule(ruleId) {
    this.rules.delete(ruleId);
  }

  getRule(ruleId) {
    return this.rules.get(ruleId);
  }

  getAllRules() {
    return Array.from(this.rules.values());
  }

  updateRule(ruleId, updates) {
    const existing = this.rules.get(ruleId);
    if (existing) {
      this.rules.set(ruleId, { ...existing, ...updates });
    }
  }

  // ============================================
  // VALUE EXTRACTION FROM CONTEXT
  // ============================================
  
  getValue(path, context) {
    // Support nested paths: 'patient.gender', 'formData.age', 'visit.type'
    if (path.startsWith('patient.')) {
      return get(context.patient, path.replace('patient.', ''));
    }
    if (path.startsWith('visit.')) {
      return get(context.visit, path.replace('visit.', ''));
    }
    if (path.startsWith('user.')) {
      return get(context.user, path.replace('user.', ''));
    }
    if (path.startsWith('formData.')) {
      return get(context.formData, path.replace('formData.', ''));
    }
    if (path.startsWith('custom.')) {
      return get(context.custom, path.replace('custom.', ''));
    }
    // Default to formData
    return get(context.formData, path);
  }

  // ============================================
  // OPERATOR EVALUATION
  // ============================================
  
  evaluateOperator(operator, fieldValue, conditionValue) {
    const normalizedFieldValue = fieldValue ?? '';
    const normalizedConditionValue = conditionValue ?? '';

    const operators = {
      equals: () => normalizedFieldValue === normalizedConditionValue,
      
      notEquals: () => normalizedFieldValue !== normalizedConditionValue,
      
      contains: () => {
        if (Array.isArray(normalizedFieldValue)) {
          return normalizedFieldValue.includes(normalizedConditionValue);
        }
        return String(normalizedFieldValue)
          .toLowerCase()
          .includes(String(normalizedConditionValue).toLowerCase());
      },
      
      notContains: () => {
        if (Array.isArray(normalizedFieldValue)) {
          return !normalizedFieldValue.includes(normalizedConditionValue);
        }
        return !String(normalizedFieldValue)
          .toLowerCase()
          .includes(String(normalizedConditionValue).toLowerCase());
      },
      
      greaterThan: () => Number(normalizedFieldValue) > Number(normalizedConditionValue),
      
      lessThan: () => Number(normalizedFieldValue) < Number(normalizedConditionValue),
      
      greaterThanOrEqual: () => Number(normalizedFieldValue) >= Number(normalizedConditionValue),
      
      lessThanOrEqual: () => Number(normalizedFieldValue) <= Number(normalizedConditionValue),
      
      isEmpty: () => {
        if (Array.isArray(normalizedFieldValue)) {
          return normalizedFieldValue.length === 0;
        }
        return normalizedFieldValue === '' || 
               normalizedFieldValue === null || 
               normalizedFieldValue === undefined;
      },
      
      isNotEmpty: () => {
        if (Array.isArray(normalizedFieldValue)) {
          return normalizedFieldValue.length > 0;
        }
        return normalizedFieldValue !== '' && 
               normalizedFieldValue !== null && 
               normalizedFieldValue !== undefined;
      },
      
      in: () => {
        if (Array.isArray(normalizedConditionValue)) {
          return normalizedConditionValue.includes(normalizedFieldValue);
        }
        return false;
      },
      
      notIn: () => {
        if (Array.isArray(normalizedConditionValue)) {
          return !normalizedConditionValue.includes(normalizedFieldValue);
        }
        return true;
      },
      
      between: () => {
        if (Array.isArray(normalizedConditionValue) && normalizedConditionValue.length === 2) {
          const num = Number(normalizedFieldValue);
          return num >= normalizedConditionValue[0] && num <= normalizedConditionValue[1];
        }
        return false;
      },
      
      matches: () => {
        try {
          const regex = new RegExp(normalizedConditionValue);
          return regex.test(String(normalizedFieldValue));
        } catch {
          return false;
        }
      },
      
      startsWith: () => String(normalizedFieldValue).startsWith(String(normalizedConditionValue)),
      
      endsWith: () => String(normalizedFieldValue).endsWith(String(normalizedConditionValue)),
    };

    const operatorFn = operators[operator];
    if (!operatorFn) {
      console.warn(`Unknown operator: ${operator}`);
      return false;
    }
    
    return operatorFn();
  }

  // ============================================
  // CONDITION EVALUATION
  // ============================================
  
  evaluateCondition(condition, context) {
    const fieldValue = this.getValue(condition.field, context);
    let conditionValue = condition.value;

    // If comparing against another field
    if (condition.valueField) {
      conditionValue = this.getValue(condition.valueField, context);
    }

    return this.evaluateOperator(condition.operator, fieldValue, conditionValue);
  }

  evaluateConditionGroup(group, context) {
    if (!group || !group.conditions || group.conditions.length === 0) {
      return true;
    }

    const results = group.conditions.map(item => {
      if (item.conditions) {
        // It's a nested ConditionGroup
        return this.evaluateConditionGroup(item, context);
      } else {
        // It's a Condition
        return this.evaluateCondition(item, context);
      }
    });

    if (group.operator === 'AND') {
      return results.every(r => r);
    } else {
      return results.some(r => r);
    }
  }

  // ============================================
  // FORMULA EVALUATION (Safe)
  // ============================================
  
  evaluateFormula(formula, context) {
    let processedFormula = formula;

    // Replace field references with actual values
    const fieldRefPattern = /\{([^}]+)\}/g;
    processedFormula = processedFormula.replace(fieldRefPattern, (match, path) => {
      const value = this.getValue(path, context);
      return typeof value === 'number' ? String(value) : '0';
    });

    // Safe evaluation - only allow basic math operations
    try {
      if (!/^[\d\s+\-*/().]+$/.test(processedFormula)) {
        throw new Error('Invalid formula: only numeric operations allowed');
      }
      const result = Function(`"use strict"; return (${processedFormula})`)();
      return isNaN(result) ? 0 : result;
    } catch (error) {
      console.error('Formula evaluation failed:', formula, error);
      return 0;
    }
  }

  // ============================================
  // ACTION EXECUTION
  // ============================================
  
  executeAction(action, context, updateFormData) {
    try {
      switch (action.type) {
        case 'setValue':
          if (action.value !== undefined && updateFormData) {
            updateFormData(action.target, action.value);
          }
          return { success: true };

        case 'clearValue':
          if (updateFormData) {
            updateFormData(action.target, null);
          }
          return { success: true };

        case 'calculate':
          if (action.formula && updateFormData) {
            const result = this.evaluateFormula(action.formula, context);
            updateFormData(action.target, result);
          }
          return { success: true };

        case 'showAlert':
        case 'showWarning':
        case 'show':
        case 'hide':
        case 'enable':
        case 'disable':
        case 'require':
        case 'optional':
          // These are handled by field state computation
          return { success: true };

        default:
          return { success: true };
      }
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  // ============================================
  // FULL RULE EVALUATION
  // ============================================
  
  evaluateRule(rule, context, updateFormData) {
    const conditionResults = [];
    const actionsExecuted = [];

    // Evaluate all conditions
    const matched = this.evaluateConditionGroup(rule.conditions, context);

    // Build condition results for debugging
    const processConditions = (group, prefix = '') => {
      if (!group.conditions) return;
      
      group.conditions.forEach((item, index) => {
        if (item.conditions) {
          processConditions(item, `${prefix}${index}.`);
        } else {
          const result = this.evaluateCondition(item, context);
          const fieldValue = this.getValue(item.field, context);
          conditionResults.push({
            conditionId: item.id,
            result,
            details: `${item.field} (${JSON.stringify(fieldValue)}) ${item.operator} ${JSON.stringify(item.value)} = ${result}`,
          });
        }
      });
    };
    processConditions(rule.conditions);

    // Execute actions if conditions matched
    if (matched && rule.enabled && updateFormData) {
      const sortedActions = [...(rule.actions || [])].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
      
      sortedActions.forEach(action => {
        const result = this.executeAction(action, context, updateFormData);
        actionsExecuted.push({
          actionId: action.id,
          success: result.success,
          error: result.error,
        });
      });
    }

    const evaluationResult = {
      ruleId: rule.id,
      ruleName: rule.name,
      matched,
      conditionResults,
      actionsExecuted,
      timestamp: new Date().toISOString(),
    };

    this.evaluationLog.push(evaluationResult);
    this.notifyListeners(rule.id, evaluationResult);

    return evaluationResult;
  }

  evaluateAllRules(context, updateFormData) {
    const results = [];
    const sortedRules = Array.from(this.rules.values()).sort(
      (a, b) => (a.priority || 0) - (b.priority || 0)
    );

    for (const rule of sortedRules) {
      if (rule.enabled) {
        results.push(this.evaluateRule(rule, context, updateFormData));
      }
    }

    return results;
  }

  // ============================================
  // VISIBILITY EVALUATION (for fields/sections)
  // ============================================
  
  evaluateVisibility(rules, context) {
    let visible = true;
    let enabled = true;
    let required = false;

    if (!rules || rules.length === 0) {
      return { visible, enabled, required };
    }

    for (const rule of rules) {
      const matched = this.evaluateConditionGroup(rule.conditions, context);
      
      if (matched) {
        switch (rule.action) {
          case 'show':
            visible = true;
            break;
          case 'hide':
            visible = false;
            break;
          case 'enable':
            enabled = true;
            break;
          case 'disable':
            enabled = false;
            break;
          case 'require':
            required = true;
            break;
          case 'optional':
            required = false;
            break;
        }
      }
    }

    return { visible, enabled, required };
  }

  // ============================================
  // FIELD STATE COMPUTATION
  // ============================================
  
  computeFieldStates(fields, context) {
    const states = new Map();

    for (const field of fields) {
      const state = this.evaluateVisibility(field.visibilityRules, context);
      state.required = state.required || field.required;
      states.set(field.id, state);
    }

    return states;
  }

  computeSectionStates(sections, context) {
    const states = new Map();

    for (const section of sections) {
      const state = this.evaluateVisibility(section.visibilityRules, context);
      states.set(section.id, { visible: state.visible });
    }

    return states;
  }

  // ============================================
  // ALERT/WARNING EXTRACTION
  // ============================================
  
  getActiveAlerts(context) {
    const alerts = [];

    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;
      
      const matched = this.evaluateConditionGroup(rule.conditions, context);
      if (matched) {
        for (const action of (rule.actions || [])) {
          if (action.type === 'showAlert' && action.message) {
            alerts.push({ type: 'alert', message: action.message, ruleId: rule.id, severity: 'error' });
          }
          if (action.type === 'showWarning' && action.message) {
            alerts.push({ type: 'warning', message: action.message, ruleId: rule.id, severity: 'warning' });
          }
        }
      }
    }

    return alerts;
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  
  subscribe(ruleId, callback) {
    const key = ruleId;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);

    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  notifyListeners(ruleId, result) {
    // Notify specific rule listeners
    this.listeners.get(ruleId)?.forEach(cb => cb(result));
    // Notify global listeners
    this.listeners.get('*')?.forEach(cb => cb(result));
  }

  // ============================================
  // DEBUGGING & EXPLANATION
  // ============================================
  
  getEvaluationLog() {
    return [...this.evaluationLog];
  }

  clearEvaluationLog() {
    this.evaluationLog = [];
  }

  explainFieldVisibility(field, context) {
    const reasons = [];
    let visible = true;

    if (!field.visibilityRules || field.visibilityRules.length === 0) {
      return { visible: true, reasons: ['No visibility rules defined - field is always visible'] };
    }

    for (const rule of field.visibilityRules) {
      const matched = this.evaluateConditionGroup(rule.conditions, context);
      reasons.push(
        `Rule ${rule.id}: Conditions ${matched ? 'MATCHED' : 'NOT MATCHED'} → Action: ${rule.action}`
      );
      
      if (matched) {
        if (rule.action === 'hide') visible = false;
        if (rule.action === 'show') visible = true;
      }
    }

    return { visible, reasons };
  }

  // ============================================
  // STATIC BUILDER HELPERS
  // ============================================
  
  static createCondition(field, operator, value) {
    return {
      id: uuidv4(),
      field,
      operator,
      value,
    };
  }

  static createConditionGroup(operator, conditions) {
    return {
      id: uuidv4(),
      operator,
      conditions,
    };
  }

  static createRule(name, conditions, actions, options = {}) {
    return {
      id: uuidv4(),
      name,
      description: options.description,
      enabled: options.enabled ?? true,
      priority: options.priority ?? 0,
      conditions,
      actions,
      category: options.category,
      tags: options.tags,
    };
  }

  static createAction(type, target, options = {}) {
    return {
      id: uuidv4(),
      type,
      target,
      value: options.value,
      message: options.message,
      formula: options.formula,
      priority: options.priority ?? 0,
    };
  }

  // ============================================
  // SERIALIZATION
  // ============================================
  
  exportRules() {
    return JSON.stringify(Array.from(this.rules.values()), null, 2);
  }

  importRules(json) {
    const rules = JSON.parse(json);
    rules.forEach(rule => this.registerRule(rule));
  }
}

// Factory function
export const createRuleEngine = (rules) => new RuleEngine(rules);

export default RuleEngine;