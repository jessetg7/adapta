import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const FieldProperties = ({ field, onChange }) => {
  if (!field) {
    return (
      <Card sx={{ position: 'sticky', top: 80 }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Field Properties
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a field to edit its properties
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const handleChange = (prop, value) => {
    onChange({ [prop]: value });
  };

  const handleAddOption = () => {
    const newOptions = [
      ...(field.options || []),
      { value: `option${(field.options?.length || 0) + 1}`, label: `Option ${(field.options?.length || 0) + 1}` }
    ];
    onChange({ options: newOptions });
  };

  const handleOptionChange = (index, prop, value) => {
    const newOptions = field.options.map((opt, i) =>
      i === index ? { ...opt, [prop]: value } : opt
    );
    onChange({ options: newOptions });
  };

  const handleDeleteOption = (index) => {
    const newOptions = field.options.filter((_, i) => i !== index);
    onChange({ options: newOptions });
  };

  return (
    <Card sx={{ position: 'sticky', top: 80 }}>
      <CardContent>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Field Properties
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Editing: {field.type}
        </Typography>

        <TextField
          fullWidth
          label="Label"
          value={field.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
          size="small"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Placeholder"
          value={field.placeholder || ''}
          onChange={(e) => handleChange('placeholder', e.target.value)}
          size="small"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Help Text"
          value={field.helpText || ''}
          onChange={(e) => handleChange('helpText', e.target.value)}
          size="small"
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={field.required || false}
              onChange={(e) => handleChange('required', e.target.checked)}
            />
          }
          label="Required"
        />

        {/* Options for dropdown/multiselect */}
        {(field.type === 'dropdown' || field.type === 'multiselect') && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Options
            </Typography>
            <List dense>
              {field.options?.map((option, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleDeleteOption(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{ px: 0 }}
                >
                  <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Value"
                      value={option.value}
                      onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                      sx={{ width: '40%' }}
                    />
                    <TextField
                      size="small"
                      placeholder="Label"
                      value={option.label}
                      onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                      sx={{ flexGrow: 1 }}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddOption}
            >
              Add Option
            </Button>
          </>
        )}

        {/* Validation for number fields */}
        {field.type === 'number' && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Validation
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                label="Min"
                type="number"
                value={field.validation?.min || ''}
                onChange={(e) => handleChange('validation', {
                  ...field.validation,
                  min: Number(e.target.value)
                })}
              />
              <TextField
                size="small"
                label="Max"
                type="number"
                value={field.validation?.max || ''}
                onChange={(e) => handleChange('validation', {
                  ...field.validation,
                  max: Number(e.target.value)
                })}
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FieldProperties;