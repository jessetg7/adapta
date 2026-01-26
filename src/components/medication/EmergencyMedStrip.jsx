import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Tooltip,
  Chip,
  Alert,
  Collapse
} from '@mui/material';
import {
  LocalHospital as EmergencyIcon,
  Favorite as CardiacIcon,
  Air as RespiratoryIcon,
  Opacity as FluidIcon,
  Warning as WarningIcon,
  Bolt as BoltIcon
} from '@mui/icons-material';
import { useMedication } from '../../context/MedicationContext';
import { useEmergency } from '../../context/EmergencyContext';

// Category icons
const CATEGORY_ICONS = {
  'Emergency': <EmergencyIcon />,
  'Cardiac': <CardiacIcon />,
  'Respiratory': <RespiratoryIcon />,
  'Fluids': <FluidIcon />,
  'Analgesic': <BoltIcon />,
  'Antidote': <WarningIcon />
};

export default function EmergencyMedStrip({ onMedicationAdded }) {
  const { 
    getEmergencyMedications, 
    quickAddEmergencyMed, 
    checkAllergyConflict,
    patientWeight 
  } = useMedication();
  
  const { isEmergencyActive } = useEmergency();
  
  const [lastWarning, setLastWarning] = React.useState(null);
  
  const emergencyMeds = getEmergencyMedications();

  // Group by category
  const groupedMeds = emergencyMeds.reduce((acc, med) => {
    if (!acc[med.category]) acc[med.category] = [];
    acc[med.category].push(med);
    return acc;
  }, {});

  const handleQuickAdd = (med) => {
    // Check for allergy
    const allergyCheck = checkAllergyConflict(med);
    
    if (allergyCheck.hasConflict) {
      setLastWarning({
        medication: med.name,
        warnings: allergyCheck.warnings
      });
      // Still allow adding but with warning shown
    }
    
    const result = quickAddEmergencyMed(med.id);
    
    if (result.success && onMedicationAdded) {
      onMedicationAdded(result.medication);
    }
    
    // Clear warning after 5 seconds
    setTimeout(() => setLastWarning(null), 5000);
  };

  // Don't show if not in emergency mode
  if (!isEmergencyActive) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        background: 'linear-gradient(135deg, #ffebee 0%, #fff 100%)',
        border: '2px solid',
        borderColor: 'error.main',
        borderRadius: 2
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <EmergencyIcon color="error" />
        <Typography variant="h6" color="error.main" fontWeight="bold">
          ⚡ Emergency Quick-Add
        </Typography>
        <Chip 
          label="One-Click Administration" 
          size="small" 
          color="error" 
          variant="outlined" 
        />
        {patientWeight && (
          <Chip 
            label={`Weight: ${patientWeight} kg`} 
            size="small" 
            color="primary" 
          />
        )}
      </Stack>

      {/* Allergy Warning */}
      <Collapse in={!!lastWarning}>
        <Alert 
          severity="error" 
          onClose={() => setLastWarning(null)}
          sx={{ mb: 2 }}
          icon={<WarningIcon />}
        >
          <Typography variant="subtitle2">
            ⚠️ ALLERGY ALERT: {lastWarning?.medication}
          </Typography>
          {lastWarning?.warnings.map((w, idx) => (
            <Typography key={idx} variant="body2">
              {w.message}
            </Typography>
          ))}
        </Alert>
      </Collapse>

      {/* Medication Buttons by Category */}
      {Object.entries(groupedMeds).map(([category, meds]) => (
        <Box key={category} sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Box sx={{ color: meds[0]?.color || 'grey.600' }}>
              {CATEGORY_ICONS[category] || <EmergencyIcon />}
            </Box>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              textTransform="uppercase"
              fontWeight="bold"
            >
              {category}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {meds.map((med) => {
              const allergyCheck = checkAllergyConflict(med);
              const hasAllergy = allergyCheck.hasConflict;
              
              return (
                <Tooltip
                  key={med.id}
                  title={
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {med.name}
                      </Typography>
                      <Typography variant="caption">
                        {med.standardDose} • {med.routes.join('/')} • {med.frequency}
                      </Typography>
                      {hasAllergy && (
                        <Typography variant="caption" color="error.light" display="block">
                          ⚠️ Allergy risk detected
                        </Typography>
                      )}
                    </Box>
                  }
                  arrow
                >
                  <Button
                    variant={hasAllergy ? 'outlined' : 'contained'}
                    size="medium"
                    onClick={() => handleQuickAdd(med)}
                    startIcon={hasAllergy ? <WarningIcon /> : null}
                    sx={{
                      bgcolor: hasAllergy ? 'transparent' : med.color,
                      borderColor: hasAllergy ? 'error.main' : 'transparent',
                      color: hasAllergy ? 'error.main' : 'white',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      minWidth: 100,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: hasAllergy ? 'error.50' : med.color,
                        filter: hasAllergy ? 'none' : 'brightness(0.85)'
                      },
                      animation: hasAllergy ? 'none' : 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { boxShadow: `0 0 0 0 ${med.color}40` },
                        '70%': { boxShadow: `0 0 0 6px ${med.color}00` },
                        '100%': { boxShadow: `0 0 0 0 ${med.color}00` }
                      }
                    }}
                  >
                    {med.name.split(' ')[0]}
                  </Button>
                </Tooltip>
              );
            })}
          </Stack>
        </Box>
      ))}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        💡 Click to add with standard emergency dose. Dose auto-calculated if patient weight is set.
      </Typography>
    </Paper>
  );
}