// src/pages/TemplateManager.jsx
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Tooltip,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

import useTemplateStore from '../core/store/useTemplateStore';
import { TEMPLATE_TYPES, TEMPLATE_CATEGORIES } from '../core/registry/fieldConfigs';
import StarterTemplatesGallery from '../components/TemplateGallery/StarterTemplatesGallery';

const TemplateManager = () => {
  const navigate = useNavigate();
  const {
    templates,
    deleteTemplate,
    cloneTemplate,
    exportTemplates,
    importTemplates,
  } = useTemplateStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [starterGalleryOpen, setStarterGalleryOpen] = useState(false);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return Object.values(templates).filter((template) => {
      const matchesSearch =
        !searchQuery ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || template.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, selectedCategory]);

  // Handle menu
  const handleMenuOpen = (event, templateId) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedTemplateId(templateId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTemplateId(null);
  };

  // Handle delete
  const handleDeleteClick = () => {
    setTemplateToDelete(selectedTemplateId);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete);
    }
    setDeleteDialogOpen(false);
    setTemplateToDelete(null);
  };

  // Handle clone
  const handleClone = () => {
    if (selectedTemplateId) {
      cloneTemplate(selectedTemplateId);
    }
    handleMenuClose();
  };

  // Handle export
  const handleExport = () => {
    const data = exportTemplates();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adapta-templates.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle import
  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          importTemplates(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <ArticleIcon sx={{ ml: 1, mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Template Manager
          </Typography>
          <Button
            color="inherit"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button color="inherit" component="label" startIcon={<UploadIcon />}>
            Import
            <input type="file" hidden accept=".json" onChange={handleImport} />
          </Button>
          <Button
            color="inherit"
            startIcon={<ArticleIcon />}
            onClick={() => setStarterGalleryOpen(true)}
            sx={{ ml: 1 }}
          >
            Browse Starter Templates
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/form-builder')}
            sx={{ ml: 2 }}
          >
            New Template
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Tabs
                value={selectedCategory}
                onChange={(e, v) => setSelectedCategory(v)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="All" value="all" />
                {Object.entries(TEMPLATE_CATEGORIES).map(([key, { label }]) => (
                  <Tab key={key} label={label} value={key} />
                ))}
              </Tabs>
            </Grid>
          </Grid>
        </Paper>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <ArticleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No templates found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first template to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/form-builder')}
            >
              Create Template
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredTemplates.map((template) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        {template.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, template.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        label={TEMPLATE_TYPES[template.type]?.label || template.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={TEMPLATE_CATEGORIES[template.category]?.label || template.category}
                        size="small"
                        sx={{
                          bgcolor: TEMPLATE_CATEGORIES[template.category]?.color,
                          color: 'white',
                        }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {template.sections?.length || 0} sections •{' '}
                      {template.sections?.reduce((acc, s) => acc + (s.fields?.length || 0), 0) || 0}{' '}
                      fields
                    </Typography>

                    {template.genderSpecific && template.genderSpecific !== 'all' && (
                      <Chip
                        label={template.genderSpecific}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/form-builder/${template.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => cloneTemplate(template.id)}
                    >
                      Clone
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/form-builder/${selectedTemplateId}`);
          handleMenuClose();
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleClone}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
          Clone
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Template?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this template? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Starter Templates Gallery */}
      <StarterTemplatesGallery
        open={starterGalleryOpen}
        onClose={() => setStarterGalleryOpen(false)}
        onSelectTemplate={(template) => {
          // Clone the template to avoid reference issues
          const newTemplate = JSON.parse(JSON.stringify(template));
          // Generate new ID to avoid conflicts
          newTemplate.id = `${template.id}-${Date.now()}`;
          newTemplate.isStarter = false; // Mark as user's copy
          newTemplate.metadata.createdAt = new Date().toISOString();
          newTemplate.metadata.updatedAt = new Date().toISOString();

          // Add to store
          const { addTemplate } = useTemplateStore.getState();
          addTemplate(newTemplate);

          // Show success message (you can add a snackbar here)
          console.log(`✅ Added template: ${template.name}`);
        }}
      />
    </Box>
  );
};

export default TemplateManager;