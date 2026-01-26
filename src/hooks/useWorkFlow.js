import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { validateStep, getNextStep, canTransition } from '../utils/workflowUtils'

export function useWorkflowExecution(workflow) {
  const [currentStep, setCurrentStep] = useState(workflow?.steps?.[0] || null)
  const [history, setHistory] = useState([])
  const [formData, setFormData] = useState({})

  const moveToStep = useCallback((stepId, action = 'moved') => {
    const step = workflow?.steps?.find(s => s.id === stepId)
    if (step) {
      setHistory(prev => [...prev, {
        fromStep: currentStep?.id,
        toStep: stepId,
        action,
        timestamp: new Date().toISOString(),
      }])
      setCurrentStep(step)
    }
  }, [workflow, currentStep])

  const completeStep = useCallback((action = 'completed', data = {}) => {
    if (!currentStep) return null

    const nextStepId = getNextStep(currentStep, action)
    if (nextStepId === 'complete') {
      setHistory(prev => [...prev, {
        fromStep: currentStep.id,
        toStep: 'complete',
        action,
        timestamp: new Date().toISOString(),
      }])
      return { completed: true }
    }

    if (nextStepId) {
      moveToStep(nextStepId, action)
      return { completed: false, nextStep: nextStepId }
    }

    return null
  }, [currentStep, moveToStep])

  const updateFormData = useCallback((stepId, data) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], ...data },
    }))
  }, [])

  const getStepStatus = useCallback((stepId) => {
    if (currentStep?.id === stepId) return 'current'
    const stepIndex = workflow?.steps?.findIndex(s => s.id === stepId)
    const currentIndex = workflow?.steps?.findIndex(s => s.id === currentStep?.id)
    if (stepIndex < currentIndex) return 'completed'
    return 'pending'
  }, [workflow, currentStep])

  return {
    currentStep,
    history,
    formData,
    moveToStep,
    completeStep,
    updateFormData,
    getStepStatus,
  }
}

export default useWorkflowExecution