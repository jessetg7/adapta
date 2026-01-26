import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import ruleDefinitions from '../data/ruleDefinitions.json';

const RuleEngineContext = createContext(null);

export function RuleEngineProvider({ children }) {
  const [rules, setRules] = useState(ruleDefinitions.rules);
  const [operators] = useState(ruleDefinitions.operators);
  const [actionTypes] = useState(ruleDefinitions.actionTypes);
  const [ruleCategories] = useState(ruleDefinitions.categories);

  const [activeRules, setActiveRules] = useState([]);
  const [firedRules, setFiredRules] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [ruleExplanations, setRuleExplanations] = useState([]);

  // Evaluate a single condition
  const evaluateCondition = useCallback((condition, formData) => {
    const { field, operator, value } = condition;
    const fieldValue = formData[field];

    if (fieldValue === undefined || fieldValue === null) {
      return operator === 'isEmpty';
    }

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'notEquals':
        return fieldValue !== value;
      case 'greaterThan':
        return parseFloat(fieldValue) > parseFloat(value);
      case 'lessThan':
        return parseFloat(fieldValue) < parseFloat(value);
      case 'greaterThanOrEqual':
        return parseFloat(fieldValue) >= parseFloat(value);
      case 'lessThanOrEqual':
        return parseFloat(fieldValue) <= parseFloat(value);
      case 'contains':
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(value);
        }
        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      case 'in':
        return Array.isArray(value) ? value.includes(fieldValue) : false;
      case 'isEmpty':
        return !fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0);
      case 'isNotEmpty':
        return fieldValue && (!Array.isArray(fieldValue) || fieldValue.length > 0);
      default:
        console.warn(`Unknown operator: ${operator}`);
        return false;
    }
  }, []);

  // Evaluate compound conditions (AND/OR)
  const evaluateCompoundCondition = useCallback((condition, formData) => {
    if (condition.type === 'simple') {
      return evaluateCondition(condition, formData);
    }

    const { operator, conditions } = condition;
    const results = conditions.map(c => 
      c.type === 'compound' 
        ? evaluateCompoundCondition(c, formData)
        : evaluateCondition(c, formData)
    );

    if (operator === 'AND') {
      return results.every(r => r);
    } else if (operator === 'OR') {
      return results.some(r => r);
    }

    return false;
  }, [evaluateCondition]);

  // Evaluate all rules against form data
  const evaluateRules = useCallback((formData, options = {}) => {
    const { triggerActions = true } = options;
    const fired = [];
    const actions = [];
    const explanations = [];

    // Sort rules by priority (lower number = higher priority)
    const sortedRules = [...rules]
      .filter(rule => rule.enabled)
      .sort((a, b) => a.priority - b.priority);

    for (const rule of sortedRules) {
      let conditionMet = false;

      if (rule.condition.type === 'compound') {
        conditionMet = evaluateCompoundCondition(rule.condition, formData);
      } else {
        conditionMet = evaluateCondition(rule.condition, formData);
      }

      if (conditionMet) {
        fired.push(rule);
        
        if (triggerActions) {
          actions.push(...rule.actions.map(action => ({
            ...action,
            ruleId: rule.id,
            ruleName: rule.name
          })));
        }

        explanations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          category: rule.category,
          explanation: rule.explanation,
          condition: rule.condition,
          actions: rule.actions,
          timestamp: new Date().toISOString()
        });
      }
    }

    setFiredRules(fired);
    setPendingActions(actions);
    setRuleExplanations(explanations);

    return { fired, actions, explanations };
  }, [rules, evaluateCondition, evaluateCompoundCondition]);

  // Create a new rule
  const createRule = useCallback((rule) => {
    const newRule = {
      ...rule,
      id: rule.id || `rule-${Date.now()}`,
      enabled: true,
      createdAt: new Date().toISOString()
    };
    setRules(prev => [...prev, newRule]);
    return newRule;
  }, []);

  // Update a rule
  const updateRule = useCallback((ruleId, updates) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, ...updates, updatedAt: new Date().toISOString() }
        : rule
    ));
  }, []);

  // Delete a rule
  const deleteRule = useCallback((ruleId) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  }, []);

  // Toggle rule enabled/disabled
  const toggleRule = useCallback((ruleId) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  }, []);

  // Get rules by category
  const getRulesByCategory = useCallback((category) => {
    if (category === 'all') return rules;
    return rules.filter(rule => rule.category.toLowerCase() === category.toLowerCase());
  }, [rules]);

  // Clear fired rules and actions
  const clearFiredRules = useCallback(() => {
    setFiredRules([]);
    setPendingActions([]);
    setRuleExplanations([]);
  }, []);

  // Get human-readable explanation for a rule
  const getRuleExplanation = useCallback((ruleId) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return null;

    const operator = operators.find(op => op.id === rule.condition.operator);
    
    return {
      rule,
      conditionText: `When ${rule.condition.field} ${operator?.label || rule.condition.operator} ${rule.condition.value}`,
      actionTexts: rule.actions.map(action => {
        const actionType = actionTypes.find(at => at.id === action.type);
        return `${actionType?.label || action.type}: ${JSON.stringify(action.params)}`;
      }),
      explanation: rule.explanation
    };
  }, [rules, operators, actionTypes]);

  const value = useMemo(() => ({
    // Data
    rules,
    operators,
    actionTypes,
    ruleCategories,
    
    // State
    activeRules,
    firedRules,
    pendingActions,
    ruleExplanations,
    
    // Evaluation
    evaluateRules,
    evaluateCondition,
    
    // CRUD
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    
    // Utilities
    getRulesByCategory,
    clearFiredRules,
    getRuleExplanation,
    setActiveRules
  }), [
    rules, operators, actionTypes, ruleCategories,
    activeRules, firedRules, pendingActions, ruleExplanations,
    evaluateRules, evaluateCondition,
    createRule, updateRule, deleteRule, toggleRule,
    getRulesByCategory, clearFiredRules, getRuleExplanation
  ]);

  return (
    <RuleEngineContext.Provider value={value}>
      {children}
    </RuleEngineContext.Provider>
  );
}

export function useRuleEngine() {
  const context = useContext(RuleEngineContext);
  if (!context) {
    throw new Error('useRuleEngine must be used within RuleEngineProvider');
  }
  return context;
}

export default RuleEngineContext;