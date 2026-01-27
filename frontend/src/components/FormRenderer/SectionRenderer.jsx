// src/components/FormRenderer/SectionRenderer.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Collapse,
  IconButton,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DynamicField from './DynamicField';

const SectionRenderer = ({
  section,
  formData,
  errors,
  fieldStates,
  onChange,
  onBlur,
  context,
  readOnly,
}) => {
  const [collapsed, setCollapsed] = useState(section.defaultCollapsed || false);

  // Calculate grid columns based on section configuration
  // 1 column = 12 grid units, 2 cols = 6, 3 = 4, 4 = 3
  const gridColumnSize = 12 / (section.columns || 2);

  // Helper to calculate specific field width override
  const getFieldGridSize = (fieldWidth) => {
    switch (fieldWidth) {
      case 'full': return 12;
      case 'half': return 6;
      case 'third': return 4;
      case 'quarter': return 3;
      default: return gridColumnSize; // Default to section column setting
    }
  };

  return (
    <Paper sx={{ mb: 2, overflow: 'hidden' }} variant="outlined">
      {/* Section Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          bgcolor: 'grey.50',
          borderBottom: collapsed ? 0 : 1,
          borderColor: 'divider',
          cursor: section.collapsible ? 'pointer' : 'default',
        }}
        onClick={() => section.collapsible && setCollapsed(!collapsed)}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, color: 'primary.main' }}>
            {section.icon && <span style={{ marginRight: 8 }}>{section.icon}</span>}
            {section.title}
          </Typography>
          {section.description && (
            <Typography variant="caption" color="text.secondary" display="block">
              {section.description}
            </Typography>
          )}
        </Box>
        {section.collapsible && (
          <IconButton size="small">
            {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        )}
      </Box>

      {/* Section Content */}
      <Collapse in={!collapsed}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {section.fields
              ?.filter(field => {
                const state = fieldStates.get(field.id);
                return state?.visible !== false;
              })
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((field) => {
                const fieldState = fieldStates.get(field.id) || {};
                const gridSize = getFieldGridSize(field.width);

                return (
                  <Grid item xs={12} md={gridSize} key={field.id}>
                    <DynamicField
                      field={{
                        ...field,
                        required: fieldState.required || field.required,
                      }}
                      value={formData[field.id] ?? field.defaultValue}
                      onChange={(value) => onChange(field.id, value)}
                      error={errors[field.id]}
                      disabled={readOnly || !fieldState.enabled}
                      context={context}
                    />
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default SectionRenderer;