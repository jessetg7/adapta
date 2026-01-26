export function validateStep(step, formData, rules = []) {
  const errors = []
  
  if (step.formTemplateId && step.requiredFields) {
    step.requiredFields.forEach(fieldId => {
      if (!formData[fieldId] || formData[fieldId] === '') {
        errors.push({ fieldId, message: 'This field is required' })
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function getNextStep(step, action) {
  if (!step.transitions) return null
  
  const transition = step.transitions.find(t => {
    if (t.condition === 'always') return true
    if (t.condition === action) return true
    return false
  })

  return transition?.to || null
}

export function canTransition(currentStep, targetStepId, workflow) {
  if (!currentStep.transitions) return false
  return currentStep.transitions.some(t => t.to === targetStepId)
}

export function getStepProgress(workflow, currentStepId) {
  if (!workflow?.steps) return 0
  const currentIndex = workflow.steps.findIndex(s => s.id === currentStepId)
  if (currentIndex === -1) return 0
  return ((currentIndex + 1) / workflow.steps.length) * 100
}

export function getStepIcon(stepType) {
  switch (stepType) {
    case 'form':
      return 'Assignment'
    case 'review':
      return 'RateReview'
    case 'approval':
      return 'CheckCircle'
    case 'escalation':
      return 'Warning'
    case 'notification':
      return 'Notifications'
    default:
      return 'Circle'
  }
}

export function getStepColor(stepType) {
  switch (stepType) {
    case 'form':
      return '#2563eb'
    case 'review':
      return '#7c3aed'
    case 'approval':
      return '#10b981'
    case 'escalation':
      return '#f59e0b'
    case 'notification':
      return '#06b6d4'
    default:
      return '#64748b'
  }
}

export const STEP_TYPES = [
  { value: 'form', label: 'Form Submission', icon: 'Assignment' },
  { value: 'review', label: 'Review', icon: 'RateReview' },
  { value: 'approval', label: 'Approval', icon: 'CheckCircle' },
  { value: 'escalation', label: 'Escalation', icon: 'Warning' },
  { value: 'notification', label: 'Notification', icon: 'Notifications' },
]

export const TRANSITION_CONDITIONS = [
  { value: 'always', label: 'Always' },
  { value: 'approved', label: 'When Approved' },
  { value: 'rejected', label: 'When Rejected' },
  { value: 'needs_revision', label: 'Needs Revision' },
  { value: 'escalated', label: 'When Escalated' },
]