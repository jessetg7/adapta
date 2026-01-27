// src/components/FormBuilder/FormCanvas.jsx
import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Collapse,
  Chip,
  Alert,
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import { v4 as uuidv4 } from 'uuid';

import { FIELD_TYPES } from '../../core/registry/fieldConfigs';
import SectionEditor from './SectionEditor';
import FieldEditor from './FieldEditor';

/**
 * Sortable Field Item Component
 */
const SortableFieldItem = ({
  field,
  sectionId,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
    data: { type: 'field', field, sectionId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const fieldConfig = FIELD_TYPES[field.type];

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isSelected ? 3 : 1}
      sx={{
        p: 1.5,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        border: isSelected ? '2px solid' : '1px solid',
        borderColor: isSelected ? 'primary.main' : 'transparent',
        borderRadius: 1,
        cursor: 'pointer',
        bgcolor: isSelected ? 'primary.50' : 'background.paper',
        '&:hover': {
          bgcolor: isSelected ? 'primary.50' : 'action.hover',
          '& .field-actions': {
            opacity: 1,
          },
        },
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Drag Handle */}
      <IconButton
        size="small"
        {...attributes}
        {...listeners}
        sx={{ cursor: 'grab', mr: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <DragIndicatorIcon fontSize="small" />
      </IconButton>

      {/* Field Info */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight={500} noWrap>
            {field.label || 'Untitled Field'}
          </Typography>
          {field.required && (
            <Chip label="Required" size="small" color="error" variant="outlined" sx={{ height: 20 }} />
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" noWrap>
          {fieldConfig?.label || field.type}
          {field.name && ` • ${field.name}`}
        </Typography>
      </Box>

      {/* Width Indicator */}
      <Chip
        label={field.width || 'full'}
        size="small"
        variant="outlined"
        sx={{ mr: 1, height: 20, fontSize: '0.7rem' }}
      />

      {/* Actions */}
      <Box
        className="field-actions"
        sx={{
          display: 'flex',
          opacity: isSelected ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        <Tooltip title="Duplicate">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

/**
 * Droppable Field Zone Component
 */
const DroppableFieldZone = ({ sectionId, children, isEmpty }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${sectionId}`,
    data: { type: 'section-drop', sectionId },
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minHeight: isEmpty ? 100 : 'auto',
        p: 1,
        borderRadius: 1,
        border: isOver ? '2px dashed' : '2px dashed transparent',
        borderColor: isOver ? 'primary.main' : 'transparent',
        bgcolor: isOver ? 'primary.50' : 'transparent',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
      {isEmpty && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            color: 'text.secondary',
          }}
        >
          <AddIcon sx={{ fontSize: 32, opacity: 0.5, mb: 1 }} />
          <Typography variant="body2">
            Drag fields here or click "Add Field"
          </Typography>
        </Box>
      )}
    </Box>
  );
};

/**
 * Sortable Section Component
 */
const SortableSectionItem = ({
  section,
  isSelected,
  selectedFieldId,
  collapsedSections,
  onSelectSection,
  onSelectField,
  onDeleteSection,
  onToggleCollapse,
  onAddField,
  onDeleteField,
  onDuplicateField,
  onReorderFields,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: { type: 'section', section },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isCollapsed = collapsedSections[section.id];
  const fieldCount = section.fields?.length || 0;

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        border: isSelected && !selectedFieldId ? '2px solid' : '1px solid',
        borderColor: isSelected && !selectedFieldId ? 'primary.main' : 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          bgcolor: isSelected && !selectedFieldId ? 'primary.50' : 'grey.50',
          borderBottom: isCollapsed ? 0 : 1,
          borderColor: 'divider',
          cursor: 'pointer',
        }}
        onClick={() => onSelectSection(section.id)}
      >
        {/* Drag Handle */}
        <IconButton
          size="small"
          {...attributes}
          {...listeners}
          sx={{ cursor: 'grab', mr: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <DragIndicatorIcon />
        </IconButton>

        {/* Section Title */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {section.title || 'Untitled Section'}
          </Typography>
          {section.description && (
            <Typography variant="caption" color="text.secondary">
              {section.description}
            </Typography>
          )}
        </Box>

        {/* Field Count */}
        <Chip
          label={`${fieldCount} field${fieldCount !== 1 ? 's' : ''}`}
          size="small"
          sx={{ mr: 1 }}
        />

        {/* Collapse Toggle */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse(section.id);
          }}
        >
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>

        {/* Settings */}
        <Tooltip title="Section Settings">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onSelectSection(section.id);
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Delete */}
        <Tooltip title="Delete Section">
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSection(section.id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Section Content */}
      <Collapse in={!isCollapsed}>
        <Box sx={{ p: 2, bgcolor: 'background.default' }}>
          <DroppableFieldZone
            sectionId={section.id}
            isEmpty={fieldCount === 0}
          >
            <SortableContext
              items={(section.fields || []).map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {(section.fields || [])
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((field) => (
                  <SortableFieldItem
                    key={field.id}
                    field={field}
                    sectionId={section.id}
                    isSelected={selectedFieldId === field.id}
                    onSelect={() => onSelectField(section.id, field.id)}
                    onDelete={() => onDeleteField(section.id, field.id)}
                    onDuplicate={() => onDuplicateField(section.id, field.id)}
                  />
                ))}
            </SortableContext>
          </DroppableFieldZone>

          {/* Add Field Button */}
          <Button
            startIcon={<AddIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onAddField(section.id);
            }}
            size="small"
            variant="outlined"
            sx={{ mt: 1, borderStyle: 'dashed' }}
            fullWidth
          >
            Add Field
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

/**
 * Main Form Canvas Component
 */
const FormCanvas = ({
  template,
  selectedSectionId,
  selectedFieldId,
  collapsedSections,
  onSelectSection,
  onSelectField,
  onAddSection,
  onDeleteSection,
  onToggleCollapse,
  onAddField,
  onDeleteField,
  onDuplicateField,
  onReorderSections,
  onReorderFields,
  onMoveField,
  onDropNewField,
}) => {
  const [draggedItem, setDraggedItem] = useState(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Find section containing a field
  const findSectionByFieldId = useCallback(
    (fieldId) => {
      for (const section of template.sections || []) {
        if (section.fields?.some((f) => f.id === fieldId)) {
          return section.id;
        }
      }
      return null;
    },
    [template.sections]
  );

  // Handle drag start
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setDraggedItem(active.data.current);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setDraggedItem(null);

      if (!over) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      // Handle dropping new field from palette
      if (activeData?.type === 'palette-field' && overData?.type === 'section-drop') {
        onDropNewField?.(overData.sectionId, activeData.fieldType);
        return;
      }

      // Handle reordering sections
      if (activeData?.type === 'section' && overData?.type === 'section') {
        if (active.id !== over.id) {
          onReorderSections?.(active.id, over.id);
        }
        return;
      }

      // Handle reordering fields within same section
      if (activeData?.type === 'field' && overData?.type === 'field') {
        const activeSectionId = activeData.sectionId;
        const overSectionId = overData.sectionId;

        if (activeSectionId === overSectionId) {
          // Same section reorder
          if (active.id !== over.id) {
            onReorderFields?.(activeSectionId, active.id, over.id);
          }
        } else {
          // Move to different section
          onMoveField?.(activeSectionId, overSectionId, active.id, over.id);
        }
        return;
      }

      // Handle dropping field into section drop zone
      if (activeData?.type === 'field' && overData?.type === 'section-drop') {
        const fromSectionId = activeData.sectionId;
        const toSectionId = overData.sectionId;

        if (fromSectionId !== toSectionId) {
          onMoveField?.(fromSectionId, toSectionId, active.id, null);
        }
      }
    },
    [onReorderSections, onReorderFields, onMoveField, onDropNewField]
  );

  const sections = template?.sections || [];

  return (
    <Box sx={{ p: 3, minHeight: '100%' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((section) => (
              <SortableSectionItem
                key={section.id}
                section={section}
                isSelected={selectedSectionId === section.id}
                selectedFieldId={selectedFieldId}
                collapsedSections={collapsedSections}
                onSelectSection={onSelectSection}
                onSelectField={onSelectField}
                onDeleteSection={onDeleteSection}
                onToggleCollapse={onToggleCollapse}
                onAddField={onAddField}
                onDeleteField={onDeleteField}
                onDuplicateField={onDuplicateField}
                onReorderFields={onReorderFields}
              />
            ))}
        </SortableContext>

        {/* Drag Overlay */}
        <DragOverlay>
          {draggedItem ? (
            <Paper
              elevation={4}
              sx={{
                p: 2,
                bgcolor: 'primary.50',
                border: '2px solid',
                borderColor: 'primary.main',
                borderRadius: 1,
                opacity: 0.9,
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                {draggedItem.type === 'section'
                  ? draggedItem.section?.title || 'Section'
                  : draggedItem.type === 'field'
                  ? draggedItem.field?.label || 'Field'
                  : 'Dragging...'}
              </Typography>
            </Paper>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add Section Button */}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={onAddSection}
        fullWidth
        sx={{
          mt: 2,
          py: 2,
          borderStyle: 'dashed',
          borderWidth: 2,
        }}
      >
        Add Section
      </Button>

      {/* Empty State */}
      {sections.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <Typography variant="h6" gutterBottom>
            Start Building Your Form
          </Typography>
          <Typography variant="body2">
            Click "Add Section" to create your first section, then drag fields
            from the palette.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FormCanvas;