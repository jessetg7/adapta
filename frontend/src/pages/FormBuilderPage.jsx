// src/pages/FormBuilderPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormBuilder from '../components/FormBuilder/FormBuilder';

const FormBuilderPage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();

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