import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ArrowBack as BackIcon,
  Edit as EditIcon,
  PlayArrow as FillIcon,
  Description as DescriptionIcon,
  TextFields as TextIcon,
  Numbers as NumberIcon,
  CheckBox as CheckboxIcon,
  CalendarMonth as DateIcon,
  ArrowDropDownCircle as DropdownIcon
} from '@mui/icons-material';
import { useForm } from '../context/FormContext';

const fieldTypeIcons = {
  text: TextIcon,
  number: NumberIcon,
  textarea: TextIcon,
  dropdown: DropdownIcon,
  multiselect: DropdownIcon,
  checkbox: CheckboxIcon,
  date: DateIcon
};

const FormPreviewScreen = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { getTemplateById } = useForm();
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    if (templateId) {
      const found = getTemplateById(templateId);
      if (found) {
        setTemplate(found);
      } else {
        navigate('/templates');
      }
    }
  }, [templateId]);

  if (!template) {
    return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
  }

  const totalFields = template.sections?.reduce((acc, s) => acc + (s.fields?.length || 0), 0) || 0;
  const requiredFields = template.sections?.reduce((acc, s) => 
    acc + (s.fields?.filter(f => f.required)?.length || 0), 0) || 0;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/templates')}>
          Back to Templates
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/form-builder/${template.id}`)}
          >
            Edit Template
          </Button>
          <Button
            variant="contained"
            startIcon={<FillIcon />}
            onClick={() => navigate(`/forms/fill/${template.id}`)}
          >
            Fill This Form
          </Button>
        </Box>
      </Box>

      {/* Template Header */}
      <Card sx={{ mb: 3, overflow: 'hidden' }}>
        <Box
          sx={{
            p: 4,
            background: `linear-gradient(135deg, ${template.color || '#1976d2'} 0%, ${template.color || '#1976d2'}88 100%)`,
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <DescriptionIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {template.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip label={template.category} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                <Chip label={`v${template.version}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              </Box>
            </Box>
          </Box>
          {template.description && (
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {template.description}
            </Typography>
          )}
        </Box>
      </Card>

      {/* Template Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {template.sections?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">Sections</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {totalFields}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Fields</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="error">
                {requiredFields}
              </Typography>
              <Typography variant="body2" color="text.secondary">Required Fields</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {template.usageCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">Times Used</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Form Structure Preview */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Form Structure
      </Typography>
      
      {template.sections?.map((section, sectionIndex) => (
        <Accordion key={section.id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                {sectionIndex + 1}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight={600}>{section.title}</Typography>
                {section.description && (
                  <Typography variant="caption" color="text.secondary">
                    {section.description}
                  </Typography>
                )}
              </Box>
              <Chip label={`${section.fields?.length || 0} fields`} size="small" />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableBody>
                  {section.fields?.map((field) => {
                    const IconComponent = fieldTypeIcons[field.type] || TextIcon;
                    return (
                      <TableRow key={field.id}>
                        <TableCell sx={{ width: 40 }}>
                          <IconComponent color="action" fontSize="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {field.label}
                          </Typography>
                          {field.placeholder && (
                            <Typography variant="caption" color="text.secondary">
                              {field.placeholder}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ width: 100 }}>
                          <Chip label={field.type} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell sx={{ width: 80 }}>
                          {field.required ? (
                            <Chip label="Required" size="small" color="error" />
                          ) : (
                            <Chip label="Optional" size="small" variant="outlined" />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          size="large"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/form-builder/${template.id}`)}
        >
          Edit This Template
        </Button>
        <Button
          variant="contained"
          size="large"
          startIcon={<FillIcon />}
          onClick={() => navigate(`/forms/fill/${template.id}`)}
        >
          Start Filling Form
        </Button>
      </Box>
    </Box>
  );
};

export default FormPreviewScreen;