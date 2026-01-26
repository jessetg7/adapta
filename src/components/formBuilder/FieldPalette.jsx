import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton
} from '@mui/material';
import {
  TextFields as TextIcon,
  Numbers as NumberIcon,
  ArrowDropDownCircle as DropdownIcon,
  CheckBox as CheckboxIcon,
  CalendarMonth as DateIcon,
  Notes as TextareaIcon,
  Checklist as MultiselectIcon
} from '@mui/icons-material';

const fieldTypes = [
  { type: 'text', label: 'Text Field', icon: TextIcon },
  { type: 'number', label: 'Number', icon: NumberIcon },
  { type: 'textarea', label: 'Text Area', icon: TextareaIcon },
  { type: 'dropdown', label: 'Dropdown', icon: DropdownIcon },
  { type: 'checkbox', label: 'Checkbox', icon: CheckboxIcon },
  { type: 'date', label: 'Date Picker', icon: DateIcon },
  { type: 'multiselect', label: 'Multi-Select', icon: MultiselectIcon }
];

const FieldPalette = ({ onAddField }) => {
  return (
    <Card sx={{ position: 'sticky', top: 80 }}>
      <CardContent>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Field Types
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Click to add field
        </Typography>
        <List dense>
          {fieldTypes.map((field) => (
            <ListItem key={field.type} disablePadding>
              <ListItemButton
                onClick={() => onAddField(field.type)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: 'primary.lighter'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <field.icon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={field.label}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default FieldPalette;