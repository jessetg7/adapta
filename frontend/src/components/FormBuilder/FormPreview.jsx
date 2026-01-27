// src/components/FormBuilder/FormPreview.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tab,
  Tabs,
} from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import DevicesIcon from '@mui/icons-material/Devices';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletIcon from '@mui/icons-material/Tablet';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import FormRenderer from '../FormRenderer/FormRenderer';

/**
 * Device Preview Wrapper
 */
const DeviceWrapper = ({ device, children }) => {
  const deviceStyles = {
    mobile: {
      maxWidth: 375,
      border: '8px solid #333',
      borderRadius: 24,
      overflow: 'hidden',
    },
    tablet: {
      maxWidth: 768,
      border: '8px solid #333',
      borderRadius: 16,
      overflow: 'hidden',
    },
    desktop: {
      maxWidth: '100%',
    },
  };

  return (
    <Box
      sx={{
        ...deviceStyles[device],
        mx: 'auto',
        bgcolor: 'background.paper',
      }}
    >
      {children}
    </Box>
  );
};

/**
 * Form Preview Component
 */
const FormPreview = ({
  template,
  open = false,
  onClose,
  sampleData = {},
  sampleContext = {},
  rules = [],
  fullScreen = false,
}) => {
  const [device, setDevice] = useState('desktop');
  const [formData, setFormData] = useState(sampleData);

  // If used as inline component
  if (!onClose) {
    return (
      <Box>
        {!template ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No template to preview</Typography>
          </Box>
        ) : !template.sections || template.sections.length === 0 ? (
          <Alert severity="info">Add sections and fields to see the preview</Alert>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              {template.name || 'Untitled Form'}
            </Typography>

            {template.metadata?.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {template.metadata.description}
              </Typography>
            )}

            {/* Template Info Chips */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {template.type && <Chip label={template.type} size="small" variant="outlined" />}
              {template.category && <Chip label={template.category} size="small" color="primary" />}
              {template.genderSpecific && template.genderSpecific !== 'all' && (
                <Chip label={template.genderSpecific} size="small" color="secondary" />
              )}
              {template.visitType && template.visitType !== 'all' && (
                <Chip label={template.visitType} size="small" />
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <FormRenderer
              template={template}
              initialData={formData}
              context={sampleContext}
              rules={rules}
              readOnly={false}
              showSubmit={false}
              showSave={false}
              onSubmit={(data) => {
                console.log('Form submitted:', data);
                setFormData(data);
              }}
            />
          </Box>
        )}
      </Box>
    );
  }

  // If used as dialog
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: { height: fullScreen ? '100%' : '90vh' },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PreviewIcon color="primary" />
            <Typography variant="h6">Form Preview</Typography>
            {template?.name && (
              <Chip label={template.name} size="small" variant="outlined" />
            )}
          </Box>

          {/* Device Selector */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant={device === 'mobile' ? 'contained' : 'outlined'}
              onClick={() => setDevice('mobile')}
              startIcon={<PhoneAndroidIcon />}
            >
              Mobile
            </Button>
            <Button
              size="small"
              variant={device === 'tablet' ? 'contained' : 'outlined'}
              onClick={() => setDevice('tablet')}
              startIcon={<TabletIcon />}
            >
              Tablet
            </Button>
            <Button
              size="small"
              variant={device === 'desktop' ? 'contained' : 'outlined'}
              onClick={() => setDevice('desktop')}
              startIcon={<DesktopWindowsIcon />}
            >
              Desktop
            </Button>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.100', p: 3 }}>
        {!template ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No template to preview</Typography>
          </Box>
        ) : !template.sections || template.sections.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Add sections and fields to see the preview
          </Alert>
        ) : (
          <DeviceWrapper device={device}>
            <Paper sx={{ p: 3, minHeight: 400 }}>
              <Typography variant="h5" gutterBottom>
                {template.name || 'Untitled Form'}
              </Typography>

              {template.metadata?.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {template.metadata.description}
                </Typography>
              )}

              <Divider sx={{ mb: 3 }} />

              <FormRenderer
                template={template}
                initialData={formData}
                context={sampleContext}
                rules={rules}
                readOnly={false}
                showSubmit={true}
                showSave={false}
                onSubmit={(data) => {
                  console.log('Form submitted:', data);
                  setFormData(data);
                }}
              />
            </Paper>
          </DeviceWrapper>
        )}
      </DialogContent>

      <DialogActions>
        <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1, pl: 2 }}>
          {template?.sections?.length || 0} sections •{' '}
          {template?.sections?.reduce((acc, s) => acc + (s.fields?.length || 0), 0) || 0} fields
        </Typography>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormPreview;