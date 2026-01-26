import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  Collapse,
  Badge,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  MedicalServices as MedIcon,
  Schedule as ScheduleIcon,
  Calculate as CalculateIcon,
  History as HistoryIcon,
  CheckCircle as GivenIcon,
  Pause as HoldIcon,
  Stop as StopIcon,
  MoreVert as MoreIcon,
  PlayArrow as AdministerIcon
} from '@mui/icons-material';
import { useMedication } from '../../context/MedicationContext';
import { useEmergency } from '../../context/EmergencyContext';
import EmergencyMedStrip from './EmergencyMedStrip';
import MedicationTimeline from './MedicationTimeline';
import DosageCalculator from './DosageCalculator';
import MedicationModal from './MedicationModal';

// Status colors and icons
const STATUS_CONFIG = {
  ORDERED: { color: 'warning', icon: <ScheduleIcon fontSize="small" />, label: 'Ordered' },
  GIVEN: { color: 'success', icon: <GivenIcon fontSize="small" />, label: 'Given' },
  STOPPED: { color: 'error', icon: <StopIcon fontSize="small" />, label: 'Stopped' },
  HELD: { color: 'default', icon: <HoldIcon fontSize="small" />, label: 'Held' },
  DUE: { color: 'info', icon: <ScheduleIcon fontSize="small" />, label: 'Due' }
};

export default function MedicationGrid() {
  const {
    medications,
    patientAllergies,
    patientWeight,
    administerMedication,
    stopMedication,
    removeMedication,
    setPatientAllergies,
    setPatientWeight
  } = useMedication();

  const { isEmergencyActive } = useEmergency();

  const [showTimeline, setShowTimeline] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMedId, setSelectedMedId] = useState(null);

  const handleMenuOpen = (event, medId) => {
    setAnchorEl(event.currentTarget);
    setSelectedMedId(medId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMedId(null);
  };

  const handleAdminister = () => {
    if (selectedMedId) {
      administerMedication(selectedMedId);
    }
    handleMenuClose();
  };

  const handleStop = () => {
    if (selectedMedId) {
      stopMedication(selectedMedId, 'Stopped by user');
    }
    handleMenuClose();
  };

  const handleRemove = () => {
    if (selectedMedId) {
      removeMedication(selectedMedId);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    const med = medications.find(m => m.id === selectedMedId);
    if (med) {
      setEditingMed(med);
      setShowModal(true);
    }
    handleMenuClose();
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingMed(null);
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <MedIcon color="primary" />
          <Typography variant="h6">Medications</Typography>
          {isEmergencyActive && (
            <Chip label="Emergency Mode" color="error" size="small" />
          )}
          <Chip 
            label={`${medications.length} active`} 
            size="small" 
            variant="outlined" 
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Dosage Calculator">
            <IconButton 
              onClick={() => setShowCalculator(!showCalculator)}
              color={showCalculator ? 'primary' : 'default'}
            >
              <CalculateIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Medication Timeline">
            <Badge badgeContent={medications.filter(m => m.status === 'GIVEN').length} color="success">
              <IconButton 
                onClick={() => setShowTimeline(!showTimeline)}
                color={showTimeline ? 'primary' : 'default'}
              >
                <HistoryIcon />
              </IconButton>
            </Badge>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowModal(true)}
          >
            Add Medication
          </Button>
        </Stack>
      </Stack>

      {/* Patient Allergies Display */}
      {patientAllergies.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<WarningIcon />}>
          <Typography variant="subtitle2">Known Allergies:</Typography>
          <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap" useFlexGap>
            {patientAllergies.map((allergy, idx) => (
              <Chip
                key={idx}
                label={allergy}
                color="error"
                size="small"
                icon={<WarningIcon />}
              />
            ))}
          </Stack>
        </Alert>
      )}

      {/* Patient Weight Display */}
      {patientWeight && (
        <Chip 
          label={`Patient Weight: ${patientWeight} kg`} 
          color="primary" 
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        />
      )}

      {/* Dosage Calculator */}
      <Collapse in={showCalculator}>
        <Box sx={{ mb: 2 }}>
          <DosageCalculator />
        </Box>
      </Collapse>

      {/* Emergency Quick-Add Strip */}
      <EmergencyMedStrip />

      {/* Medication Timeline */}
      <Collapse in={showTimeline}>
        <Box sx={{ mb: 2 }}>
          <MedicationTimeline />
        </Box>
      </Collapse>

      {/* Medications Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell><strong>Medication</strong></TableCell>
              <TableCell><strong>Dose</strong></TableCell>
              <TableCell><strong>Route</strong></TableCell>
              <TableCell><strong>Frequency</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Time</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <MedIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography color="text.secondary">
                      No medications added yet
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => setShowModal(true)}
                      sx={{ mt: 1 }}
                    >
                      Add First Medication
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              medications.map((med) => {
                const statusConfig = STATUS_CONFIG[med.status] || STATUS_CONFIG.ORDERED;
                const hasWarning = med.allergyWarnings?.length > 0;
                
                return (
                  <TableRow
                    key={med.id}
                    sx={{
                      bgcolor: hasWarning ? 'error.50' : 'inherit',
                      '&:hover': { bgcolor: hasWarning ? 'error.100' : 'grey.50' }
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {hasWarning && (
                          <Tooltip title={med.allergyWarnings.map(w => w.message).join(', ')}>
                            <WarningIcon color="error" fontSize="small" />
                          </Tooltip>
                        )}
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: med.color || 'grey.500'
                          }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {med.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {med.category}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {med.dose}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={med.route} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{med.frequency}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={statusConfig.icon}
                        label={statusConfig.label}
                        color={statusConfig.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {med.administeredAt
                          ? new Date(med.administeredAt).toLocaleTimeString()
                          : new Date(med.orderedAt).toLocaleTimeString()
                        }
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        {med.status === 'ORDERED' && (
                          <Tooltip title="Administer Now">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => administerMedication(med.id)}
                            >
                              <AdministerIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, med.id)}
                        >
                          <MoreIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleAdminister}>
          <AdministerIcon fontSize="small" sx={{ mr: 1 }} />
          Administer
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleStop}>
          <StopIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
          Stop
        </MenuItem>
        <MenuItem onClick={handleRemove} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Remove
        </MenuItem>
      </Menu>

      {/* Add/Edit Modal */}
      <MedicationModal
        open={showModal}
        onClose={handleModalClose}
        editMedication={editingMed}
      />
    </Paper>
  );
}