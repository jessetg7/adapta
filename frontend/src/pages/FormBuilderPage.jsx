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
  const [error, setError] = useState(null);
  const [storeHydrated, setStoreHydrated] = useState(false);

  console.log('FormBuilderPage rendering - templateId:', templateId, 'loading:', loading, 'storeHydrated:', storeHydrated);

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
        // Immediately set loading to false to show the page even if store isn't ready
        setLoading(false);
        setError(null);

        if (templateId) {
          // Check if template already exists locally
          let foundTemplate = templates[templateId] || 
                             Object.values(defaultTemplates).find(t => t.id === templateId) || 
                             remoteTemplates.find(t => t.id === templateId);
          
          if (foundTemplate && foundTemplate.specialty) {
            // Fetch all templates for that specialty to ensure they're available
            await fetchDepartmentTemplates(foundTemplate.specialty);
          } else {
            // Template not found locally, try to fetch all specialties and templates
            // This handles cases where user navigates directly to the URL
            await fetchDepartmentTemplates('');
          }
        }
      } catch (err) {
        console.error('Error initializing template:', err);
        // Don't set error, just log it - let FormBuilder handle missing templates
      }
    };

    initializeTemplate();
  }, [templateId, fetchDepartmentTemplates, templates, remoteTemplates]);

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