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
  Chip,
} from '@mui/material'
import { Delete, Add } from '@mui/icons-material'
import { OPERATORS } from '../../utils/ruleEvaluator'

function ConditionBuilder({ conditions = [], onChange, availableFields = [] }) {
  const handleAddCondition = () => {
    onChange([
      ...conditions,
      {
        id: Date.now().toString(),
        field: '',
        operator: 'equals',
        value: '',
      },
    ])
  }

  const handleUpdateCondition = (index, updates) => {
    const newConditions = [...conditions]
    newConditions[index] = { ...newConditions[index], ...updates }
    onChange(newConditions)
  }

  const handleDeleteCondition = (index) => {
    onChange(conditions.filter((_, i) => i !== index))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          IF (Conditions)
        </Typography>
        <Button
          size="small"
          startIcon={<Add />}
          onClick={handleAddCondition}
        >
          Add Condition
        </Button>
      </Box>

      {conditions.length === 0 ? (
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
            No conditions defined. Add a condition to get started.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {conditions.map((condition, index) => (
            <Paper
              key={condition.id}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {index > 0 && (
                <Chip
                  label="AND"
                  size="small"
                  color="primary"
                  sx={{ mb: 2 }}
                />
              )}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Field</InputLabel>
                  <Select
                    value={condition.field}
                    label="Field"
                    onChange={(e) => handleUpdateCondition(index, { field: e.target.value })}
                  >
                    {availableFields.map((field) => (
                      <MenuItem key={field.id} value={field.id}>
                        {field.label}
                      </MenuItem>
                    ))}
                    <MenuItem value="__role__">User Role</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    value={condition.operator}
                    label="Operator"
                    onChange={(e) => handleUpdateCondition(index, { operator: e.target.value })}
                  >
                    {OPERATORS.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {!['is_empty', 'is_not_empty'].includes(condition.operator) && (
                  <TextField
                    size="small"
                    label="Value"
                    value={condition.value}
                    onChange={(e) => handleUpdateCondition(index, { value: e.target.value })}
                    sx={{ flexGrow: 1 }}
                  />
                )}

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteCondition(index)}
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

export default ConditionBuilder