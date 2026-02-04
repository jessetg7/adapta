// src/pages/ReportPage.jsx
import React from 'react';
import ReportBuilder from '../components/ReportBuilder/ReportBuilder';
import { useNavigate } from 'react-router-dom';

const ReportPage = () => {
    const navigate = useNavigate();

    const handleSave = (config) => {
        console.log('Report saved:', config);
        // In a real app, this would persist to the backend
    };

    const handleClose = () => {
        navigate('/');
    };

    return (
        <ReportBuilder onSave={handleSave} onClose={handleClose} />
    );
};

export default ReportPage;
