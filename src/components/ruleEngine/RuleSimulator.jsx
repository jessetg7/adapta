import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material'
import {
  PlayArrow,
  CheckCircle,
  Cancel,
  ArrowForward,
} from '@mui/icons-material'
import { evaluateCondition, executeAction } from '../../utils/ruleEvaluator'

function RuleSimulator({ rule, fields }) {
  const [testData, setTestData] = useState({})
  const [result, setResult] = useState(null)

  const handleFieldChange = (fieldId, value) => {
    setTestData(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleSimulate = () => {
    const conditionResults = rule.conditions.map(condition => ({
      ...condition,
      met: evaluateCondition(condition, testData, {}),
    }))

    const allConditionsMet = conditionResults.every(c => c.met)

    const actionResults = allConditionsMet
      ? rule.actions.map(action => ({
          ...action,
          result: executeAction(action, testData),
        }))
      : []

    setResult({
      conditionResults,
      allConditionsMet,
      actionResults,
    })
  }

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Enter test values below to simulate how this rule would behave
      </Alert>

      {/* Test Data Input */}
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Test Data
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {fields.map((field) => (
            <TextField
              key={field.id}
              size="small"
              label={field.label}
              value={testData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={`Enter ${field.type} value`}
            />
          ))}
          {fields.length === 0 && (
            <Typography color="text.secondary">
              No fields available for testing
            </Typography>
          )}
        </Box>
      </Paper>

      <Button
        variant="contained"
        startIcon={<PlayArrow />}
        onClick={handleSimulate}
        fullWidth
        sx={{ mb: 3 }}
      >
        Run Simulation
      </Button>

      {/* Results */}
      {result && (
        <Box>
          <Divider sx={{ mb: 3 }} />

          {/* Condition Results */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Condition Results
          </Typography>
          <Paper variant="outlined" sx={{ mb: 3 }}>
            <List dense>
              {result.conditionResults.map((condition, index) => (
                <ListItem key={condition.id}>
                  <ListItemIcon>
                    {condition.met ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Cancel color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${condition.field} ${condition.operator} "${condition.value}"`}
                    secondary={condition.met ? 'Condition met' : 'Condition not met'}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Overall Result */}
          <Alert 
            severity={result.allConditionsMet ? 'success' : 'warning'}
            sx={{ mb: 3 }}
          >
            {result.allConditionsMet
              ? 'All conditions met - Actions would execute'
              : 'Not all conditions met - No actions would execute'
            }
          </Alert>

          {/* Action Results */}
          {result.allConditionsMet && result.actionResults.length > 0 && (
            <>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Actions That Would Execute
              </Typography>
              <Paper variant="outlined">
                <List dense>
                  {result.actionResults.map((action, index) => (
                    <ListItem key={action.id}>
                      <ListItemIcon>
                        <ArrowForward color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={action.type.replace(/_/g, ' ')}
                        secondary={`Target: ${action.target || 'N/A'}`}
                      />
                      <Chip label="Would execute" size="small" color="success" />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </>
          )}
        </Box>
      )}
    </Box>
  )
}

export default RuleSimulator