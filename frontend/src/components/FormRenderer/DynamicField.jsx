// src/components/FormRenderer/DynamicField.jsx
import React from 'react';
import { Box, FormHelperText } from '@mui/material';
import { getFieldRenderer } from '../../core/registry/FieldRegistry';

/**
 * DynamicField - Renders any field type based on JSON configuration
 * This is the CORE of the LCNC system
 */
const DynamicField = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
  context = {},
}) => {
  const FieldRenderer = getFieldRenderer(field.type);

  if (!FieldRenderer) {
    return (
      <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
        <FormHelperText error>Unknown field type: {field.type}</FormHelperText>
      </Box>
    );
  }

  // Calculate width based on field configuration
  const widthMap = {
    full: '100%',
    half: { xs: '100%', sm: '50%' },
    third: { xs: '100%', sm: '33.33%' },
    quarter: { xs: '100%', sm: '25%' },
  };

  const width = widthMap[field.width || 'full'];

  return (
    <Box
      sx={{
        width,
        px: 1,
        py: 0.75,
        boxSizing: 'border-box',
      }}
    >
      <FieldRenderer
        field={field}
        value={value}
        onChange={onChange}
        error={error}
        disabled={disabled}
        context={context}
      />
    </Box>
  );
};

export default DynamicField;