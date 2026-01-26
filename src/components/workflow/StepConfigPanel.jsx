import React from 'react'
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material'
import { Close, Add, Delete } from '@mui/icons-material'
import { STEP_TYPES, TRANSITION_CONDITIONS } from '../../utils/workflowUtils'
import { v4 as uuidv4 } from 'uuid'

function StepConfigPanel({ step, templates, roles, allSteps, onUpdate, onClose }) {
  const handleChange = (key, value) => {
    onUpdate({ [key]: value })
  }

  const handleAddTransition = () => {
    const newTransition = {
      id: uuidv4(),
      to: '',
      condition: 'always',
    }
    handleChange('transitions', [...(step.transitions || []), newTransition])
  }

  const handleUpdateTransition = (transitionId, updates) => {
    handleChange(
      'transitions',
      (step.transitions || []).map(t => 
        t.id === transitionId ? { ...t, ...updates } : t
      )
    )
  }

  const handleDeleteTransition = (transitionId) => {
    handleChange(
      'transitions',
      (step.transitions || []).filter(t => t.id !== transitionId)
    )
  }

  const otherSteps = allSteps.filter(s => s.id !== step.id)

  return (
    <Paper sx={{ p: 2, position: 'sticky', top: 16 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Step Configuration
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="Step Name"
          value={step.name}
          onChange={(e) => handleChange('name', e.target.value)}
          size="small"
        />

        <FormControl fullWidth size="small">
          <InputLabel>Step Type</InputLabel>
          <Select
            value={step.type}
            label="Step Type"
            onChange={(e) => handleChange('type', e.target.value)}
          >
            {STEP_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Assigned Role</InputLabel>
          <Select
            value={step.assignedRole}
            label="Assigned Role"
            onChange={(e) => handleChange('assignedRole', e.target.value)}
          >
            {roles?.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(step.type === 'form') && (
          <FormControl fullWidth size="small">
            <InputLabel>Form Template</InputLabel>
            <Select
              value={step.formTemplateId || ''}
              label="Form Template"
              onChange={(e) => handleChange('formTemplateId', e.target.value)}
            >
              {templates?.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Divider sx={{ my: 1 }} />

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Transitions
            </Typography>
            <Button
              size="small"
              startIcon={<Add />}
              onClick={handleAddTransition}
            >
              Add
            </Button>
          </Box>

          {(step.transitions || []).length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No transitions defined
            </Typography>
          ) : (
            <List dense disablePadding>
              {(step.transitions || []).map((transition) => (
                <ListItem
                  key={transition.id}
                  sx={{
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    mb: 1,
                    flexDirection: 'column',
                    alignItems: 'stretch',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <FormControl size="small" sx={{ flex: 1 }}>
                      <InputLabel>When</InputLabel>
                      <Select
                        value={transition.condition}
                        label="When"
                        onChange={(e) => handleUpdateTransition(transition.id, { condition: e.target.value })}
                      >
                        {TRANSITION_CONDITIONS.map((cond) => (
                          <MenuItem key={cond.value} value={cond.value}>
                            {cond.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ flex: 1 }}>
                      <InputLabel>Go to</InputLabel>
                      <Select
                        value={transition.to}
                        label="Go to"
                        onChange={(e) => handleUpdateTransition(transition.id, { to: e.target.value })}
                      >
                        <MenuItem value="complete">Complete Workflow</MenuItem>
                        {otherSteps.map((s) => (
                          <MenuItem key={s.id} value={s.id}>
                            {s.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTransition(transition.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Paper>
  )
}

export default StepConfigPanel