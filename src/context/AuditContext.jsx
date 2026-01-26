import React, { createContext, useContext, useState, useCallback } from 'react';

const AuditContext = createContext(null);

export function AuditProvider({ children }) {
  const [logs, setLogs] = useState(() => {
    const stored = localStorage.getItem('adapta_audit');
    return stored ? JSON.parse(stored) : [];
  });

  const logAction = useCallback((action, details = {}) => {
    const entry = {
      id: `log-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      user: 'Current User'
    };
    setLogs(prev => {
      const updated = [entry, ...prev].slice(0, 500);
      localStorage.setItem('adapta_audit', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const exportLogs = useCallback(() => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-logs.json';
    a.click();
  }, [logs]);

  return (
    <AuditContext.Provider value={{ auditLogs: logs, logAction, exportLogs }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within AuditProvider');
  }
  return context;
}

export default AuditContext;