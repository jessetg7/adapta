// src/pages/FormBuilderPage.jsx
console.log('[MODULE LOAD] FormBuilderPage.jsx module is loading...');

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import FormBuilder from '../components/FormBuilder/FormBuilder';
import useTemplateStore from '../core/store/useTemplateStore';
import { defaultTemplates } from '../data/defaultTemplates';

console.log('[MODULE LOAD] FormBuilderPage.jsx imports completed');

const FormBuilderPage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { templates, remoteTemplates, fetchDepartmentTemplates } = useTemplateStore();
  const [templateLoading, setTemplateLoading] = useState(true);

  console.log('=== FormBuilderPage MOUNTED ===');
  console.log('FormBuilderPage - templateId:', templateId);
  console.log('FormBuilderPage - templates count:', Object.keys(templates).length);
  console.log('FormBuilderPage - remoteTemplates count:', remoteTemplates?.length);
  console.log('FormBuilderPage - location.state:', location.state);

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

  // Handle close - check sessionStorage first, then location.state
  const handleClose = () => {
    console.log('[FormBuilderPage] Close button clicked');

    // Check sessionStorage first (for window.location navigation)
    const sessionData = sessionStorage.getItem('formBuilderReturnState');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        console.log('[FormBuilderPage] Found sessionStorage data:', parsed);
        if (parsed.returnTo) {
          console.log('[FormBuilderPage] Returning to:', parsed.returnTo);
          // Use window.location to match the forward navigation method
          window.location.href = parsed.returnTo;
          return;
        }
      } catch (error) {
        console.error('[FormBuilderPage] Error reading sessionStorage:', error);
      }
    }

    // Fallback to location.state (for React Router navigation)
    if (location.state?.returnTo && location.state?.returnState) {
      console.log('[FormBuilderPage] Returning via navigate to:', location.state.returnTo);
      navigate(location.state.returnTo, { state: { returnState: location.state.returnState } });
    } else {
      console.log('[FormBuilderPage] No return path, navigating to home');
      navigate('/');
    }
  };

  console.log('[FormBuilderPage] Loading complete, rendering FormBuilder');
  return (
    <FormBuilder
      key={templateId}
      templateId={templateId}
      onSave={(template) => {
        console.log('Template saved:', template);
      }}
      onClose={handleClose}
    />
  );
};

export default FormBuilderPage;