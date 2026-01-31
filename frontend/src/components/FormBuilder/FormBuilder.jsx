// src/components/FormBuilder/FormBuilder.jsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Drawer,
  AppBar,
  Toolbar,
  TextField,
  Divider,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
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
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Preview';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { v4 as uuidv4 } from 'uuid';

import useTemplateStore from '../../core/store/useTemplateStore';
import { FIELD_TYPES, FIELD_CATEGORIES, TEMPLATE_TYPES, TEMPLATE_CATEGORIES, GENDER_OPTIONS, VISIT_TYPES } from '../../core/registry/fieldConfigs';
import FieldPalette from './FieldPalette';
import PropertyPanel from './PropertyPanel';
import FormRenderer from '../FormRenderer/FormRenderer';

// ============================================
// SORTABLE FIELD COMPONENT
// ============================================
const SortableField = ({
  field,
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
  } = useSortable({ id: field.id, data: { type: 'field', field } });

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
        },
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <IconButton
        size="small"
        {...attributes}
        {...listeners}
        sx={{ cursor: 'grab', mr: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <DragIndicatorIcon fontSize="small" />
      </IconButton>

      <Box sx={{ mr: 1, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
        <TextFieldsIcon fontSize="small" />
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={500} noWrap>
          {field.label || 'Untitled Field'}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {fieldConfig?.label || field.type}
          {field.required && ' • Required'}
        </Typography>
      </Box>

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
    </Paper>
  );
};

// ============================================
// SORTABLE SECTION COMPONENT
// ============================================
const SortableSection = ({
  section,
  isSelected,
  onSelect,
  onDelete,
  onToggleCollapse,
  collapsed,
  children,
  onAddField,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, data: { type: 'section' } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        border: isSelected ? '2px solid' : '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
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
          bgcolor: isSelected ? 'primary.50' : 'grey.50',
          cursor: 'pointer',
          borderBottom: collapsed ? 0 : 1,
          borderColor: 'divider',
        }}
        onClick={onSelect}
      >
        <IconButton
          size="small"
          {...attributes}
          {...listeners}
          sx={{ cursor: 'grab', mr: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <DragIndicatorIcon />
        </IconButton>

        <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {section.title || 'Untitled Section'}
        </Typography>

        <Chip
          label={`${section.fields?.length || 0} fields`}
          size="small"
          sx={{ mr: 1 }}
        />

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse();
          }}
        >
          {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>

        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Section Content */}
      {!collapsed && (
        <Box sx={{ p: 2, minHeight: 80, bgcolor: 'background.default' }}>
          {children}

          {/* Add Field Button */}
          <Button
            startIcon={<AddIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onAddField();
            }}
            size="small"
            variant="outlined"
            sx={{ mt: 1, borderStyle: 'dashed' }}
            fullWidth
          >
            Add Field
          </Button>
        </Box>
      )}
    </Paper>
  );
};

// ============================================
// DROPPABLE FIELD ZONE
// ============================================
const DroppableFieldZone = ({ sectionId, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `section-${sectionId}`,
    data: { type: 'section-drop', sectionId },
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minHeight: 60,
        p: 1,
        borderRadius: 1,
        border: isOver ? '2px dashed' : '2px dashed transparent',
        borderColor: isOver ? 'primary.main' : 'transparent',
        bgcolor: isOver ? 'primary.50' : 'transparent',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </Box>
  );
};

