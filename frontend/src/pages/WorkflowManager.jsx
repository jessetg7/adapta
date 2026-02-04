// src/pages/WorkflowManager.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  TextField,
  Chip,
  Switch,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import useWorkflowStore from '../core/store/useWorkflowStore';
import WorkflowBuilder from '../components/WorkflowBuilder/WorkflowBuilder';

const WorkflowManager = () => {
  const navigate = useNavigate();
  const { workflows, deleteWorkflow, toggleWorkflowActive } = useWorkflowStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkflowId, setEditingWorkflowId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState(null);

  // Filter workflows
  const filteredWorkflows = useMemo(() => {
    return Object.values(workflows).filter((workflow) => {
      return (
        !searchQuery ||
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [workflows, searchQuery]);

  // Handle edit
  const handleEdit = (workflowId) => {
    setEditingWorkflowId(workflowId);
    setShowBuilder(true);
  };

  // Handle new workflow
  const handleNewWorkflow = () => {
    setEditingWorkflowId(null);
    setShowBuilder(true);
  };

  // Handle delete
  const handleDeleteConfirm = () => {
    if (workflowToDelete) {
      deleteWorkflow(workflowToDelete);
    }
    setDeleteDialogOpen(false);
    setWorkflowToDelete(null);
  };

  if (showBuilder) {
    return (
      <WorkflowBuilder
        workflowId={editingWorkflowId}
        onSave={() => setShowBuilder(false)}
        onClose={() => setShowBuilder(false)}
      />
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <AccountTreeIcon sx={{ ml: 1, mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Workflow Manager
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleNewWorkflow}
          >
            New Workflow
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Search */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            size="small"
          />
        </Paper>

        {/* Workflows Grid */}
        {filteredWorkflows.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <AccountTreeIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No workflows found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create workflows to manage patient journeys
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewWorkflow}>
              Create Workflow
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredWorkflows.map((workflow) => (
              <Grid item xs={12} sm={6} md={4} key={workflow.id}>
                <Card sx={{ opacity: workflow.isActive ? 1 : 0.6 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        {workflow.name}
                      </Typography>
                      <Switch
                        checked={workflow.isActive}
                        onChange={() => toggleWorkflowActive(workflow.id)}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                      {workflow.department && (
                        <Chip label={workflow.department} size="small" color="primary" />
                      )}
                      <Chip
                        label={`${workflow.steps?.length || 0} steps`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`v${workflow.version}`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    {workflow.description && (
                      <Typography variant="body2" color="text.secondary">
                        {workflow.description}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(workflow.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        setWorkflowToDelete(workflow.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Workflow?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowManager;