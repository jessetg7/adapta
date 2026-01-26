import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, TextField, Grid, Accordion, AccordionSummary, AccordionDetails, IconButton, Chip, Snackbar, Alert } from '@mui/material';
import { Save as SaveIcon, ArrowBack as BackIcon, ExpandMore as ExpandMoreIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useForm } from '../context/FormContext';

function FormBuilderScreen() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { getTemplateById, saveTemplate, createNewTemplate } = useForm();

  const [template, setTemplate] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (templateId && templateId !== 'new') {
      const found = getTemplateById(templateId);
      if (found) {
        setTemplate(JSON.parse(JSON.stringify(found))); // Deep clone
      } else {
        navigate('/templates');
      }
    } else {
      setTemplate(createNewTemplate());
    }
  }, [templateId]);

  if (!template) {
    return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
  }

  const handleSave = () => {
    saveTemplate(template);
    setSnackbar({ open: true, message: 'Template saved!', severity: 'success' });
  };

  const handleChange = (field, value) => {
    setTemplate(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (sectionId, field, value) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, [field]: value } : s)
    }));
  };

  const handleAddSection = () => {
    setTemplate(prev => ({
      ...prev,
      sections: [...prev.sections, { id: `section-${Date.now()}`, title: 'New Section', description: '', order: prev.sections.length + 1, fields: [], collapsible: true, defaultExpanded: true }]
    }));
  };

  const handleDeleteSection = (sectionId) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
  };

  const handleAddField = (sectionId, type = 'text') => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? {
        ...s,
        fields: [...(s.fields || []), { id: `field-${Date.now()}`, type, label: `New ${type} field`, required: false }]
      } : s)
    }));
  };

  const handleFieldChange = (sectionId, fieldId, field, value) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? {
        ...s,
        fields: s.fields.map(f => f.id === fieldId ? { ...f, [field]: value } : f)
      } : s)
    }));
  };

  const handleDeleteField = (sectionId, fieldId) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? {
        ...s,
        fields: s.fields.filter(f => f.id !== fieldId)
      } : s)
    }));
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/templates')}>Back</Button>
          <Typography variant="h5" fontWeight="bold">{template.name || 'Untitled'}</Typography>
        </Box>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>Save Template</Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Template Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Template Name" value={template.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Category" value={template.category || ''} onChange={(e) => handleChange('category', e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={2} label="Description" value={template.description || ''} onChange={(e) => handleChange('description', e.target.value)} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {template.sections?.map((section) => (
            <Accordion key={section.id} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Typography fontWeight={500}>{section.title}</Typography>
                  <Chip label={`${section.fields?.length || 0} fields`} size="small" sx={{ ml: 'auto', mr: 1 }} />
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}><DeleteIcon fontSize="small" /></IconButton>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth size="small" label="Section Title" value={section.title} onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth size="small" label="Description" value={section.description || ''} onChange={(e) => handleSectionChange(section.id, 'description', e.target.value)} />
                  </Grid>
                </Grid>

                {section.fields?.map((field) => (
                  <Box key={field.id} sx={{ p: 2, mb: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'grey.50' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <TextField fullWidth size="small" label="Label" value={field.label} onChange={(e) => handleFieldChange(section.id, field.id, 'label', e.target.value)} />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Chip label={field.type} size="small" />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Chip label={field.required ? 'Required' : 'Optional'} size="small" color={field.required ? 'error' : 'default'} onClick={() => handleFieldChange(section.id, field.id, 'required', !field.required)} />
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                        <IconButton size="small" color="error" onClick={() => handleDeleteField(section.id, field.id)}><DeleteIcon fontSize="small" /></IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}

                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  {['text', 'number', 'textarea', 'dropdown', 'checkbox', 'date'].map((type) => (
                    <Button key={type} size="small" variant="outlined" onClick={() => handleAddField(section.id, type)}>+ {type}</Button>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}

          <Button fullWidth variant="outlined" startIcon={<AddIcon />} onClick={handleAddSection} sx={{ mt: 2 }}>Add Section</Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Template Info</Typography>
              <Typography variant="body2" color="text.secondary">ID: {template.id}</Typography>
              <Typography variant="body2" color="text.secondary">Version: {template.version}</Typography>
              <Typography variant="body2" color="text.secondary">Sections: {template.sections?.length || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Total Fields: {template.sections?.reduce((acc, s) => acc + (s.fields?.length || 0), 0) || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default FormBuilderScreen;