// ============================================
// MAIN FORM BUILDER COMPONENT
// ============================================
const FormBuilder = ({ templateId, onSave, onClose }) => {
  // Store hooks
  const {
    templates,
    addTemplate,
    updateTemplate,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    addField,
    updateField,
    deleteField,
    reorderFields,
    moveField,
  } = useTemplateStore();

  // Local state
  const [template, setTemplate] = useState(() => {
    if (templateId && templates[templateId]) {
      return JSON.parse(JSON.stringify(templates[templateId]));
    }
    return {
      id: uuidv4(),
      name: 'New Form Template',
      type: 'consultation',
      category: 'general',
      genderSpecific: 'all',
      visitType: 'all',
      sections: [],
      version: 1,
      metadata: {
        author: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
    };
  });

  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [splitPreview, setSplitPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get selected items
  const selectedSection = useMemo(() => {
    return template.sections?.find((s) => s.id === selectedSectionId);
  }, [template.sections, selectedSectionId]);

  const selectedField = useMemo(() => {
    if (!selectedSectionId || !selectedFieldId) return null;
    const section = template.sections?.find((s) => s.id === selectedSectionId);
    return section?.fields?.find((f) => f.id === selectedFieldId);
  }, [template.sections, selectedSectionId, selectedFieldId]);

  // ============================================
  // TEMPLATE OPERATIONS
  // ============================================
  const updateTemplateLocal = useCallback((updates) => {
    setTemplate((prev) => ({
      ...prev,
      ...updates,
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  // ============================================
  // SECTION OPERATIONS
  // ============================================
  const handleAddSection = useCallback(() => {
    const newSection = {
      id: uuidv4(),
      title: `Section ${(template.sections?.length || 0) + 1}`,
      description: '',
      collapsible: true,
      defaultCollapsed: false,
      fields: [],
      order: template.sections?.length || 0,
      columns: 2,
    };

    setTemplate((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));

    setSelectedSectionId(newSection.id);
    setSelectedFieldId(null);
    setActiveTab(0);
  }, [template.sections]);

  const handleUpdateSection = useCallback((sectionId, updates) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }));
  }, []);

  const handleDeleteSection = useCallback((sectionId) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));

    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
      setSelectedFieldId(null);
    }
  }, [selectedSectionId]);

  const toggleSectionCollapse = useCallback((sectionId) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  // ============================================
  // FIELD OPERATIONS
  // ============================================
  const handleAddField = useCallback((sectionId, fieldType = 'text') => {
    const fieldConfig = FIELD_TYPES[fieldType]?.defaultConfig || {};
    const section = template.sections.find((s) => s.id === sectionId);

    const newField = {
      ...fieldConfig,
      id: uuidv4(),
      name: `field_${Date.now()}`,
      label: fieldConfig.label || 'New Field',
      order: section?.fields?.length || 0,
    };

    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, fields: [...(s.fields || []), newField] }
          : s
      ),
    }));

    setSelectedSectionId(sectionId);
    setSelectedFieldId(newField.id);
    setActiveTab(0);
  }, [template.sections]);

  const handleUpdateField = useCallback((sectionId, fieldId, updates) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
            ...s,
            fields: s.fields.map((f) =>
              f.id === fieldId ? { ...f, ...updates } : f
            ),
          }
          : s
      ),
    }));
  }, []);

  const handleDeleteField = useCallback((sectionId, fieldId) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) }
          : s
      ),
    }));

    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  }, [selectedFieldId]);

  const handleDuplicateField = useCallback((sectionId, fieldId) => {
    const section = template.sections.find((s) => s.id === sectionId);
    const field = section?.fields?.find((f) => f.id === fieldId);

    if (!field) return;

    const newField = {
      ...JSON.parse(JSON.stringify(field)),
      id: uuidv4(),
      name: `${field.name}_copy`,
      label: `${field.label} (Copy)`,
    };

    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, fields: [...s.fields, newField] }
          : s
      ),
    }));

    setSelectedFieldId(newField.id);
  }, [template.sections]);

  // ============================================
  // DRAG & DROP HANDLERS
  // ============================================
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setDraggedItem(active);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setDraggedItem(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle dropping a new field from palette
    if (activeData?.type === 'palette-field' && overData?.type === 'section-drop') {
      handleAddField(overData.sectionId, activeData.fieldType);
      return;
    }

    // Handle reordering sections
    if (activeData?.type === 'section' && overData?.type === 'section') {
      if (active.id !== over.id) {
        setTemplate((prev) => {
          const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
          const newIndex = prev.sections.findIndex((s) => s.id === over.id);
          return {
            ...prev,
            sections: arrayMove(prev.sections, oldIndex, newIndex),
          };
        });
      }
      return;
    }

    // Handle reordering fields within same section
    if (activeData?.type === 'field' && overData?.type === 'field') {
      const activeSectionId = findSectionIdByFieldId(active.id);
      const overSectionId = findSectionIdByFieldId(over.id);

      if (activeSectionId === overSectionId && active.id !== over.id) {
        setTemplate((prev) => ({
          ...prev,
          sections: prev.sections.map((s) => {
            if (s.id !== activeSectionId) return s;

            const oldIndex = s.fields.findIndex((f) => f.id === active.id);
            const newIndex = s.fields.findIndex((f) => f.id === over.id);

            return {
              ...s,
              fields: arrayMove(s.fields, oldIndex, newIndex),
            };
          }),
        }));
      }
    }
  }, [handleAddField]);

  const findSectionIdByFieldId = useCallback((fieldId) => {
    for (const section of template.sections) {
      if (section.fields?.some((f) => f.id === fieldId)) {
        return section.id;
      }
    }
    return null;
  }, [template.sections]);

  // ============================================
  // SAVE TEMPLATE
  // ============================================
  const handleSaveTemplate = useCallback(() => {
    // Validate template
    if (!template.name?.trim()) {
      setSnackbar({
        open: true,
        message: 'Template name is required',
        severity: 'error',
      });
      return;
    }

    if (!template.sections?.length) {
      setSnackbar({
        open: true,
        message: 'Template must have at least one section',
        severity: 'error',
      });
      return;
    }

    // Save to store
    if (templateId && templates[templateId]) {
      updateTemplate(templateId, template);
    } else {
      addTemplate(template);
    }

    setSnackbar({
      open: true,
      message: 'Template saved successfully!',
      severity: 'success',
    });

    onSave?.(template);
  }, [template, templateId, templates, updateTemplate, addTemplate, onSave]);

  // ============================================
  // RENDER
  // ============================================
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.100' }}>
      {/* Top Toolbar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Form Builder
          </Typography>

          <TextField
            size="small"
            value={template.name}
            onChange={(e) => updateTemplateLocal({ name: e.target.value })}
            placeholder="Template Name"
            sx={{ mr: 2, width: 250 }}
          />

          <Tooltip title="Template Settings">
            <IconButton onClick={() => setShowSettings(true)}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Toggle Split-Screen Preview">
            <IconButton
              color={splitPreview ? "primary" : "default"}
              onClick={() => setSplitPreview(!splitPreview)}
            >
              <Box sx={{ display: 'flex', position: 'relative' }}>
                <PreviewIcon fontSize="small" />
                <Box sx={{ position: 'absolute', right: -4, bottom: -4, fontSize: 10, fontWeight: 'bold' }}>2</Box>
              </Box>
            </IconButton>
          </Tooltip>

          <Tooltip title="Full Preview">
            <IconButton onClick={() => setShowPreview(true)}>
              <PreviewIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveTemplate}
            sx={{ ml: 2 }}
          >
            Save
          </Button>

          {onClose && (
            <IconButton onClick={onClose} sx={{ ml: 1 }}>
              <CloseIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Left Panel - Field Palette */}
        <Paper
          sx={{
            width: 280,
            flexShrink: 0,
            borderRadius: 0,
            overflow: 'auto',
          }}
        >
          <FieldPalette onAddField={handleAddField} selectedSectionId={selectedSectionId} />
        </Paper>

        {/* Center - Form Canvas */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 3,
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Sections */}
            <SortableContext
              items={template.sections?.map((s) => s.id) || []}
              strategy={verticalListSortingStrategy}
            >
              {template.sections?.map((section) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  isSelected={selectedSectionId === section.id}
                  onSelect={() => {
                    setSelectedSectionId(section.id);
                    setSelectedFieldId(null);
                    setActiveTab(0);
                  }}
                  onDelete={() => handleDeleteSection(section.id)}
                  onToggleCollapse={() => toggleSectionCollapse(section.id)}
                  collapsed={collapsedSections[section.id]}
                  onAddField={() => handleAddField(section.id)}
                >
                  <DroppableFieldZone sectionId={section.id}>
                    <SortableContext
                      items={section.fields?.map((f) => f.id) || []}
                      strategy={verticalListSortingStrategy}
                    >
                      {section.fields?.map((field) => (
                        <SortableField
                          key={field.id}
                          field={field}
                          isSelected={selectedFieldId === field.id}
                          onSelect={() => {
                            setSelectedSectionId(section.id);
                            setSelectedFieldId(field.id);
                            setActiveTab(0);
                          }}
                          onDelete={() => handleDeleteField(section.id, field.id)}
                          onDuplicate={() => handleDuplicateField(section.id, field.id)}
                        />
                      ))}
                    </SortableContext>
                  </DroppableFieldZone>
                </SortableSection>
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
                  <Typography>Dragging...</Typography>
                </Paper>
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Add Section Button */}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddSection}
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
          {(!template.sections || template.sections.length === 0) && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                color: 'text.secondary',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Start Building Your Form
              </Typography>
              <Typography variant="body2">
                Click "Add Section" to create your first section, then drag fields from the left panel.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Right Panel - Properties & Preview */}
        <Paper
          sx={{
            borderLeft: 1,
            borderColor: 'divider',
            transition: 'width 0.3s ease',
            width: splitPreview ? '45%' : 360,
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab icon={<SettingsIcon fontSize="small" />} iconPosition="start" label="Properties" />
              {!splitPreview && <Tab icon={<PreviewIcon fontSize="small" />} iconPosition="start" label="Live Preview" />}
            </Tabs>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: 'background.paper' }}>
            {activeTab === 0 ? (
              <PropertyPanel
                selectedSection={selectedSection}
                selectedField={selectedField}
                onUpdateSection={(updates) =>
                  handleUpdateSection(selectedSectionId, updates)
                }
                onUpdateField={(updates) =>
                  handleUpdateField(selectedSectionId, selectedFieldId, updates)
                }
              />
            ) : (
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'divider',
                    minHeight: '100%'
                  }}
                >
                  <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2, textAlign: 'center' }}>
                    Mobile Preview
                  </Typography>
                  <FormRenderer
                    template={template}
                    readOnly={false}
                    showSubmit={true}
                    showSave={false}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Form Preview
          <IconButton
            onClick={() => setShowPreview(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <FormRenderer
            template={template}
            readOnly={false}
            showSubmit={false}
            showSave={false}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Template Settings</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Template Name"
                value={template.name}
                onChange={(e) => updateTemplateLocal({ name: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={template.type}
                  label="Type"
                  onChange={(e) => updateTemplateLocal({ type: e.target.value })}
                >
                  {Object.entries(TEMPLATE_TYPES).map(([key, { label }]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={template.category}
                  label="Category"
                  onChange={(e) => updateTemplateLocal({ category: e.target.value })}
                >
                  {Object.entries(TEMPLATE_CATEGORIES).map(([key, { label }]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Gender Specific</InputLabel>
                <Select
                  value={template.genderSpecific}
                  label="Gender Specific"
                  onChange={(e) => updateTemplateLocal({ genderSpecific: e.target.value })}
                >
                  {Object.entries(GENDER_OPTIONS).map(([key, { label }]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Visit Type</InputLabel>
                <Select
                  value={template.visitType}
                  label="Visit Type"
                  onChange={(e) => updateTemplateLocal({ visitType: e.target.value })}
                >
                  {Object.entries(VISIT_TYPES).map(([key, { label }]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={template.metadata?.description || ''}
                onChange={(e) =>
                  updateTemplateLocal({
                    metadata: { ...template.metadata, description: e.target.value },
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box >
  );
};

export default FormBuilder;