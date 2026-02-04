// src/pages/CreatePrescriptionPage.jsx
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PrescriptionCreator from '../components/PrescriptionBuilder/PrescriptionCreator';

const CreatePrescriptionPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const visitId = searchParams.get('visitId');
    const patientId = searchParams.get('patientId');

    return (
        <PrescriptionCreator
            visitId={visitId}
            patientId={patientId}
            onClose={() => navigate(-1)}
        />
    );
};

export default CreatePrescriptionPage;
