import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Divider,
  IconButton,
  Badge
} from '@mui/material';
import {
  Favorite as CardiacIcon,
  Air as RespiratoryIcon,
  Opacity as FluidIcon,
  Healing as AnalgesicIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Block as BlockIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useClinical } from '../../context/ClinicalContext';
import { useEmergency } from '../../context/EmergencyContext';

const CATEGORY_ICONS = {
  cardiac: <CardiacIcon />,
  respiratory: <RespiratoryIcon />,
  fluids: <FluidIcon />,
  analgesic: <AnalgesicIcon />,
  antidote: <WarningIcon />
};

export default function EmergencyQuickStrip() {
  const { isEmergencyActive } = useEmergency();
  const {
    getEmergencyMedications,
    getMedicationById,
    quickAddEmergencyMed,
    checkAllergyConflict,
    blockedMedications,
    suggestedMedications,
    calculatePediatricDose,
    clinicalMode,
    patientData
  } = useClinical();

  const [confirmDialog, setConfirmDialog] = useState(null);
  const [lastAdded, setLastAdded] = useState(null);

  const emergencyMeds = getEmergencyMedications();

  const handleQuickAdd = (medicationId) => {
    const medication = getMedicationById(medicationId);
    const allergyConflict = checkAllergyConflict(medicationId);
    
    if (allergyConflict) {
      setConfirmDialog({
        medicationId,
        medication,
        conflicts: allergyConflict,
        type: 'allergy'
      });
      return;
    }

    // Show confirmation with dose info
    let doseInfo = medication.standardDose;
    if (clinicalMode === 'pediatric' && patientData.weight) {
      const calcDose = calculatePediatricDose(medicationId);
      if (calcDose) {
        doseInfo = `${calcDose.calculatedDose} ${calcDose.unit} (${calcDose.formula})`;
      }
    }

    setConfirmDialog({
      medicationId,
      medication,
      doseInfo,
      type: 'confirm'
    });
  };

  const confirmAdd = () => {
    if (!confirmDialog) return;
    
    const result = quickAddEmergencyMed(confirmDialog.medicationId);
    if (result.success) {
      setLastAdded(confirmDialog.medicationId);
      setTimeout(() => setLastAdded(null), 2000);
    }
    setConfirmDialog(null);
  };

  // Group by category
  const groupedMeds = emergencyMeds.reduce((acc, med) => {
    const cat = med.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(med);
    return acc;
  }, {});

  if (!isEmergencyActive) {
    return (
      <Paper 
        sx={{ 
          p: 2, 
          mb: 2, 
          bgcolor: 'grey.100',
          border: '1px dashed',
          borderColor: 'grey.400'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <SpeedIcon color="action" />
          <Typography color="text.secondary">
            Emergency Quick-Add available in Emergency Mode
          </Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        background: 'linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)',
        border: '2px solid',
        borderColor: 'error.300'
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <SpeedIcon />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="error.main">
              ⚡ Emergency Quick-Add
            </Typography>
            <Typography variant="caption" color="text.secondary">
              One-click administration with standard doses
            </Typography>
          </Box>
        </Stack>
        
        {suggestedMedications.length > 0 && (
          <Chip
            icon={<CheckIcon />}
            label={`${suggestedMedications.length} suggested`}
            color="success"
            size="small"
          />
        )}
      </Stack>

      <Stack spacing={2}>
        {Object.entries(groupedMeds).map(([category, meds]) => (
          <Box key={category}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Box sx={{ color: meds[0]?.color || 'grey.600' }}>
                {CATEGORY_ICONS[category] || <AddIcon />}
              </Box>
              <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight="bold">
                {category}
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {meds.map((med) => {
                const isBlocked = blockedMedications.includes(med.id);
                const isSuggested = suggestedMedications.includes(med.id);
                const hasAllergy = checkAllergyConflict(med.id);
                const justAdded = lastAdded === med.id;

                return (
                  <Tooltip
                    key={med.id}
                    title={
                      isBlocked 
                        ? `Blocked: ${hasAllergy?.[0]?.message || 'Clinical restriction'}`
                        : `${med.standardDose} ${med.routes?.[0] || 'IV'} - STAT`
                    }
                    arrow
                  >
                    <span>
                      <Button
                        variant={isSuggested ? 'contained' : 'outlined'}
                        size="medium"
                        disabled={isBlocked}
                        onClick={() => handleQuickAdd(med.id)}
                        startIcon={
                          justAdded ? <CheckIcon /> :
                          isBlocked ? <BlockIcon /> :
                          hasAllergy ? <WarningIcon /> :
                          null
                        }
                        sx={{
                          borderColor: med.color,
                          color: isBlocked ? 'grey.500' : med.color,
                          bgcolor: justAdded ? 'success.100' : 
                                   isSuggested ? med.color : 
                                   'transparent',
                          '&:hover': {
                            bgcolor: isBlocked ? 'grey.100' : `${med.color}20`,
                            borderColor: med.color
                          },
                          '&.Mui-disabled': {
                            borderColor: 'grey.300',
                            bgcolor: 'grey.100'
                          },
                          transition: 'all 0.2s',
                          fontWeight: 600,
                          position: 'relative',
                          ...(isSuggested && {
                            color: 'white',
                            '&:hover': {
                              bgcolor: med.color,
                              filter: 'brightness(0.9)'
                            }
                          })
                        }}
                      >
                        {med.name.split(' ')[0]}
                        {med.highAlert && (
                          <Box
                            component="span"
                            sx={{
                              position: 'absolute',
                              top: -4,
                              right: -4,
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'warning.main'
                            }}
                          />
                        )}
                      </Button>
                    </span>
                  </Tooltip>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Confirmation Dialog */}
      <Dialog 
        open={!!confirmDialog} 
        onClose={() => setConfirmDialog(null)}
        maxWidth="xs"
        fullWidth
      >
        {confirmDialog && (
          <>
            <DialogTitle sx={{ 
              bgcolor: confirmDialog.type === 'allergy' ? 'error.main' : 'primary.main',
              color: 'white'
            }}>
              {confirmDialog.type === 'allergy' ? '⚠️ Allergy Warning' : 'Confirm Medication'}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {confirmDialog.type === 'allergy' ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {confirmDialog.conflicts?.map((c, i) => (
                    <Typography key={i}>{c.message}</Typography>
                  ))}
                </Alert>
              ) : null}
              
              <Typography variant="h6" gutterBottom>
                {confirmDialog.medication?.name}
              </Typography>
              
              <Stack spacing={1}>
                <Chip label={confirmDialog.doseInfo || confirmDialog.medication?.standardDose} />
                <Chip label={confirmDialog.medication?.routes?.[0] || 'IV'} variant="outlined" />
                <Chip label="STAT" color="error" variant="outlined" />
              </Stack>

              {confirmDialog.medication?.warnings?.length > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {confirmDialog.medication.warnings.map((w, i) => (
                    <Typography key={i} variant="body2">• {w}</Typography>
                  ))}
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDialog(null)}>Cancel</Button>
              <Button 
                variant="contained" 
                color={confirmDialog.type === 'allergy' ? 'error' : 'primary'}
                onClick={confirmAdd}
                startIcon={<AddIcon />}
              >
                {confirmDialog.type === 'allergy' ? 'Override & Add' : 'Add Medication'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
}