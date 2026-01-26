import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { evaluateCondition, executeAction } from '../utils/ruleEvaluator'

export function useRuleEngine(initialRules = []) {
  const [rules, setRules] = useState(initialRules)

  const createRule = useCallback((ruleData) => {
    const newRule = {
      id: uuidv4(),
      ...ruleData,
      enabled: true,
      createdAt: new Date().toISOString(),
    }
    setRules(prev => [...prev, newRule])
    return newRule
  }, [])

  const updateRule = useCallback((ruleId, updates) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ))
  }, [])

  const deleteRule = useCallback((ruleId) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId))
  }, [])

  const toggleRule = useCallback((ruleId) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }, [])

  const evaluateRules = useCallback((formData, context = {}) => {
    const results = []
    const actions = []

    rules.filter(rule => rule.enabled).forEach(rule => {
      const conditionMet = rule.conditions.every(condition => 
        evaluateCondition(condition, formData, context)
      )

      results.push({
        ruleId: rule.id,
        ruleName: rule.name,
        conditionMet,
        conditions: rule.conditions,
      })

      if (conditionMet) {
        rule.actions.forEach(action => {
          actions.push({
            ...action,
            ruleId: rule.id,
            ruleName: rule.name,
          })
        })
      }
    })

    return { results, actions }
  }, [rules])

  const simulateRule = useCallback((rule, testData) => {
    const conditionMet = rule.conditions.every(condition => 
      evaluateCondition(condition, testData, {})
    )

    const executedActions = conditionMet ? rule.actions.map(action => ({
      ...action,
      executed: true,
      result: executeAction(action, testData),
    })) : []

    return {
      conditionMet,
      executedActions,
      explanation: conditionMet 
        ? `All conditions met. ${executedActions.length} action(s) would execute.`
        : 'Conditions not met. No actions would execute.',
    }
  }, [])

  return {
    rules,
    setRules,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    evaluateRules,
    simulateRule,
  }
}

export default useRuleEngine