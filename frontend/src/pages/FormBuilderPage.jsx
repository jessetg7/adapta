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
  const { templates, fetchDepartmentTemplates } = useTemplateStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeHydrated, setStoreHydrated] = useState(false);

  console.log('FormBuilderPage - templateId:', templateId, 'loading:', loading, 'storeHydrated:', storeHydrated, 'templates:', templates);

  // Wait for Zustand store to hydrate from localStorage
  useEffect(() => {
    // Always mark as hydrated after a short delay
    const timer = setTimeout(() => {
      setStoreHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const initializeTemplate = async () => {
      try {
        // Wait for store to hydrate
        if (!storeHydrated) {
          return;
        }

        setLoading(true);
        setError(null);

        if (templateId) {
          // First check if template exists in store
          if (templates[templateId]) {
            setLoading(false);
            return;
          }

          // Then check if it's in defaultTemplates
          const defaultTemplate = Object.values(defaultTemplates).find(t => t.id === templateId);
          if (defaultTemplate) {
            // Template exists in default templates, no need to load
            setLoading(false);
            return;
          }

          // Try to load from specialty if it's a department template
          const allTemplates = Object.values(defaultTemplates);
          const possibleTemplate = allTemplates.find(t => t.id === templateId);
          
          if (possibleTemplate && possibleTemplate.specialty) {
            await fetchDepartmentTemplates(possibleTemplate.specialty);
          } else {
            // Fallback: fetch General Medicine templates
            await fetchDepartmentTemplates('General Medicine');
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error initializing template:', err);
        setError(`Failed to load template: ${err.message}`);
        setLoading(false);
      }
    };

    initializeTemplate();
  }, [templateId, templates, storeHydrated, fetchDepartmentTemplates]);

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

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Typography sx={{ mt: 2 }}>
          <a href="/" onClick={() => navigate('/')}>
            Go back to dashboard
          </a>
        </Typography>
      </Box>
    );
  }

  return (
    <FormBuilder
      templateId={templateId}
      onSave={(template) => {
        console.log('Template saved:', template);
      }}
      onClose={() => navigate('/')}
    />
  );
};

export default FormBuilderPage;