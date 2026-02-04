// src/pages/PrescriptionBuilderPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PrescriptionBuilder from '../components/PrescriptionBuilder/PrescriptionBuilder';

const PrescriptionBuilderPage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();

  return (
    <PrescriptionBuilder
      templateId={templateId}
      onSave={(template) => {
        console.log('Prescription template saved:', template);
      }}
      onClose={() => navigate('/')}
    />
  );
};

export default PrescriptionBuilderPage;