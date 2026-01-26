import React from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Button,
} from '@mui/material'
import { Delete, Add } from '@mui/icons-material'
import { ACTION_TYPES } from '../../utils/ruleEvaluator'

function ActionBuilder({ actions = [], onChange, availableFields = [] }) {
  const handleAddAction = () => {
    onChange([
      ...actions,
      {
        id: Date.now().toString(),
        type: 'show_field',
        target: '',
        value: '',
      },
    ])
  }

  const handleUpdateAction = (index, updates) => {
    const newActions = [...actions]
    newActions[index] = { ...newActions[index], ...updates }
    onChange(newActions)
  }

  const handleDeleteAction = (index) => {
    onChange(actions.filter((_, i) => i !== index))
  }

  const needsValue = (type) => {
    return ['set_value', 'send_notification'].includes(type)
  }

  const needsTarget = (type) => {
    return !['send_notification'].includes(type)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          THEN (Actions)
        </Typography>
        <Button
          size="small"
          startIcon={<Add />}
          onClick={handleAddAction}
        >
          Add Action
        </Button>
      </Box>

      {actions.length === 0 ? (
        <Paper
          sx={{
            p: 3,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'grey.300',
            bgcolor: 'grey.50',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No actions defined. Add an action to specify what happens.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {actions.map((action, index) => (
            <Paper
              key={action.id}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'success.50',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Action Type</InputLabel>
                  <Select
                    value={action.type}
                    label="Action Type"
                    onChange={(e) => handleUpdateAction(index, { type: e.target.value })}
                  >
                    {ACTION_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {needsTarget(action.type) && (
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Target Field</InputLabel>
                    <Select
                      value={action.target}
                      label="Target Field"
                      onChange={(e) => handleUpdateAction(index, { target: e.target.value })}
                    >
                      {availableFields.map((field) => (
                        <MenuItem key={field.id} value={field.id}>
                          {field.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {needsValue(action.type) && (
                  <TextField
                    size="small"
                    label="Value"
                    value={action.value}
                    onChange={(e) => handleUpdateAction(index, { value: e.target.value })}
                    sx={{ flexGrow: 1 }}
                  />
                )}

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteAction(index)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default ActionBuilder