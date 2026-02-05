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
          // Try to fetch if we need to, but don't wait for it
          const allTemplates = Object.values(defaultTemplates);
          const possibleTemplate = allTemplates.find(t => t.id === templateId);
          
          if (possibleTemplate && possibleTemplate.specialty) {
            fetchDepartmentTemplates(possibleTemplate.specialty).catch(err => 
              console.error('Error fetching department templates:', err)
            );
          }
        }
      } catch (err) {
        console.error('Error initializing template:', err);
        // Don't set error, just log it - let FormBuilder handle missing templates
      }
    };

    initializeTemplate();
  }, [templateId, fetchDepartmentTemplates]);

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