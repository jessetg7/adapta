import React from 'react';
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Tooltip,
  Paper,
  Stack
} from '@mui/material';
import {
  CheckCircle as NormalIcon,
  LocalHospital as EmergencyIcon,
  Replay as FollowupIcon,
  ExitToApp as DischargeIcon
} from '@mui/icons-material';
import { useEmergency } from '../../context/EmergencyContext';

const MODE_ICONS = {
  NORMAL: <NormalIcon />,
  EMERGENCY: <EmergencyIcon />,
  FOLLOWUP: <FollowupIcon />,
  DISCHARGE: <DischargeIcon />
};

const MODE_DESCRIPTIONS = {
  NORMAL: 'Full form with all sections',
  EMERGENCY: 'Critical sections only',
  FOLLOWUP: 'Previous visit reference',
  DISCHARGE: 'Summary & instructions'
};

export default function ModeSelector({ compact = false }) {
  const { currentMode, formModes, changeMode } = useEmergency();

  const handleModeChange = (event, newMode) => {
    if (newMode) {
      changeMode(newMode);
    }
  };

  if (compact) {
    return (
      <ToggleButtonGroup
        value={currentMode.id}
        exclusive
        onChange={handleModeChange}
        size="small"
      >
        {Object.values(formModes).map((mode) => (
          <ToggleButton
            key={mode.id}
            value={mode.id}
            sx={{
              px: 2,
              '&.Mui-selected': {
                bgcolor: mode.color,
                color: 'white',
                '&:hover': {
                  bgcolor: mode.color
                }
              }
            }}
          >
            <Tooltip title={`${mode.label}: ${MODE_DESCRIPTIONS[mode.id]}`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {mode.icon} {mode.label}
              </Box>
            </Tooltip>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Form Mode
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {Object.values(formModes).map((mode) => (
          <Tooltip key={mode.id} title={MODE_DESCRIPTIONS[mode.id]} arrow>
            <Paper
              onClick={() => changeMode(mode.id)}
              sx={{
                p: 1.5,
                cursor: 'pointer',
                border: 2,
                borderColor: currentMode.id === mode.id ? mode.color : 'transparent',
                bgcolor: currentMode.id === mode.id ? `${mode.color}15` : 'grey.50',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: `${mode.color}25`,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: mode.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {MODE_ICONS[mode.id]}
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {mode.icon} {mode.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {MODE_DESCRIPTIONS[mode.id]}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Tooltip>
        ))}
      </Stack>
    </Paper>
  );
}