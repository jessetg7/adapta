import React from 'react'
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material'
import {
  Delete,
  Settings,
  ArrowUpward,
  ArrowDownward,
  Assignment,
  RateReview,
  CheckCircle,
  Warning,
  Notifications,
} from '@mui/icons-material'
import { getStepColor } from '../../utils/workflowUtils'

const stepIcons = {
  form: Assignment,
  review: RateReview,
  approval: CheckCircle,
  escalation: Warning,
  notification: Notifications,
}

function WorkflowStep({
  step,
  isFirst,
  isLast,
  isSelected,
  templates,
  roles,
  onSelect,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) {
  const StepIcon = stepIcons[step.type] || Assignment
  const stepColor = getStepColor(step.type)
  const template = templates?.find(t => t.id === step.formTemplateId)
  const role = roles?.find(r => r.id === step.assignedRole)

  return (
    <Paper
      elevation={isSelected ? 4 : 1}
      onClick={onSelect}
      sx={{
        p: 2,
        cursor: 'pointer',
        border: '2px solid',
        borderColor: isSelected ? 'primary.main' : 'transparent',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.light',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Step Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: `${stepColor}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <StepIcon sx={{ color: stepColor, fontSize: 28 }} />
        </Box>

        {/* Step Info */}
        <Box sx={{ flexGrow: 1 }}>
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
                fontWeight: 500,
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
            {role && (
              <Chip
                label={`Assigned: ${role.name}`}
                size="small"
                variant="outlined"
                sx={{ height: 22 }}
              />
            )}
            {template && (
              <Chip
                label={`Form: ${template.name}`}
                size="small"
                variant="outlined"
                sx={{ height: 22 }}
              />
            )}
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Move Up">
            <span>
              <IconButton size="small" disabled={isFirst} onClick={onMoveUp}>
                <ArrowUpward fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Move Down">
            <span>
              <IconButton size="small" disabled={isLast} onClick={onMoveDown}>
                <ArrowDownward fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Configure">
            <IconButton size="small" onClick={onSelect}>
              <Settings fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={onDelete}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  )
}

export default WorkflowStep