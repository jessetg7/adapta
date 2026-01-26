import React from 'react';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import {
  Favorite as CardiacIcon,
  Air as RespiratoryIcon,
  Opacity as FluidIcon,
  Healing as AnalgesicIcon,
  Science as MetabolicIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useEmergency } from '../../context/EmergencyContext';

const CATEGORY_ICONS = {
  cardiac: <CardiacIcon />,
  respiratory: <RespiratoryIcon />,
  fluids: <FluidIcon />,
  analgesic: <AnalgesicIcon />,
  metabolic: <MetabolicIcon />,
  sedative: <AnalgesicIcon />,
  steroid: <MetabolicIcon />,
  antidote: <WarningIcon />
};

const CATEGORY_COLORS = {
  cardiac: '#e53935',
  respiratory: '#1e88e5',
  fluids: '#43a047',
  analgesic: '#fb8c00',
  metabolic: '#8e24aa',
  sedative: '#5e35b1',
  steroid: '#00897b',
  antidote: '#d81b60'
};

export default function QuickMedButtons({ onSelect, allergies = [] }) {
  const { emergencyMedications } = useEmergency();

  const checkAllergyConflict = (medName) => {
    return allergies.some(allergy =>
      medName.toLowerCase().includes(allergy.toLowerCase())
    );
  };

  // Group medications by category
  const groupedMeds = emergencyMedications.reduce((acc, med) => {
    if (!acc[med.category]) acc[med.category] = [];
    acc[med.category].push(med);
    return acc;
  }, {});

  return (
    <Box>
      {Object.entries(groupedMeds).map(([category, meds]) => (
        <Box key={category} sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Box sx={{ color: CATEGORY_COLORS[category] }}>
              {CATEGORY_ICONS[category]}
            </Box>
            <Typography variant="caption" color="text.secondary" textTransform="uppercase">
              {category}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {meds.map((med) => {
              const hasAllergy = checkAllergyConflict(med.name);
              return (
                <Tooltip
                  key={med.id}
                  title={
                    hasAllergy
                      ? `⚠️ ALLERGY RISK: ${med.name}`
                      : `${med.dose} ${med.route} - ${med.frequency}`
                  }
                  arrow
                >
                  <Button
                    variant={hasAllergy ? 'outlined' : 'contained'}
                    size="small"
                    onClick={() => onSelect(med)}
                    startIcon={hasAllergy ? <WarningIcon /> : null}
                    sx={{
                      bgcolor: hasAllergy ? 'transparent' : CATEGORY_COLORS[category],
                      borderColor: hasAllergy ? 'error.main' : 'transparent',
                      color: hasAllergy ? 'error.main' : 'white',
                      '&:hover': {
                        bgcolor: hasAllergy ? 'error.50' : CATEGORY_COLORS[category],
                        filter: hasAllergy ? 'none' : 'brightness(0.9)'
                      },
                      textTransform: 'none',
                      minWidth: 'auto',
                      mb: 0.5
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
    </Box>
  );
}