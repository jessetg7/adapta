// src/pages/FormBuilderPage.jsx
console.log('[MODULE LOAD] FormBuilderPage.jsx module is loading...');

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import FormBuilder from '../components/FormBuilder/FormBuilder';
import useTemplateStore from '../core/store/useTemplateStore';
import { defaultTemplates } from '../data/defaultTemplates';

console.log('[MODULE LOAD] FormBuilderPage.jsx imports completed');

const FormBuilderPage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { templates, remoteTemplates, fetchDepartmentTemplates } = useTemplateStore();
  const [templateLoading, setTemplateLoading] = useState(true);

  console.log('=== FormBuilderPage MOUNTED ===');
  console.log('FormBuilderPage - templateId:', templateId);
  console.log('FormBuilderPage - templates count:', Object.keys(templates).length);
  console.log('FormBuilderPage - remoteTemplates count:', remoteTemplates?.length);

  // Effect to pre-fetch templates when navigating to form builder
  useEffect(() => {
    console.log('[FormBuilderPage] Effect running for templateId:', templateId);
    
    const preloadTemplates = async () => {
      if (!templateId) {
        console.log('[FormBuilderPage] No templateId provided');
        setTemplateLoading(false);
        return;
      }

      try {
        // Check if template is already available
        const inStore = templates[templateId];
        const inDefaults = Object.values(defaultTemplates).find(t => t.id === templateId);
        const inRemote = remoteTemplates.find(t => t.id === templateId);

        console.log(`[FormBuilderPage] Checking template: ${templateId}`);
        console.log(`[FormBuilderPage] Found - store: ${!!inStore}, defaults: ${!!inDefaults}, remote: ${!!inRemote}`);

        if (inStore || inDefaults || inRemote) {
          console.log('[FormBuilderPage] Template already cached:', templateId);
          setTemplateLoading(false);
          return;
        }

        // Template not found - fetch it
        console.log('[FormBuilderPage] Template not cached, fetching:', templateId);
        const specialtyMatch = templateId.match(/template-(\w+)|(\w+)/);
        const specialty = specialtyMatch ? specialtyMatch[1] || specialtyMatch[2] : '';

        console.log('[FormBuilderPage] Fetching templates for specialty:', specialty);
        await fetchDepartmentTemplates(specialty || '');
        
        console.log('[FormBuilderPage] Fetch completed, now rendering FormBuilder');
        setTemplateLoading(false);
      } catch (err) {
        console.error('[FormBuilderPage] Error preloading templates:', err);
        setTemplateLoading(false);
      }
    };

    preloadTemplates();
  }, [templateId, templates, remoteTemplates]);

  // Show spinner only briefly while preloading
  if (templateLoading) {
    console.log('[FormBuilderPage] Still loading, showing spinner');
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

  console.log('[FormBuilderPage] Loading complete, rendering FormBuilder');
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