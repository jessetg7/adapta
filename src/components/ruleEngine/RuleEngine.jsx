import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Switch,
  Tooltip,
  Divider,
  Alert,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  PlayArrow,
  ContentCopy,
  Rule as RuleIcon,
} from '@mui/icons-material'
import EmptyState from '../common/EmptyState'
import Modal from '../common/Modal'
import ConditionBuilder from './ConditionBuilder'
import ActionBuilder from './ActionBuilder'
import RuleSimulator from './RuleSimulator'
import useRuleEngine from '../../hooks/useRuleEngine'

function RuleEngine({ rules: initialRules, fields = [], onRulesChange }) {
  const { rules, createRule, updateRule, deleteRule, toggleRule } = useRuleEngine(initialRules)
  const [editingRule, setEditingRule] = useState(null)
  const [showSimulator, setShowSimulator] = useState(false)
  const [selectedRuleForSim, setSelectedRuleForSim] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  React.useEffect(() => {
    onRulesChange?.(rules)
  }, [rules, onRulesChange])

  const handleCreateRule = () => {
    setEditingRule({
      id: null,
      name: '',
      description: '',
      conditions: [],
      actions: [],
      enabled: true,
    })
    setIsCreating(true)
  }

  const handleSaveRule = (ruleData) => {
    if (isCreating) {
      createRule(ruleData)
    } else {
      updateRule(editingRule.id, ruleData)
    }
    setEditingRule(null)
    setIsCreating(false)
  }

  const handleDeleteRule = (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      deleteRule(ruleId)
    }
  }

  const handleSimulate = (rule) => {
    setSelectedRuleForSim(rule)
    setShowSimulator(true)
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Business Rules
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create IF-THEN rules to automate form behavior
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateRule}
        >
          Create Rule
        </Button>
      </Box>

      {/* Rules List */}
      {rules.length === 0 ? (
        <EmptyState
          icon={RuleIcon}
          title="No rules created"
          description="Create your first business rule to automate form behavior and workflow logic."
          actionLabel="Create Rule"
          onAction={handleCreateRule}
        />
      ) : (
        <Paper>
          <List disablePadding>
            {rules.map((rule, index) => (
              <React.Fragment key={rule.id}>
                {index > 0 && <Divider />}
                <ListItem sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Switch
                      checked={rule.enabled}
                      onChange={() => toggleRule(rule.id)}
                      size="small"
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {rule.name}
                        </Typography>
                        <Chip
                          label={rule.enabled ? 'Active' : 'Disabled'}
                          size="small"
                          color={rule.enabled ? 'success' : 'default'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {rule.conditions?.length || 0} condition(s) → {rule.actions?.length || 0} action(s)
                      </Typography>
                      {rule.description && (
                        <Typography variant="caption" color="text.secondary">
                          {rule.description}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Simulate">
                        <IconButton size="small" onClick={() => handleSimulate(rule)}>
                          <PlayArrow />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            setEditingRule(rule)
                            setIsCreating(false)
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteRule(rule.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Rule Editor Modal */}
      <Modal
        open={Boolean(editingRule)}
        onClose={() => {
          setEditingRule(null)
          setIsCreating(false)
        }}
        title={isCreating ? 'Create New Rule' : 'Edit Rule'}
        subtitle="Define conditions and actions for this rule"
        maxWidth="md"
      >
        {editingRule && (
          <RuleEditor
            rule={editingRule}
            fields={fields}
            onSave={handleSaveRule}
            onCancel={() => {
              setEditingRule(null)
              setIsCreating(false)
            }}
          />
        )}
      </Modal>

      {/* Rule Simulator Modal */}
      <Modal
        open={showSimulator}
        onClose={() => setShowSimulator(false)}
        title="Rule Simulator"
        subtitle="Test your rule with sample data"
        maxWidth="md"
      >
        {selectedRuleForSim && (
          <RuleSimulator
            rule={selectedRuleForSim}
            fields={fields}
          />
        )}
      </Modal>
    </Box>
  )
}

function RuleEditor({ rule, fields, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: rule.name || '',
    description: rule.description || '',
    conditions: rule.conditions || [],
    actions: rule.actions || [],
  })

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter a rule name')
      return
    }
    if (formData.conditions.length === 0) {
      alert('Please add at least one condition')
      return
    }
    if (formData.actions.length === 0) {
      alert('Please add at least one action')
      return
    }
    onSave(formData)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="Rule Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          multiline
          rows={2}
        />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          IF (Conditions)
        </Typography>
        <ConditionBuilder
          conditions={formData.conditions}
          fields={fields}
          onChange={(conditions) => handleChange('conditions', conditions)}
        />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          THEN (Actions)
        </Typography>
        <ActionBuilder
          actions={formData.actions}
          fields={fields}
          onChange={(actions) => handleChange('actions', actions)}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save Rule
        </Button>
      </Box>
    </Box>
  )
}

// Need to import TextField
import { TextField } from '@mui/material'

export default RuleEngine