// src/components/FormBuilder/FieldPalette.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Tooltip,
} from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import NotesIcon from '@mui/icons-material/Notes';
import TableChartIcon from '@mui/icons-material/TableChart';
import MedicationIcon from '@mui/icons-material/Medication';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ScienceIcon from '@mui/icons-material/Science';
import TitleIcon from '@mui/icons-material/Title';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

import { FIELD_TYPES, FIELD_CATEGORIES } from '../../core/registry/fieldConfigs';

// Icon mapping
const FIELD_ICONS = {
  text: TextFieldsIcon,
  number: NumbersIcon,
  textarea: NotesIcon,
  email: EmailIcon,
  phone: PhoneIcon,
  date: CalendarMonthIcon,
  time: ScheduleIcon,
  datetime: CalendarMonthIcon,
  dropdown: ArrowDropDownCircleIcon,
  multiselect: CheckBoxIcon,
  checkbox: CheckBoxIcon,
  radio: RadioButtonCheckedIcon,
  toggle: ToggleOnIcon,
  table: TableChartIcon,
  vitals: MonitorHeartIcon,
  medications: MedicationIcon,
  investigations: ScienceIcon,
  sectionHeader: TitleIcon,
  divider: HorizontalRuleIcon,
};

// Draggable Field Item
const DraggableFieldItem = ({ fieldType, fieldConfig, onAddField, sectionId }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${fieldType}`,
    data: { type: 'palette-field', fieldType },
  });

  const IconComponent = FIELD_ICONS[fieldType] || TextFieldsIcon;

  const handleClick = () => {
    if (sectionId) {
      onAddField(sectionId, fieldType);
    }
  };

  return (
    <Tooltip title={`Add ${fieldConfig.label}`} placement="right">
      <Paper
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={handleClick}
        elevation={isDragging ? 4 : 1}
        sx={{
          p: 1.5,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: sectionId ? 'pointer' : 'grab',
          opacity: isDragging ? 0.5 : 1,
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'primary.50',
            transform: 'translateX(4px)',
          },
        }}
      >
        <IconComponent fontSize="small" color="primary" />
        <Typography variant="body2" noWrap>
          {fieldConfig.label}
        </Typography>
      </Paper>
    </Tooltip>
  );
};

const FieldPalette = ({ onAddField, selectedSectionId }) => {
  const [expanded, setExpanded] = useState(Object.values(FIELD_CATEGORIES)[0]);

  // Group fields by category
  const fieldsByCategory = {};
  Object.entries(FIELD_TYPES).forEach(([type, config]) => {
    const category = config.category;
    if (!fieldsByCategory[category]) {
      fieldsByCategory[category] = [];
    }
    fieldsByCategory[category].push({ type, ...config });
  });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Field Types
      </Typography>
      
      {!selectedSectionId && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Select a section to add fields, or drag fields onto a section.
        </Typography>
      )}

      {Object.entries(fieldsByCategory).map(([category, fields]) => (
        <Accordion
          key={category}
          expanded={expanded === category}
          onChange={() => setExpanded(expanded === category ? null : category)}
          disableGutters
          elevation={0}
          sx={{
            '&:before': { display: 'none' },
            bgcolor: 'transparent',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              minHeight: 40,
              '& .MuiAccordionSummary-content': { my: 0 },
              bgcolor: 'grey.100',
              borderRadius: 1,
              mb: 0.5,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {category}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 1 }}>
            {fields.map((field) => (
              <DraggableFieldItem
                key={field.type}
                fieldType={field.type}
                fieldConfig={field}
                onAddField={onAddField}
                sectionId={selectedSectionId}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FieldPalette;