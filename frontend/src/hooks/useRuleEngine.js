// src/hooks/useRuleEngine.js
import { useMemo, useCallback, useState, useEffect } from 'react';
import RuleEngine from '../core/engines/RuleEngine';

/**
 * Hook to use Rule Engine with React
 */
export const useRuleEngine = (rules = []) => {
  const [evaluationLog, setEvaluationLog] = useState([]);

  // Create rule engine instance
  const ruleEngine = useMemo(() => {
    return new RuleEngine(rules);
  }, [rules]);

  // Evaluate field visibility
  const evaluateVisibility = useCallback((visibilityRules, context) => {
    return ruleEngine.evaluateVisibility(visibilityRules, context);
  }, [ruleEngine]);

  // Evaluate all rules
  const evaluateAllRules = useCallback((context, updateFormData) => {
    const results = ruleEngine.evaluateAllRules(context, updateFormData);
    setEvaluationLog(results);
    return results;
  }, [ruleEngine]);

  // Get active alerts
  const getActiveAlerts = useCallback((context) => {
    return ruleEngine.getActiveAlerts(context);
  }, [ruleEngine]);

  // Compute field states
  const computeFieldStates = useCallback((fields, context) => {
    return ruleEngine.computeFieldStates(fields, context);
  }, [ruleEngine]);

  // Explain field visibility
  const explainFieldVisibility = useCallback((field, context) => {
    return ruleEngine.explainFieldVisibility(field, context);
  }, [ruleEngine]);

  // Register new rule
  const registerRule = useCallback((rule) => {
    ruleEngine.registerRule(rule);
  }, [ruleEngine]);

  // Unregister rule
  const unregisterRule = useCallback((ruleId) => {
    ruleEngine.unregisterRule(ruleId);
  }, [ruleEngine]);

  return {
    ruleEngine,
    evaluateVisibility,
    evaluateAllRules,
    getActiveAlerts,
    computeFieldStates,
    explainFieldVisibility,
    registerRule,
    unregisterRule,
    evaluationLog,
  };
};

export default useRuleEngine;