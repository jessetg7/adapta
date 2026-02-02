// src/components/PrescriptionBuilder/PrescriptionBuilder.jsx
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
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
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
import PrintIcon from '@mui/icons-material/Print';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import MedicationIcon from '@mui/icons-material/Medication';
import ScienceIcon from '@mui/icons-material/Science';
import EventIcon from '@mui/icons-material/Event';
import NotesIcon from '@mui/icons-material/Notes';
import DrawIcon from '@mui/icons-material/Draw';
import { v4 as uuidv4 } from 'uuid';

import useTemplateStore from '../../core/store/useTemplateStore';
import PrescriptionPreview from './PrescriptionPreview';
import { facilityService } from '../../services/facilityService';
import PrescriptionPDF from '../PDFRenderer/PrescriptionPDF';
import { PAGE_SIZES, FONT_FAMILIES } from '../../config/prescriptionConfig';
import { PDFDownloadLink } from '@react-pdf/renderer';

import {
  DEFAULT_PRESCRIPTION_SECTIONS as DEFAULT_SECTIONS,
  SECTION_ICONS
} from '../../core/schemas/prescriptionSections';

// Sortable Section Item
const SortableSectionItem = ({ section, isSelected, onSelect, onToggle }) => {
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

  const IconComponent = SECTION_ICONS[section.icon] || NotesIcon;

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
        borderColor: isSelected ? 'primary.main' : 'divider',
        borderRadius: 1,
        cursor: 'pointer',
        opacity: section.enabled ? 1 : 0.5,
        bgcolor: isSelected ? 'primary.50' : 'background.paper',
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
        <DragIndicatorIcon fontSize="small" />
      </IconButton>

      <IconComponent fontSize="small" color="primary" sx={{ mr: 1 }} />

      <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>
        {section.title}
      </Typography>

      <Tooltip title={section.enabled ? 'Enabled' : 'Disabled'}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {section.enabled ? (
            <VisibilityIcon fontSize="small" color="primary" />
          ) : (
            <VisibilityOffIcon fontSize="small" color="disabled" />
          )}
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

// Main Prescription Builder Component
const PrescriptionBuilder = ({ templateId, onSave, onClose }) => {
  const { prescriptionTemplates, addPrescriptionTemplate, updatePrescriptionTemplate } = useTemplateStore();

  // Initialize template
  const [template, setTemplate] = useState(() => {
    if (templateId && prescriptionTemplates[templateId]) {
      return JSON.parse(JSON.stringify(prescriptionTemplates[templateId]));
    }
    return {
      id: uuidv4(),
      name: 'New Prescription Template',
      sections: DEFAULT_SECTIONS.map(s => ({ ...s })),
      clinicInfo: {
        name: 'Medical Center',
        address: '123 Healthcare Avenue',
        phone: '+1 (555) 123-4567',
        email: 'info@medical.com',
        logo: null,
      },
      doctorInfo: {
        name: '',
        qualification: '',
        specialization: '',
        registrationNo: '',
      },
      pageSize: 'A4',
      orientation: 'portrait',
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      styling: {
        primaryColor: '#1976d2',
        secondaryColor: '#666666',
        fontFamily: 'Arial, sans-serif',
        headerFontSize: '18pt',
        bodyFontSize: '12pt',
        lineHeight: '1.5',
      },
      metadata: {
        author: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  });

  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  const [facilities, setFacilities] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch facilities
  React.useEffect(() => {
    const loadFacilities = async () => {
      setLoading(true);
      try {
        const response = await facilityService.getFacilities();
        setFacilities(response.data);
      } catch (err) {
        console.error('Failed to load facilities:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFacilities();
  }, []);

  // Fetch staff when clinic name changes (matching by name for now to maintain compatibility with existing template structure)
  React.useEffect(() => {
    const loadStaff = async () => {
      const facility = facilities.find(f => f.name === template.clinicInfo.name);
      if (facility?._id) {
        try {
          const response = await facilityService.getFacilityStaff(facility._id);
          setStaff(response.data);
        } catch (err) {
          console.error('Failed to load staff:', err);
        }
      } else {
        setStaff([]);
      }
    };
    loadStaff();
  }, [template.clinicInfo.name, facilities]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Get selected section
  const selectedSection = useMemo(() => {
    return template.sections.find(s => s.id === selectedSectionId);
  }, [template.sections, selectedSectionId]);

  // Update template
  const updateTemplate = useCallback((updates) => {
    setTemplate(prev => ({
      ...prev,
      ...updates,
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  // Update section
  const updateSection = useCallback((sectionId, updates) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }));
  }, []);

  // Toggle section enabled
  const toggleSection = useCallback((sectionId) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTemplate(prev => {
        const oldIndex = prev.sections.findIndex(s => s.id === active.id);
        const newIndex = prev.sections.findIndex(s => s.id === over.id);

        return {
          ...prev,
          sections: arrayMove(prev.sections, oldIndex, newIndex).map((s, i) => ({
            ...s,
            order: i,
          })),
        };
      });
    }
  }, []);

  // Save template
  const handleSave = useCallback(() => {
    if (!template.name?.trim()) {
      setSnackbar({ open: true, message: 'Template name is required', severity: 'error' });
      return;
    }

    if (templateId && prescriptionTemplates[templateId]) {
      updatePrescriptionTemplate(templateId, template);
    } else {
      addPrescriptionTemplate(template);
    }

    setSnackbar({ open: true, message: 'Template saved successfully!', severity: 'success' });
    onSave?.(template);
  }, [template, templateId, prescriptionTemplates, addPrescriptionTemplate, updatePrescriptionTemplate, onSave]);

  // Sample data for preview
  const sampleData = {
    patient: {
      name: 'John Smith',
      age: 35,
      gender: 'Male',
      phone: '+1 (555) 123-4567',
      patientId: 'P-12345',
    },
    visit: {
      date: new Date().toISOString(),
      type: 'Consultation',
    },
    vitals: {
      temperature: 98.6,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 72,
      weight: 70,
      height: 175,
    },
    diagnosis: ['Upper Respiratory Infection', 'Mild Fever'],
    medications: [
      { name: 'Paracetamol', dose: '500mg', route: 'Oral', frequency: 'TDS', duration: '5 days', instructions: 'After food' },
      { name: 'Cetirizine', dose: '10mg', route: 'Oral', frequency: 'OD', duration: '5 days', instructions: 'At bedtime' },
    ],
    investigations: ['CBC', 'Chest X-Ray'],
    advice: ['Rest for 2-3 days', 'Drink plenty of fluids', 'Avoid cold drinks'],
    followUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    // For obstetric history table preview
    prevObstetricHistory: [
      { outcome: 'Full Term', modeConception: 'Spontaneous', weeks: 39, modeDelivery: 'LSCS', babyOutcome: 'Healthy Boy', complications: 'Nil' },
      { outcome: 'Miscarriage', modeConception: 'Spontaneous', weeks: 8, modeDelivery: 'D&C', babyOutcome: 'N/A', complications: 'Excessive bleeding' }
    ]
  };

  // Helper to prepare data for PDF
  const pdfData = useMemo(() => ({
    ...sampleData,
    clinic: template.clinicInfo,
    doctor: template.doctorInfo,
  }), [sampleData, template.clinicInfo, template.doctorInfo]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.100' }}>
      {/* Top Toolbar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <MedicationIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Prescription Builder
          </Typography>

          <TextField
            size="small"
            value={template.name}
            onChange={(e) => updateTemplate({ name: e.target.value })}
            placeholder="Template Name"
            sx={{ mr: 2, width: 250 }}
          />

          <Tooltip title="Settings">
            <IconButton onClick={() => setShowSettings(true)}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Preview">
            <IconButton onClick={() => setShowPreview(true)}>
              <PreviewIcon />
            </IconButton>
          </Tooltip>

          <PDFDownloadLink
            document={<PrescriptionPDF data={pdfData} template={template} />}
            fileName={`${template.name.replace(/\s+/g, '_')}.pdf`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                disabled={loading}
                sx={{ ml: 2 }}
              >
                {loading ? 'Preparing...' : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
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
        {/* Left Panel - Section List */}
        <Paper sx={{ width: 300, flexShrink: 0, borderRadius: 0, overflow: 'auto', p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Prescription Sections
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Drag to reorder. Click eye icon to show/hide sections.
          </Typography>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={template.sections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {template.sections
                .sort((a, b) => a.order - b.order)
                .map(section => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    isSelected={selectedSectionId === section.id}
                    onSelect={() => setSelectedSectionId(section.id)}
                    onToggle={() => toggleSection(section.id)}
                  />
                ))}
            </SortableContext>
          </DndContext>
        </Paper>

        {/* Center - Live Preview */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, bgcolor: 'grey.200' }}>
          <Paper
            sx={{
              maxWidth: 800,
              mx: 'auto',
              minHeight: '100%',
              p: 4,
              boxShadow: 3,
            }}
          >
            <PrescriptionPreview
              template={template}
              data={sampleData}
              clinicInfo={template.clinicInfo}
              doctor={template.doctorInfo}
            />
          </Paper>
        </Box>

        {/* Right Panel - Section Properties */}
        <Paper sx={{ width: 320, flexShrink: 0, borderRadius: 0, overflow: 'auto', p: 2 }}>
          {selectedSection ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Section Properties
              </Typography>

              <TextField
                fullWidth
                label="Section Title"
                value={selectedSection.title}
                onChange={(e) => updateSection(selectedSection.id, { title: e.target.value })}
                sx={{ mb: 2 }}
                size="small"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={selectedSection.enabled}
                    onChange={() => toggleSection(selectedSection.id)}
                  />
                }
                label="Enabled"
              />

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Section Type
              </Typography>
              <Chip
                label={selectedSection.type}
                color="primary"
                variant="outlined"
                size="small"
              />

              {selectedSection.type === 'header' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'primary.main' }}>
                    🏥 Facility Information
                  </Typography>
                  <Autocomplete
                    options={facilities}
                    getOptionLabel={(option) => option.name || ''}
                    value={facilities.find(h => h.name === template.clinicInfo.name) || null}
                    loading={loading}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        updateTemplate({
                          clinicInfo: {
                            name: newValue.name,
                            address: `${newValue.address?.street || ''}, ${newValue.address?.city || ''}`,
                            phone: newValue.contact?.phone || '',
                            email: newValue.contact?.email || '',
                            logo: template.clinicInfo.logo,
                          }
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Hospital" size="small" fullWidth sx={{ mb: 1 }} />
                    )}
                    freeSolo
                    onInputChange={(event, newInputValue) => {
                      if (!facilities.some(h => h.name === newInputValue)) {
                        updateTemplate({
                          clinicInfo: { ...template.clinicInfo, name: newInputValue }
                        });
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={template.clinicInfo.address}
                    onChange={(e) => updateTemplate({
                      clinicInfo: { ...template.clinicInfo, address: e.target.value }
                    })}
                    sx={{ mb: 1 }}
                    size="small"
                  />
                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={template.clinicInfo.phone}
                        onChange={(e) => updateTemplate({
                          clinicInfo: { ...template.clinicInfo, phone: e.target.value }
                        })}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={template.clinicInfo.email}
                        onChange={(e) => updateTemplate({
                          clinicInfo: { ...template.clinicInfo, email: e.target.value }
                        })}
                        size="small"
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'primary.main' }}>
                    👨‍⚕️ Doctor Information
                  </Typography>

                  <Autocomplete
                    options={staff}
                    getOptionLabel={(option) => option.username || option.name || ''}
                    value={staff.find(d => d.username === template.doctorInfo.name || d.name === template.doctorInfo.name) || null}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        updateTemplate({
                          doctorInfo: {
                            name: newValue.username || newValue.name,
                            qualification: newValue.profile?.qualification || '',
                            specialization: newValue.profile?.specialization || '',
                            registrationNo: newValue.profile?.registrationNo || '',
                          }
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Doctor" size="small" fullWidth sx={{ mb: 1 }} />
                    )}
                    freeSolo
                    onInputChange={(event, newInputValue) => {
                      if (!staff.some(d => (d.username || d.name) === newInputValue)) {
                        updateTemplate({
                          doctorInfo: { ...template.doctorInfo, name: newInputValue }
                        });
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Qualification"
                    value={template.doctorInfo.qualification}
                    onChange={(e) => updateTemplate({
                      doctorInfo: { ...template.doctorInfo, qualification: e.target.value }
                    })}
                    sx={{ mb: 1 }}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Specialization"
                    value={template.doctorInfo.specialization}
                    onChange={(e) => updateTemplate({
                      doctorInfo: { ...template.doctorInfo, specialization: e.target.value }
                    })}
                    sx={{ mb: 1 }}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Registration No."
                    value={template.doctorInfo.registrationNo}
                    onChange={(e) => updateTemplate({
                      doctorInfo: { ...template.doctorInfo, registrationNo: e.target.value }
                    })}
                    size="small"
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                Select a section to edit its properties
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Prescription Settings</DialogTitle>
        <DialogContent dividers>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 2 }}>
            <Tab label="Page" />
            <Tab label="Styling" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Page Size</InputLabel>
                  <Select
                    value={template.pageSize}
                    label="Page Size"
                    onChange={(e) => updateTemplate({ pageSize: e.target.value })}
                  >
                    {PAGE_SIZES.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Orientation</InputLabel>
                  <Select
                    value={template.orientation}
                    label="Orientation"
                    onChange={(e) => updateTemplate({ orientation: e.target.value })}
                  >
                    <MenuItem value="portrait">Portrait</MenuItem>
                    <MenuItem value="landscape">Landscape</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Top Margin (mm)"
                  value={template.margins.top}
                  onChange={(e) => updateTemplate({
                    margins: { ...template.margins, top: Number(e.target.value) }
                  })}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Bottom Margin (mm)"
                  value={template.margins.bottom}
                  onChange={(e) => updateTemplate({
                    margins: { ...template.margins, bottom: Number(e.target.value) }
                  })}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Left Margin (mm)"
                  value={template.margins.left}
                  onChange={(e) => updateTemplate({
                    margins: { ...template.margins, left: Number(e.target.value) }
                  })}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Right Margin (mm)"
                  value={template.margins.right}
                  onChange={(e) => updateTemplate({
                    margins: { ...template.margins, right: Number(e.target.value) }
                  })}
                  size="small"
                />
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Primary Color"
                  type="color"
                  value={template.styling.primaryColor}
                  onChange={(e) => updateTemplate({
                    styling: { ...template.styling, primaryColor: e.target.value }
                  })}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Secondary Color"
                  type="color"
                  value={template.styling.secondaryColor}
                  onChange={(e) => updateTemplate({
                    styling: { ...template.styling, secondaryColor: e.target.value }
                  })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Font Family</InputLabel>
                  <Select
                    value={template.styling.fontFamily}
                    label="Font Family"
                    onChange={(e) => updateTemplate({
                      styling: { ...template.styling, fontFamily: e.target.value }
                    })}
                  >
                    {FONT_FAMILIES.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Header Font Size</InputLabel>
                  <Select
                    value={template.styling.headerFontSize}
                    label="Header Font Size"
                    onChange={(e) => updateTemplate({
                      styling: { ...template.styling, headerFontSize: e.target.value }
                    })}
                  >
                    <MenuItem value="14pt">14pt</MenuItem>
                    <MenuItem value="16pt">16pt</MenuItem>
                    <MenuItem value="18pt">18pt</MenuItem>
                    <MenuItem value="20pt">20pt</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Body Font Size</InputLabel>
                  <Select
                    value={template.styling.bodyFontSize}
                    label="Body Font Size"
                    onChange={(e) => updateTemplate({
                      styling: { ...template.styling, bodyFontSize: e.target.value }
                    })}
                  >
                    <MenuItem value="10pt">10pt</MenuItem>
                    <MenuItem value="11pt">11pt</MenuItem>
                    <MenuItem value="12pt">12pt</MenuItem>
                    <MenuItem value="14pt">14pt</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Full Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Prescription Preview
          <IconButton
            onClick={() => setShowPreview(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: 'grey.100', p: 3 }}>
          <Paper sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
            <PrescriptionPreview
              template={template}
              data={sampleData}
              clinicInfo={template.clinicInfo}
              doctor={template.doctorInfo}
            />
          </Paper>
        </DialogContent>
        <DialogActions>
          <PDFDownloadLink
            document={<PrescriptionPDF data={pdfData} template={template} />}
            fileName={`${template.name.replace(/\s+/g, '_')}.pdf`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Button
                startIcon={<PrintIcon />}
                variant="contained"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PrescriptionBuilder;