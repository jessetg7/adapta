// src/components/WorkflowBuilder/WorkflowBuilder.jsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Tooltip,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { v4 as uuidv4 } from 'uuid';

import useWorkflowStore from '../../core/store/useWorkflowStore';
import useTemplateStore from '../../core/store/useTemplateStore';

// Step types
const STEP_TYPES = [
  { value: 'form', label: 'Form Step', description: 'Display and collect form data' },
  { value: 'approval', label: 'Approval', description: 'Require approval to proceed' },
  { value: 'decision', label: 'Decision', description: 'Branch based on conditions' },
  { value: 'notification', label: 'Notification', description: 'Send notification' },
  { value: 'timer', label: 'Timer', description: 'Wait for specified time' },
];

/**
 * WorkflowBuilder - Visual workflow creation interface
 */
const WorkflowBuilder = ({ workflowId, onSave, onClose }) => {
  const { workflows, addWorkflow, updateWorkflow, addStep, updateStep, deleteStep, addTransition, deleteTransition } = useWorkflowStore();
  const { templates } = useTemplateStore();

  // Initialize workflow
  const [workflow, setWorkflow] = useState(() => {
    if (workflowId && workflows[workflowId]) {
      return JSON.parse(JSON.stringify(workflows[workflowId]));
    }
    return {
      id: uuidv4(),
      name: 'Standard HMS Journey',
      description: 'A visual patient journey from Registration to Consultation, Lab, and Billing.',
      department: 'General',
      category: 'hms',
      steps: [
        { id: 'step-reg', name: 'Patient Registration', type: 'form', assignedRole: 'receptionist', position: { x: 100, y: 100 } },
        { id: 'step-cons', name: 'Doctor Consultation', type: 'form', assignedRole: 'doctor', position: { x: 400, y: 100 } },
        { id: 'step-lab', name: 'Laboratory Tests', type: 'form', assignedRole: 'lab_tech', position: { x: 700, y: 100 } },
        { id: 'step-bill', name: 'Final Billing', type: 'form', assignedRole: 'billing', position: { x: 1000, y: 100 } },
      ],
      transitions: [
        { id: 't1', fromStepId: 'step-reg', toStepId: 'step-cons', label: 'Registered' },
        { id: 't2', fromStepId: 'step-cons', toStepId: 'step-lab', label: 'Tests Ordered' },
        { id: 't3', fromStepId: 'step-lab', toStepId: 'step-bill', label: 'Results Ready' },
      ],
      startStepId: 'step-reg',
      endStepIds: ['step-bill'],
      version: 1,
      isActive: true,
      metadata: {
        author: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  });

  const [selectedStepId, setSelectedStepId] = useState(null);
  const [showStepDialog, setShowStepDialog] = useState(false);
  const [showTransitionDialog, setShowTransitionDialog] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [editingTransition, setEditingTransition] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Get selected step
  const selectedStep = useMemo(() => {
    return workflow.steps.find(s => s.id === selectedStepId);
  }, [workflow.steps, selectedStepId]);

  // Update workflow
  const updateWorkflowData = useCallback((updates) => {
    setWorkflow(prev => ({
      ...prev,
      ...updates,
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  // Add new step
  const handleAddStep = useCallback(() => {
    setEditingStep({
      id: uuidv4(),
      name: `Step ${workflow.steps.length + 1}`,
      type: 'form',
      templateId: '',
      assignedRole: '',
      position: {
        x: 100 + (workflow.steps.length % 3) * 250,
        y: 100 + Math.floor(workflow.steps.length / 3) * 150,
      },
    });
    setShowStepDialog(true);
  }, [workflow.steps.length]);

  // Save step
  const handleSaveStep = useCallback(() => {
    if (!editingStep.name?.trim()) {
      setSnackbar({ open: true, message: 'Step name is required', severity: 'error' });
      return;
    }

    const existingIndex = workflow.steps.findIndex(s => s.id === editingStep.id);

    if (existingIndex >= 0) {
      // Update existing step
      setWorkflow(prev => ({
        ...prev,
        steps: prev.steps.map(s => s.id === editingStep.id ? editingStep : s),
      }));
    } else {
      // Add new step
      setWorkflow(prev => {
        const newSteps = [...prev.steps, editingStep];
        return {
          ...prev,
          steps: newSteps,
          startStepId: prev.startStepId || editingStep.id,
        };
      });
    }

    setShowStepDialog(false);
    setEditingStep(null);
  }, [editingStep, workflow.steps]);

  // Delete step
  const handleDeleteStep = useCallback((stepId) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter(s => s.id !== stepId),
      transitions: prev.transitions.filter(t => t.fromStepId !== stepId && t.toStepId !== stepId),
      startStepId: prev.startStepId === stepId ? (prev.steps[0]?.id || '') : prev.startStepId,
      endStepIds: prev.endStepIds.filter(id => id !== stepId),
    }));
    setSelectedStepId(null);
  }, []);

  // Add transition
  const handleAddTransition = useCallback(() => {
    setEditingTransition({
      id: uuidv4(),
      fromStepId: selectedStepId || '',
      toStepId: '',
      label: '',
      priority: 0,
    });
    setShowTransitionDialog(true);
  }, [selectedStepId]);

  // Save transition
  const handleSaveTransition = useCallback(() => {
    if (!editingTransition.fromStepId || !editingTransition.toStepId) {
      setSnackbar({ open: true, message: 'Both from and to steps are required', severity: 'error' });
      return;
    }

    if (editingTransition.fromStepId === editingTransition.toStepId) {
      setSnackbar({ open: true, message: 'Cannot transition to the same step', severity: 'error' });
      return;
    }

    const existingIndex = workflow.transitions.findIndex(t => t.id === editingTransition.id);

    if (existingIndex >= 0) {
      setWorkflow(prev => ({
        ...prev,
        transitions: prev.transitions.map(t => t.id === editingTransition.id ? editingTransition : t),
      }));
    } else {
      setWorkflow(prev => ({
        ...prev,
        transitions: [...prev.transitions, editingTransition],
      }));
    }

    setShowTransitionDialog(false);
    setEditingTransition(null);
  }, [editingTransition, workflow.transitions]);

  // Delete transition
  const handleDeleteTransition = useCallback((transitionId) => {
    setWorkflow(prev => ({
      ...prev,
      transitions: prev.transitions.filter(t => t.id !== transitionId),
    }));
  }, []);

  // Save workflow
  const handleSave = useCallback(() => {
    if (!workflow.name?.trim()) {
      setSnackbar({ open: true, message: 'Workflow name is required', severity: 'error' });
      return;
    }

    if (workflow.steps.length === 0) {
      setSnackbar({ open: true, message: 'At least one step is required', severity: 'error' });
      return;
    }

    if (workflowId && workflows[workflowId]) {
      updateWorkflow(workflowId, workflow);
    } else {
      addWorkflow(workflow);
    }

    setSnackbar({ open: true, message: 'Workflow saved successfully!', severity: 'success' });
    onSave?.(workflow);
  }, [workflow, workflowId, workflows, addWorkflow, updateWorkflow, onSave]);

  // Get step name by ID
  const getStepName = (stepId) => {
    return workflow.steps.find(s => s.id === stepId)?.name || 'Unknown';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.100' }}>
      {/* Top Toolbar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <AccountTreeIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Workflow Builder
          </Typography>

          <TextField
            size="small"
            value={workflow.name}
            onChange={(e) => updateWorkflowData({ name: e.target.value })}
            placeholder="Workflow Name"
            sx={{ mr: 2, width: 250 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={workflow.isActive}
                onChange={(e) => updateWorkflowData({ isActive: e.target.checked })}
              />
            }
            label="Active"
          />

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ ml: 2 }}
          >
            Save
          </Button>

          {onClose && (
            <IconButton onClick={onClose} sx={{ ml: 1 }}>
              <CloseIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Left Panel - Steps List */}
        <Paper sx={{ width: 300, flexShrink: 0, borderRadius: 0, overflow: 'auto', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Steps
            </Typography>
            <Button startIcon={<AddIcon />} onClick={handleAddStep} size="small" variant="outlined">
              Add
            </Button>
          </Box>

          {workflow.steps.length === 0 ? (
            <Alert severity="info">
              No steps defined. Click "Add" to create your first step.
            </Alert>
          ) : (
            workflow.steps.map((step, index) => (
              <Card
                key={step.id}
                variant="outlined"
                sx={{
                  mb: 1,
                  cursor: 'pointer',
                  border: selectedStepId === step.id ? '2px solid' : '1px solid',
                  borderColor: selectedStepId === step.id ? 'primary.main' : 'divider',
                  bgcolor: selectedStepId === step.id ? 'primary.50' : 'background.paper',
                }}
                onClick={() => setSelectedStepId(step.id)}
              >
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label={index + 1}
                      size="small"
                      color={step.id === workflow.startStepId ? 'success' : 'default'}
                      sx={{ mr: 1 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {step.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {STEP_TYPES.find(t => t.value === step.type)?.label || step.type}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingStep(step);
                        setShowStepDialog(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStep(step.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}

          <Divider sx={{ my: 2 }} />

          {/* Transitions */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Transitions
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddTransition}
              size="small"
              variant="outlined"
              disabled={workflow.steps.length < 2}
            >
              Add
            </Button>
          </Box>

          {workflow.transitions.length === 0 ? (
            <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
              No transitions defined. Add transitions to connect steps.
            </Alert>
          ) : (
            workflow.transitions.map((transition) => (
              <Paper
                key={transition.id}
                variant="outlined"
                sx={{ p: 1.5, mb: 1, display: 'flex', alignItems: 'center' }}
              >
                <Typography variant="caption" sx={{ flexGrow: 1 }}>
                  {getStepName(transition.fromStepId)}
                  <ArrowForwardIcon sx={{ mx: 0.5, fontSize: 14, verticalAlign: 'middle' }} />
                  {getStepName(transition.toStepId)}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteTransition(transition.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            ))
          )}
        </Paper>

        {/* Center - Visual Canvas */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, position: 'relative', bgcolor: 'white' }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="primary" fontWeight={700}>Visual Patient Journey</Typography>
            <Chip label="LCNC Workflow Engine Active" color="success" size="small" variant="outlined" />
          </Box>

          <Box
            sx={{
              minHeight: 600,
              p: 4,
              position: 'relative',
              background: 'radial-gradient(#e0e0e0 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              borderRadius: 4,
              border: '1px solid #eee',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4
            }}
          >
            {workflow.steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Visual Connection Arrow */}
                {index > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ArrowForwardIcon sx={{ transform: 'rotate(90deg)', color: 'primary.light', fontSize: 30 }} />
                    <Typography variant="caption" sx={{ mt: -0.5, bgcolor: 'white', px: 1, color: 'text.secondary' }}>
                      {workflow.transitions.find(t => t.toStepId === step.id)?.label || 'Proceed'}
                    </Typography>
                  </Box>
                )}

                <Paper
                  elevation={selectedStepId === step.id ? 8 : 2}
                  sx={{
                    p: 2.5,
                    minWidth: 220,
                    textAlign: 'center',
                    border: '2px solid',
                    borderColor: step.id === workflow.startStepId ? 'success.main' : (selectedStepId === step.id ? 'primary.main' : '#ddd'),
                    borderRadius: 3,
                    bgcolor: selectedStepId === step.id ? 'primary.50' : 'white',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: 6 }
                  }}
                  onClick={() => setSelectedStepId(step.id)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: step.type === 'form' ? 'primary.main' : 'secondary.main', width: 32, height: 32 }}>
                      {index + 1}
                    </Avatar>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {step.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Role: <Chip label={step.assignedRole || 'System'} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                  </Typography>
                  {step.type === 'form' && step.templateId && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block' }}>
                      Linked to Form Template
                    </Typography>
                  )}
                </Paper>
              </React.Fragment>
            ))}

            {workflow.steps.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 20 }}>
                <AccountTreeIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">Start building your patient journey</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddStep} sx={{ mt: 2 }}>
                  Add First Step
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* Right Panel - Selected Step Details */}
        <Paper sx={{ width: 320, flexShrink: 0, borderRadius: 0, overflow: 'auto', p: 2 }}>
          {selectedStep ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Step Details
              </Typography>

              <TextField
                fullWidth
                label="Step Name"
                value={selectedStep.name}
                onChange={(e) => {
                  setWorkflow(prev => ({
                    ...prev,
                    steps: prev.steps.map(s =>
                      s.id === selectedStep.id ? { ...s, name: e.target.value } : s
                    ),
                  }));
                }}
                sx={{ mb: 2 }}
                size="small"
              />

              <FormControl fullWidth sx={{ mb: 2 }} size="small">
                <InputLabel>Step Type</InputLabel>
                <Select
                  value={selectedStep.type}
                  label="Step Type"
                  onChange={(e) => {
                    setWorkflow(prev => ({
                      ...prev,
                      steps: prev.steps.map(s =>
                        s.id === selectedStep.id ? { ...s, type: e.target.value } : s
                      ),
                    }));
                  }}
                >
                  {STEP_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedStep.type === 'form' && (
                <FormControl fullWidth sx={{ mb: 2 }} size="small">
                  <InputLabel>Form Template</InputLabel>
                  <Select
                    value={selectedStep.templateId || ''}
                    label="Form Template"
                    onChange={(e) => {
                      setWorkflow(prev => ({
                        ...prev,
                        steps: prev.steps.map(s =>
                          s.id === selectedStep.id ? { ...s, templateId: e.target.value } : s
                        ),
                      }));
                    }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {Object.values(templates).map(template => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <TextField
                fullWidth
                label="Assigned Role"
                value={selectedStep.assignedRole || ''}
                onChange={(e) => {
                  setWorkflow(prev => ({
                    ...prev,
                    steps: prev.steps.map(s =>
                      s.id === selectedStep.id ? { ...s, assignedRole: e.target.value } : s
                    ),
                  }));
                }}
                sx={{ mb: 2 }}
                size="small"
                placeholder="e.g., doctor, nurse, admin"
              />

              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={selectedStep.id === workflow.startStepId}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateWorkflowData({ startStepId: selectedStep.id });
                      }
                    }}
                  />
                }
                label="Start Step"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={workflow.endStepIds.includes(selectedStep.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateWorkflowData({
                          endStepIds: [...workflow.endStepIds, selectedStep.id],
                        });
                      } else {
                        updateWorkflowData({
                          endStepIds: workflow.endStepIds.filter(id => id !== selectedStep.id),
                        });
                      }
                    }}
                  />
                }
                label="End Step"
              />
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                Select a step to view details
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Step Dialog */}
      <Dialog open={showStepDialog} onClose={() => setShowStepDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingStep?.id && workflow.steps.find(s => s.id === editingStep.id) ? 'Edit Step' : 'Add Step'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Step Name"
                value={editingStep?.name || ''}
                onChange={(e) => setEditingStep(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Step Type</InputLabel>
                <Select
                  value={editingStep?.type || 'form'}
                  label="Step Type"
                  onChange={(e) => setEditingStep(prev => ({ ...prev, type: e.target.value }))}
                >
                  {STEP_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box>
                        <Typography variant="body2">{type.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {editingStep?.type === 'form' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Form Template</InputLabel>
                  <Select
                    value={editingStep?.templateId || ''}
                    label="Form Template"
                    onChange={(e) => setEditingStep(prev => ({ ...prev, templateId: e.target.value }))}
                  >
                    <MenuItem value="">None</MenuItem>
                    {Object.values(templates).map(template => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assigned Role"
                value={editingStep?.assignedRole || ''}
                onChange={(e) => setEditingStep(prev => ({ ...prev, assignedRole: e.target.value }))}
                placeholder="e.g., doctor, nurse, receptionist"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStepDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveStep} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Transition Dialog */}
      <Dialog open={showTransitionDialog} onClose={() => setShowTransitionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Transition</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>From Step</InputLabel>
                <Select
                  value={editingTransition?.fromStepId || ''}
                  label="From Step"
                  onChange={(e) => setEditingTransition(prev => ({ ...prev, fromStepId: e.target.value }))}
                >
                  {workflow.steps.map(step => (
                    <MenuItem key={step.id} value={step.id}>{step.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>To Step</InputLabel>
                <Select
                  value={editingTransition?.toStepId || ''}
                  label="To Step"
                  onChange={(e) => setEditingTransition(prev => ({ ...prev, toStepId: e.target.value }))}
                >
                  {workflow.steps
                    .filter(s => s.id !== editingTransition?.fromStepId)
                    .map(step => (
                      <MenuItem key={step.id} value={step.id}>{step.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Label (Optional)"
                value={editingTransition?.label || ''}
                onChange={(e) => setEditingTransition(prev => ({ ...prev, label: e.target.value }))}
                placeholder="e.g., Approved, Rejected"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTransitionDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveTransition} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WorkflowBuilder;