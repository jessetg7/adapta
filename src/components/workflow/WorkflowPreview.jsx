import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Paper,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { getStepColor, getStepIcon } from '../../utils/workflowUtils'

function WorkflowPreview({ open, onClose, workflow, roles }) {
  const getRole = (roleId) => roles?.find(r => r.id === roleId)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '60vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Workflow Preview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {workflow.name}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {workflow.steps?.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No steps to preview
            </Typography>
          </Box>
        ) : (
          <Stepper orientation="vertical">
            {workflow.steps?.map((step, index) => {
              const stepColor = getStepColor(step.type)
              const role = getRole(step.assignedRole)

              return (
                <Step key={step.id} active>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: `${stepColor}20`,
                          color: stepColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                        }}
                      >
                        {index + 1}
                      </Box>
                    )}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {step.name}
                      </Typography>
                      <Chip
                        label={step.type}
                        size="small"
                        sx={{
                          bgcolor: `${stepColor}20`,
                          color: stepColor,
                        }}
                      />
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {role && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Assigned to:
                            </Typography>
                            <Chip
                              label={role.name}
                              size="small"
                              sx={{ bgcolor: `${role.color}20`, color: role.color }}
                            />
                          </Box>
                        )}
                        {step.transitions?.length > 0 && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Transitions:
                            </Typography>
                            {step.transitions.map((t, i) => (
                              <Typography key={i} variant="caption" display="block">
                                • When {t.condition} → {t.to === 'complete' ? 'Complete' : 
                                  workflow.steps.find(s => s.id === t.to)?.name || t.to}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Paper>
                  </StepContent>
                </Step>
              )
            })}
          </Stepper>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default WorkflowPreview