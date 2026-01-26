import { useCallback } from 'react'
import { useAudit as useAuditContext } from '../context/AuditContext'

export function useAuditHook() {
  const { logs, logAction, getLogsByAction, getLogsByUser, getLogsByDateRange, clearLogs } = useAuditContext()

  const trackFormEvent = useCallback((eventType, formId, details = {}) => {
    logAction(`form_${eventType}`, { formId, ...details })
  }, [logAction])

  const trackWorkflowEvent = useCallback((eventType, workflowId, details = {}) => {
    logAction(`workflow_${eventType}`, { workflowId, ...details })
  }, [logAction])

  const trackRuleEvent = useCallback((eventType, ruleId, details = {}) => {
    logAction(`rule_${eventType}`, { ruleId, ...details })
  }, [logAction])

  const trackAuthEvent = useCallback((eventType, details = {}) => {
    logAction(`auth_${eventType}`, details)
  }, [logAction])

  const getRecentLogs = useCallback((count = 10) => {
    return logs.slice(0, count)
  }, [logs])

  const searchLogs = useCallback((query) => {
    const lowerQuery = query.toLowerCase()
    return logs.filter(log => 
      log.action.toLowerCase().includes(lowerQuery) ||
      log.userName.toLowerCase().includes(lowerQuery) ||
      JSON.stringify(log.details).toLowerCase().includes(lowerQuery)
    )
  }, [logs])

  return {
    logs,
    logAction,
    trackFormEvent,
    trackWorkflowEvent,
    trackRuleEvent,
    trackAuthEvent,
    getLogsByAction,
    getLogsByUser,
    getLogsByDateRange,
    getRecentLogs,
    searchLogs,
    clearLogs,
  }
}

export default useAuditHook