import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import FieldPalette from './FieldPalette';
import FieldRenderer from './FieldRenderer';
import FieldProperties from './FieldProperties';

const FormBuilder = ({ template, onChange }) => {
  const [selectedField, setSelectedField] = useState(null);
  const [expandedSection, setExpandedSection] = useState(template?.sections?.[0]?.id || '');

  const handleTemplateInfoChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleAddSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: '',
      order: (template.sections?.length || 0) + 1,
      collapsible: true,
      defaultExpanded: true,
      fields: []
    };
    onChange({
      sections: [...(template.sections || []), newSection]
    });
    setExpandedSection(newSection.id);
  };

  const handleSectionChange = (sectionId, updates) => {
    onChange({
      sections: template.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      )
    });
  };

  const handleDeleteSection = (sectionId) => {
    onChange({
      sections: template.sections.filter(s => s.id !== sectionId)
    });
  };

  const handleAddField = (sectionId, fieldType) => {
    const newField = {
      id: `field-${Date.now()}`,
      type: fieldType,
      label: `New ${fieldType} field`,
      placeholder: '',
      required: false,
      order: template.sections.find(s => s.id === sectionId)?.fields?.length + 1 || 1
    };

    if (fieldType === 'dropdown' || fieldType === 'multiselect') {
      newField.options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ];
    }

    onChange({
      sections: template.sections.map(s =>
        s.id === sectionId
          ? { ...s, fields: [...(s.fields || []), newField] }
          : s
      )
    });
    setSelectedField(newField);
  };

  const handleFieldChange = (sectionId, fieldId, updates) => {
    onChange({
      sections: template.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              fields: s.fields.map(f =>
                f.id === fieldId ? { ...f, ...updates } : f
              )
            }
          : s
      )
    });
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates });
    }
  };

  const handleDeleteField = (sectionId, fieldId) => {
    onChange({
      sections: template.sections.map(s =>
        s.id === sectionId
          ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) }
          : s
      )
    });
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Field Palette */}
      <Grid item xs={12} md={2}>
        <FieldPalette onAddField={(type) => {
          if (template.sections?.length > 0) {
            handleAddField(expandedSection || template.sections[0].id, type);
          }
        }} />
      </Grid>

      {/* Form Canvas */}
      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            {/* Template Info */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Template Name"
                value={template.name || ''}
                onChange={(e) => handleTemplateInfoChange('name', e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={template.description || ''}
                onChange={(e) => handleTemplateInfoChange('description', e.target.value)}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Sections */}
            {template.sections?.map((section) => (
              <Accordion
                key={section.id}
                expanded={expandedSection === section.id}
                onChange={() => setExpandedSection(
                  expandedSection === section.id ? '' : section.id
                )}
                sx={{ mb: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <DragIcon color="action" />
                    <Typography fontWeight={500}>{section.title}</Typography>
                    <Chip
                      label={`${section.fields?.length || 0} fields`}
                      size="small"
                      sx={{ ml: 'auto', mr: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(section.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    fullWidth
                    label="Section Title"
                    value={section.title}
                    onChange={(e) => handleSectionChange(section.id, { title: e.target.value })}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Section Description"
                    value={section.description || ''}
                    onChange={(e) => handleSectionChange(section.id, { description: e.target.value })}
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  {/* Fields */}
                  {section.fields?.map((field) => (
                    <Box
                      key={field.id}
                      onClick={() => setSelectedField(field)}
                      sx={{
                        p: 2,
                        mb: 1,
                        border: '1px solid',
                        borderColor: selectedField?.id === field.id ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        bgcolor: selectedField?.id === field.id ? 'primary.lighter' : 'background.paper',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DragIcon color="action" fontSize="small" />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {field.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {field.type} {field.required && '• Required'}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteField(section.id, field.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}

                  {(!section.fields || section.fields.length === 0) && (
                    <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                      No fields yet. Drag fields from the palette.
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}

            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddSection}
              sx={{ mt: 2 }}
            >
              Add Section
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Field Properties */}
      <Grid item xs={12} md={3}>
        <FieldProperties
          field={selectedField}
          onChange={(updates) => {
            if (selectedField) {
              const section = template.sections.find(s =>
                s.fields?.some(f => f.id === selectedField.id)
              );
              if (section) {
                handleFieldChange(section.id, selectedField.id, updates);
              }
            }
          }}
        />
      </Grid>
    </Grid>
  );
};

export default FormBuilder;