// src/components/PrescriptionBuilder/PrescriptionPreview.jsx
import React from 'react';
import { Box, Typography, Divider, Grid, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { formatDate, formatVitals, shouldRenderSection } from './prescriptionUtils';

/**
 * PrescriptionPreview - Renders prescription based on template
 * This is a preview component for the builder and PDF generation
 */
const PrescriptionPreview = ({ template, data, clinicInfo, doctor }) => {
  const styling = template?.styling || {};
  const sections = template?.sections || [];
  const enabledSections = sections
    .filter(s => shouldRenderSection(s, data))
    .sort((a, b) => a.order - b.order);

  // Render section based on type
  const renderSection = (section) => {
    switch (section.type) {
      case 'header':
        return (
          <Box key={section.id} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ color: styling.primaryColor || 'primary.main', fontWeight: 700 }}
                >
                  {clinicInfo?.name || 'Medical Center'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {clinicInfo?.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {clinicInfo?.phone} | Email: {clinicInfo?.email}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" sx={{ color: styling.primaryColor || 'primary.main' }}>
                  {doctor?.name || 'Doctor Name'}
                </Typography>
                <Typography variant="body2">{doctor?.qualification}</Typography>
                <Typography variant="body2">{doctor?.specialization}</Typography>
                <Typography variant="caption">Reg. No: {doctor?.registrationNo}</Typography>
              </Box>
            </Box>
            <Divider sx={{ mt: 2, borderWidth: 2, borderColor: styling.primaryColor || 'primary.main' }} />
          </Box>
        );

      case 'patient-info':
        return (
          <Box
            key={section.id}
            sx={{
              mb: 2,
              p: 1.5,
              bgcolor: 'grey.50',
              borderRadius: 1,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
            }}
          >
            <Typography variant="body2">
              <strong>Patient:</strong> {data?.patient?.name || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Age/Sex:</strong> {data?.patient?.age || 'N/A'} / {data?.patient?.gender || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong> {formatDate(data?.visit?.date || data?.date)}
            </Typography>
            <Typography variant="body2">
              <strong>Patient ID:</strong> {data?.patient?.patientId || 'N/A'}
            </Typography>
          </Box>
        );

      case 'vitals':
        const vitals = formatVitals(data?.vitals);
        return (
          <Box key={section.id} sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: styling.primaryColor || 'primary.main',
                fontWeight: 600,
                mb: 1,
              }}
            >
              {section.title}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {vitals.map((vital, i) => (
                <Typography key={i} variant="body2" sx={{ bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 0.5 }}>
                  {vital}
                </Typography>
              ))}
            </Box>
          </Box>
        );

      case 'diagnosis':
        const diagnosisArray = Array.isArray(data.diagnosis) ? data.diagnosis : (data.diagnosis ? [data.diagnosis] : []);
        return (
          <Box key={section.id} sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: styling.primaryColor || 'primary.main',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {section.title}
            </Typography>
            <Typography variant="body2">{diagnosisArray.join(', ')}</Typography>
          </Box>
        );

      case 'medications':
        return (
          <Box key={section.id} sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: styling.primaryColor || 'primary.main',
                fontWeight: 600,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <span style={{ fontSize: '18px' }}>℞</span> {section.title}
            </Typography>
            <Box sx={{ pl: 2 }}>
              {data.medications.map((med, index) => (
                <Box
                  key={index}
                  sx={{
                    py: 0.75,
                    borderBottom: index < data.medications.length - 1 ? '1px dashed #ddd' : 'none',
                  }}
                >
                  <Typography variant="body2">
                    <strong>{index + 1}. {med.name}</strong>
                    {med.dose && ` - ${med.dose}`}
                    {med.route && ` (${med.route})`}
                    {med.frequency && ` - ${med.frequency}`}
                    {med.duration && ` for ${med.duration}`}
                  </Typography>
                  {med.instructions && (
                    <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                      [{med.instructions}]
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        );

      case 'investigations':
        return (
          <Box key={section.id} sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: styling.primaryColor || 'primary.main',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {section.title}
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 3 }}>
              {data.investigations.map((inv, i) => (
                <li key={i}>
                  <Typography variant="body2">{typeof inv === 'object' ? inv.name : inv}</Typography>
                </li>
              ))}
            </Box>
          </Box>
        );

      case 'advice':
        const adviceArray = Array.isArray(data.advice) ? data.advice : (data.advice ? data.advice.split('\n') : []);
        return (
          <Box key={section.id} sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: styling.primaryColor || 'primary.main',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {section.title}
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 3 }}>
              {adviceArray.map((adv, i) => (
                <li key={i}>
                  <Typography variant="body2">{adv}</Typography>
                </li>
              ))}
            </Box>
          </Box>
        );

      case 'follow-up':
        const fuDate = data.followUp || data.followUpDate;
        return (
          <Box key={section.id} sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: styling.primaryColor || 'primary.main',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {section.title}
            </Typography>
            <Typography variant="body2">
              Please visit on: <strong>{formatDate(fuDate)}</strong>
            </Typography>
          </Box>
        );

      case 'signature':
        return (
          <Box key={section.id} sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ width: 200, borderTop: '1px solid #333', pt: 1, mt: 6 }}>
                <Typography variant="body2" fontWeight={600}>
                  {doctor?.name}
                </Typography>
                <Typography variant="caption">{doctor?.qualification}</Typography>
              </Box>
            </Box>
          </Box>
        );

      case 'table':
        const tableData = data[section.id] || [];
        const columns = section.config?.columns || [];
        return (
          <Box key={section.id} sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: styling.primaryColor || 'primary.main',
                fontWeight: 600,
                mb: 1,
              }}
            >
              {section.title}
            </Typography>
            <Table size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
              <TableBody>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  {columns.map(col => (
                    <TableCell key={col.id} sx={{ fontWeight: 700, py: 1 }}>
                      {col.header}
                    </TableCell>
                  ))}
                </TableRow>
                {tableData.map((row, i) => (
                  <TableRow key={i}>
                    {columns.map(col => (
                      <TableCell key={col.id} sx={{ py: 1 }}>
                        {row[col.id] || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        fontFamily: styling.fontFamily || 'Arial, sans-serif',
        fontSize: styling.bodyFontSize || '12pt',
        lineHeight: styling.lineHeight || 1.5,
      }}
    >
      {enabledSections.map(renderSection)}
    </Box>
  );
};

export default PrescriptionPreview;