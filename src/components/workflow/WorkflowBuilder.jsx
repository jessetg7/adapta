import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Grid,
  Chip,
  Tooltip,
  Alert,
} from '@mui/material'
import {
  Add,
  Delete,
  Edit,
  ArrowForward,
  Save,
  PlayArrow,
} from '@mui/icons-material'
import { v4 as uuidv4 } from 'uuid'
import WorkflowStep from './WorkflowStep'
import StepConfigPanel from './StepConfigPanel'
import WorkflowPreview from './WorkflowPreview'
import { STEP_TYPES } from '../../utils/workflowUtils'

function WorkflowBuilder({ workflow, templates, roles, onSave, onChange }) {
  const [workflowData, setWorkflowData] = useState({
    name: workflow?.name || '',
    description: workflow?.description || '',
    steps: workflow?.steps || [],
  })
  const [selectedStep, setSelectedStep] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleWorkflowChange = (key, value) => {
    setWorkflowData(prev => {
      const updated = { ...prev, [key]: value }
      onChange?.(updated)
      return updated
    })
  }

  const handleAddStep = () => {
    const newStep = {
      id: uuidv4(),
      name: `Step ${workflowData.steps.length + 1}`,
      type: 'form',
      order: workflowData.steps.length + 1,
      assignedRole: '',
      formTemplateId: '',
      transitions: [{ to: '', condition: 'always' }],
    }
    handleWorkflowChange('steps', [...workflowData.steps, newStep])
  }

  const handleUpdateStep = (stepId, updates) => {
    handleWorkflowChange(
      'steps',
      workflowData.steps.map(s => s.id === stepId ? { ...s, ...updates } : s)
    )
    if (selectedStep?.id === stepId) {
      setSelectedStep({ ...selectedStep, ...updates })
    }
  }

  const handleDeleteStep = (stepId) => {
    handleWorkflowChange(
      'steps',
      workflowData.steps.filter(s => s.id !== stepId)
    )
    if (selectedStep?.id === stepId) {
      setSelectedStep(null)
    }
  }

  const handleMoveStep = (stepId, direction) => {
    const currentIndex = workflowData.steps.findIndex(s => s.id === stepId)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === workflowData.steps.length - 1)
    ) {
      return
    }

    const newSteps = [...workflowData.steps]
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    ;[newSteps[currentIndex], newSteps[newIndex]] = [newSteps[newIndex], newSteps[currentIndex]]
    
    newSteps.forEach((step, index) => {
      step.order = index + 1
    })
    
    handleWorkflowChange('steps', newSteps)
  }

  const handleSave = () => {
    if (!workflowData.name.trim()) {
      alert('Please enter a workflow name')
      return
    }
    if (workflowData.steps.length === 0) {
      alert('Please add at least one step')
      return
    }
    onSave?.(workflowData)
  }

  return (
    <Grid container spacing={3}>
      {/* Workflow Details */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Workflow Name"
                value={workflowData.name}
                onChange={(e) => handleWorkflowChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                value={workflowData.description}
                onChange={(e) => handleWorkflowChange('description', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Steps Builder */}
      <Grid item xs={12} md={selectedStep ? 8 : 12}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Workflow Steps
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<PlayArrow />}
                onClick={() => setShowPreview(true)}
                disabled={workflowData.steps.length === 0}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddStep}
              >
                Add Step
              </Button>
            </Box>
          </Box>

          {workflowData.steps.length === 0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary" gutterBottom>
                No steps in this workflow
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddStep}
              >
                Add First Step
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {workflowData.steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <WorkflowStep
                    step={step}
                    isFirst={index === 0}
                    isLast={index === workflowData.steps.length - 1}
                    isSelected={selectedStep?.id === step.id}
                    templates={templates}
                    roles={roles}
                    onSelect={() => setSelectedStep(step)}
                    onUpdate={(updates) => handleUpdateStep(step.id, updates)}
                    onDelete={() => handleDeleteStep(step.id)}
                    onMoveUp={() => handleMoveStep(step.id, 'up')}
                    onMoveDown={() => handleMoveStep(step.id, 'down')}
                  />
                  {index < workflowData.steps.length - 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <ArrowForward color="action" />
                    </Box>
                  )}
                </React.Fragment>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
            >
              Save Workflow
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Step Configuration Panel */}
      {selectedStep && (
        <Grid item xs={12} md={4}>
          <StepConfigPanel
            step={selectedStep}
            templates={templates}
            roles={roles}
            allSteps={workflowData.steps}
            onUpdate={(updates) => handleUpdateStep(selectedStep.id, updates)}
            onClose={() => setSelectedStep(null)}
          />
        </Grid>
      )}

      {/* Preview Modal */}
      <WorkflowPreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
        workflow={workflowData}
        roles={roles}
      />
    </Grid>
  )
}

export default WorkflowBuilder