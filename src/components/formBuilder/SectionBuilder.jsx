import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Delete as DeleteIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';

const SectionBuilder = ({ section, onChange, onDelete }) => {
  const handleChange = (field, value) => {
    onChange({ ...section, [field]: value });
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
          <DragIcon color="action" sx={{ mt: 1, cursor: 'grab' }} />
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              label="Section Title"
              value={section.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={section.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              size="small"
              multiline
              rows={2}
            />
          </Box>
          <IconButton onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={section.collapsible || false}
                onChange={(e) => handleChange('collapsible', e.target.checked)}
                size="small"
              />
            }
            label="Collapsible"
          />
          <FormControlLabel
            control={
              <Switch
                checked={section.defaultExpanded || false}
                onChange={(e) => handleChange('defaultExpanded', e.target.checked)}
                size="small"
              />
            }
            label="Expanded by Default"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SectionBuilder;