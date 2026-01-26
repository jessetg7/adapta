import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Button,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import FieldRenderer from './FieldRenderer';

const FormPreview = ({ template }) => {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (!template) {
    return (
      <Card>
        <CardContent>
          <Typography>No template to preview</Typography>
        </CardContent>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Form Submitted Successfully!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Your response has been recorded.
          </Typography>
          <Button variant="outlined" onClick={() => setSubmitted(false)}>
            Submit Another Response
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        {/* Form Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {template.name}
          </Typography>
          {template.description && (
            <Typography color="text.secondary">
              {template.description}
            </Typography>
          )}
        </Box>

        {/* Sections */}
        {template.sections?.map((section) => (
          <Accordion key={section.id} defaultExpanded={section.defaultExpanded}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box>
                <Typography fontWeight={600}>{section.title}</Typography>
                {section.description && (
                  <Typography variant="caption" color="text.secondary">
                    {section.description}
                  </Typography>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {section.fields?.map((field) => (
                  <Grid item xs={12} md={6} key={field.id}>
                    <FieldRenderer
                      field={field}
                      value={formData[field.id]}
                      onChange={handleFieldChange}
                    />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Submit Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" size="large" onClick={handleSubmit}>
            Submit Form
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FormPreview;