// src/pages/FormBuilderPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import FormBuilder from '../components/FormBuilder/FormBuilder';
import useTemplateStore from '../core/store/useTemplateStore';
import { defaultTemplates } from '../data/defaultTemplates';

const FormBuilderPage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { templates, remoteTemplates, fetchDepartmentTemplates } = useTemplateStore();
  const [loading, setLoading] = useState(true);
  const [templateReady, setTemplateReady] = useState(false);

  console.log('FormBuilderPage - templateId:', templateId, 'remoteTemplates count:', remoteTemplates?.length);

  // Separate effect to ensure templates are fetched before rendering FormBuilder
  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) {
        setLoading(false);
        setTemplateReady(true);
        return;
      }

      try {
        // First check if template is already in store or defaults
        const inStore = templates[templateId];
        const inDefaults = Object.values(defaultTemplates).find(t => t.id === templateId);
        const inRemote = remoteTemplates.find(t => t.id === templateId);

        if (inStore || inDefaults || inRemote) {
          // Template already available
          console.log('Template already available:', templateId);
          setLoading(false);
          setTemplateReady(true);
          return;
        }

        // Template not found locally - need to fetch it
        // Try to extract specialty from templateId (format: template-specialty or specialty-variant)
        const specialtyMatch = templateId.match(/template-(\w+)|(\w+)/);
        const specialty = specialtyMatch ? specialtyMatch[1] || specialtyMatch[2] : '';

        console.log('Fetching templates for specialty:', specialty);
        await fetchDepartmentTemplates(specialty || '');

        // Wait a bit for store to update
        await new Promise(resolve => setTimeout(resolve, 100));

        setLoading(false);
        setTemplateReady(true);
      } catch (err) {
        console.error('Error loading template:', err);
        setLoading(false);
        setTemplateReady(true);
      }
    };

    loadTemplate();
  }, [templateId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FormBuilder
      key={templateId}
      templateId={templateId}
      onSave={(template) => {
        console.log('Template saved:', template);
      }}
      onClose={() => navigate('/')}
    />
  );
};

export default FormBuilderPage;