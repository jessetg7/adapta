import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, CardActions, Typography, Button, TextField,
  InputAdornment, Chip, IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Tabs, Tab, Avatar, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Tooltip
} from '@mui/material';
import {
  Search as SearchIcon, Add as AddIcon, MoreVert as MoreVertIcon,
  Edit as EditIcon, Delete as DeleteIcon, ContentCopy as DuplicateIcon,
  FileDownload as ExportIcon, FileUpload as ImportIcon, Visibility as PreviewIcon,
  Favorite as FavoriteIcon, LocalHospital as HospitalIcon, ChildCare as ChildIcon,
  Description as DescriptionIcon, PlayArrow as UseIcon
} from '@mui/icons-material';
import { useForm } from '../context/FormContext';

const categoryIcons = {
  Cardiology: FavoriteIcon,
  General: HospitalIcon,
  Pediatrics: ChildIcon,
  default: DescriptionIcon
};

function TemplatesScreen() {
  const navigate = useNavigate();
  const { templates, categories, deleteTemplate, duplicateTemplate, exportTemplate, importTemplate, createNewTemplate } = useForm();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const filtered = templates.filter(t => {
    const matchCategory = category === 'all' || t.category?.toLowerCase() === category.toLowerCase();
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleMenuOpen = (e, template) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelected(template);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (selected) navigate(`/form-builder/${selected.id}`);
    handleMenuClose();
  };

  const handlePreview = () => {
    if (selected) navigate(`/forms/preview/${selected.id}`);
    handleMenuClose();
  };

  const handleFill = (template) => {
    navigate(`/forms/fill/${template.id}`);
  };

  const handleDuplicate = () => {
    if (selected) {
      duplicateTemplate(selected.id);
      setSnackbar({ open: true, message: 'Template duplicated!', severity: 'success' });
    }
    handleMenuClose();
  };

  const handleExport = () => {
    if (selected) {
      exportTemplate(selected.id);
      setSnackbar({ open: true, message: 'Template exported!', severity: 'success' });
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (selected) {
      const success = deleteTemplate(selected.id);
      setSnackbar({
        open: true,
        message: success ? 'Template deleted!' : 'Cannot delete built-in templates',
        severity: success ? 'success' : 'error'
      });
    }
    setDeleteOpen(false);
    setSelected(null);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importTemplate(file);
        setSnackbar({ open: true, message: 'Template imported!', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: 'Import failed', severity: 'error' });
      }
    }
    e.target.value = '';
  };

  const handleCreate = () => {
    createNewTemplate();
    navigate('/form-builder/new');
  };

  const getCategoryIcon = (cat) => {
    const Icon = categoryIcons[cat] || categoryIcons.default;
    return <Icon />;
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Form Templates</Typography>
        <Typography color="text.secondary">Browse, create, and manage reusable form templates</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <TextField
          placeholder="Search templates..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <input type="file" accept=".json" hidden id="import-file" onChange={handleImport} />
          <label htmlFor="import-file">
            <Button component="span" variant="outlined" startIcon={<ImportIcon />}>Import</Button>
          </label>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>Create Template</Button>
        </Box>
      </Box>

      <Tabs value={category} onChange={(e, v) => setCategory(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>All <Chip label={templates.length} size="small" /></Box>} value="all" />
        {categories.map((cat) => (
          <Tab
            key={cat.id}
            value={cat.name.toLowerCase()}
            label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{getCategoryIcon(cat.name)} {cat.name}</Box>}
          />
        ))}
      </Tabs>

      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'grey.50', borderRadius: 2, border: '2px dashed', borderColor: 'grey.300' }}>
          <DescriptionIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">No templates found</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ mt: 2 }}>Create Template</Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((template) => {
            const Icon = categoryIcons[template.category] || categoryIcons.default;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                  <Box sx={{ p: 2, background: `linear-gradient(135deg, ${template.color || '#1976d2'} 0%, ${template.color || '#1976d2'}88 100%)`, color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}><Icon /></Avatar>
                    <IconButton size="small" sx={{ color: 'white' }} onClick={(e) => handleMenuOpen(e, template)}><MoreVertIcon /></IconButton>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap>{template.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: 40 }}>
                      {template.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <Chip label={template.category} size="small" sx={{ bgcolor: `${template.color}22`, color: template.color }} />
                      <Chip label={`v${template.version}`} size="small" variant="outlined" />
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                    <Typography variant="caption" color="text.secondary">{template.usageCount || 0} uses</Typography>
                    <Box>
                      <Tooltip title="Preview">
                        <IconButton size="small" onClick={() => navigate(`/forms/preview/${template.id}`)}>
                          <PreviewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => navigate(`/form-builder/${template.id}`)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Fill Form">
                        <IconButton size="small" color="primary" onClick={() => handleFill(template)}>
                          <UseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handlePreview}><ListItemIcon><PreviewIcon fontSize="small" /></ListItemIcon><ListItemText>Preview</ListItemText></MenuItem>
        <MenuItem onClick={handleEdit}><ListItemIcon><EditIcon fontSize="small" /></ListItemIcon><ListItemText>Edit</ListItemText></MenuItem>
        <MenuItem onClick={() => { handleFill(selected); handleMenuClose(); }}><ListItemIcon><UseIcon fontSize="small" /></ListItemIcon><ListItemText>Fill Form</ListItemText></MenuItem>
        <Divider />
        <MenuItem onClick={handleDuplicate}><ListItemIcon><DuplicateIcon fontSize="small" /></ListItemIcon><ListItemText>Duplicate</ListItemText></MenuItem>
        <MenuItem onClick={handleExport}><ListItemIcon><ExportIcon fontSize="small" /></ListItemIcon><ListItemText>Export</ListItemText></MenuItem>
        <Divider />
        <MenuItem onClick={() => { setDeleteOpen(true); handleMenuClose(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon><ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete "{selected?.name}"?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default TemplatesScreen;