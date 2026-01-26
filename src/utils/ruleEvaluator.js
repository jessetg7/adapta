export function evaluateCondition(condition, formData, context = {}) {
  const { field, operator, value } = condition
  const fieldValue = formData[field]

  switch (operator) {
    case 'equals':
      return fieldValue === value
    case 'not_equals':
      return fieldValue !== value
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
    case 'not_contains':
      return !String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
    case 'greater_than':
      return Number(fieldValue) > Number(value)
    case 'less_than':
      return Number(fieldValue) < Number(value)
    case 'greater_or_equal':
      return Number(fieldValue) >= Number(value)
    case 'less_or_equal':
      return Number(fieldValue) <= Number(value)
    case 'is_empty':
      return !fieldValue || fieldValue === ''
    case 'is_not_empty':
      return fieldValue && fieldValue !== ''
    case 'starts_with':
      return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase())
    case 'ends_with':
      return String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase())
    case 'role_is':
      return context.userRole === value
    case 'role_is_not':
      return context.userRole !== value
    default:
      return false
  }
}

export function executeAction(action, formData) {
  const { type, target, value } = action

  switch (type) {
    case 'show_field':
      return { action: 'show', fieldId: target }
    case 'hide_field':
      return { action: 'hide', fieldId: target }
    case 'set_required':
      return { action: 'required', fieldId: target, required: true }
    case 'set_optional':
      return { action: 'required', fieldId: target, required: false }
    case 'set_value':
      return { action: 'setValue', fieldId: target, value }
    case 'clear_value':
      return { action: 'setValue', fieldId: target, value: '' }
    case 'trigger_workflow':
      return { action: 'triggerWorkflow', workflowId: target }
    case 'send_notification':
      return { action: 'notify', message: value }
    case 'validate':
      return { action: 'validate', fieldId: target, rule: value }
    default:
      return null
  }
}

export function applyRuleActions(actions, formState) {
  let newState = { ...formState }
  const appliedActions = []

  actions.forEach(action => {
    const result = executeAction(action, newState)
    if (result) {
      appliedActions.push({ ...action, result })

      switch (result.action) {
        case 'show':
          newState.visibility = { ...newState.visibility, [result.fieldId]: true }
          break
        case 'hide':
          newState.visibility = { ...newState.visibility, [result.fieldId]: false }
          break
        case 'required':
          newState.required = { ...newState.required, [result.fieldId]: result.required }
          break
        case 'setValue':
          newState.values = { ...newState.values, [result.fieldId]: result.value }
          break
        default:
          break
      }
    }
  })

  return { newState, appliedActions }
}

export const OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Does not equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does not contain' },
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
  { value: 'greater_or_equal', label: 'Greater or equal' },
  { value: 'less_or_equal', label: 'Less or equal' },
  { value: 'is_empty', label: 'Is empty' },
  { value: 'is_not_empty', label: 'Is not empty' },
  { value: 'starts_with', label: 'Starts with' },
  { value: 'ends_with', label: 'Ends with' },
  { value: 'role_is', label: 'User role is' },
  { value: 'role_is_not', label: 'User role is not' },
]

export const ACTION_TYPES = [
  { value: 'show_field', label: 'Show field' },
  { value: 'hide_field', label: 'Hide field' },
  { value: 'set_required', label: 'Make required' },
  { value: 'set_optional', label: 'Make optional' },
  { value: 'set_value', label: 'Set value' },
  { value: 'clear_value', label: 'Clear value' },
  { value: 'trigger_workflow', label: 'Trigger workflow' },
  { value: 'send_notification', label: 'Send notification' },
]