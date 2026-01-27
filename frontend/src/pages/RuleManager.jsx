// src/pages/RuleManager.jsx
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
import RuleIcon from '@mui/icons-material/Rule';

import useRuleStore from '../core/store/useRuleStore';
import RuleBuilder from '../components/RuleBuilder/RuleBuilder';

const RuleManager = () => {
  const navigate = useNavigate();
  const { rules, deleteRule, toggleRule } = useRuleStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);

  // Filter rules
  const filteredRules = useMemo(() => {
    return Object.values(rules).filter((rule) => {
      return (
        !searchQuery ||
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [rules, searchQuery]);

  // Handle edit
  const handleEdit = (ruleId) => {
    setEditingRuleId(ruleId);
    setShowBuilder(true);
  };

  // Handle new rule
  const handleNewRule = () => {
    setEditingRuleId(null);
    setShowBuilder(true);
  };

  // Handle delete
  const handleDeleteConfirm = () => {
    if (ruleToDelete) {
      deleteRule(ruleToDelete);
    }
    setDeleteDialogOpen(false);
    setRuleToDelete(null);
  };

  if (showBuilder) {
    return (
      <RuleBuilder
        ruleId={editingRuleId}
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
          <RuleIcon sx={{ ml: 1, mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Rule Manager
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleNewRule}
          >
            New Rule
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Search */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            size="small"
          />
        </Paper>

        {/* Rules Grid */}
        {filteredRules.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <RuleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No rules found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create rules to add conditional logic to your forms
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewRule}>
              Create Rule
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredRules.map((rule) => (
              <Grid item xs={12} sm={6} md={4} key={rule.id}>
                <Card
                  sx={{
                    opacity: rule.enabled ? 1 : 0.6,
                    transition: 'all 0.2s',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        {rule.name}
                      </Typography>
                      <Switch
                        checked={rule.enabled}
                        onChange={() => toggleRule(rule.id)}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                      <Chip label={rule.category || 'custom'} size="small" color="primary" />
                      <Chip
                        label={`${rule.conditions?.conditions?.length || 0} conditions`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`${rule.actions?.length || 0} actions`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    {rule.description && (
                      <Typography variant="body2" color="text.secondary">
                        {rule.description}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(rule.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        setRuleToDelete(rule.id);
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
        <DialogTitle>Delete Rule?</DialogTitle>
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

export default RuleManager;