// src/components/PrescriptionBuilder/PrescriptionCanvas.jsx
import React from 'react';
import { Box, Paper, Typography, IconButton, Tooltip, Chip } from '@mui/material';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SettingsIcon from '@mui/icons-material/Settings';

// Sortable Item Component
const SortableSection = ({ section, isSelected, onSelect, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isSelected ? 3 : 1}
      sx={{
        p: 2,
        mb: 1.5,
        display: 'flex',
        alignItems: 'center',
        border: isSelected ? '2px solid' : '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        bgcolor: isSelected ? 'primary.50' : 'background.paper',
        opacity: section.enabled ? 1 : 0.6,
        transition: 'all 0.2s',
      }}
      onClick={onSelect}
    >
      <IconButton
        size="small"
        {...attributes}
        {...listeners}
        sx={{ cursor: 'grab', mr: 1 }}
      >
        <DragIndicatorIcon fontSize="small" />
      </IconButton>

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {section.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {section.type}
        </Typography>
      </Box>

      {!section.enabled && (
        <Chip label="Hidden" size="small" sx={{ mr: 1, opacity: 0.7 }} />
      )}

      <Tooltip title="Configure Section">
        <IconButton size="small" onClick={onSelect} sx={{ mr: 0.5 }}>
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title={section.enabled ? "Hide Section" : "Show Section"}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(section.id);
          }}
          color={section.enabled ? 'primary' : 'default'}
        >
          {section.enabled ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

// Main Canvas
const PrescriptionCanvas = ({ sections, selectedSectionId, onSelectSection, onToggleSection }) => {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Prescription Layout
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Drag sections to reorder. Click to configure.
      </Typography>

      <SortableContext
        items={sortedSections.map(s => s.id)}
        strategy={verticalListSortingStrategy}
      >
        {sortedSections.map((section) => (
          <SortableSection
            key={section.id}
            section={section}
            isSelected={selectedSectionId === section.id}
            onSelect={() => onSelectSection(section.id)}
            onToggle={onToggleSection}
          />
        ))}
      </SortableContext>
    </Box>
  );
};

export default PrescriptionCanvas;