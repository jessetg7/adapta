import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  Collapse,
  Stack,
  Divider,
  Alert
} from '@mui/material';
import {
  Warning as WarningIcon,
  LocalHospital as HospitalIcon,
  Close as CloseIcon,
  Timer as TimerIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useEmergency } from '../../context/EmergencyContext';

export default function EmergencyBanner() {
  const {
    isEmergencyActive,
    currentMode,
    triageLevel,
    deactivateEmergencyMode,
    deferredFields,
    explainabilityLog
  } = useEmergency();

  const [showDetails, setShowDetails] = React.useState(false);

  if (!isEmergencyActive) return null;

  const lastActivation = explainabilityLog
    .filter(log => log.action === 'EMERGENCY_MODE_ACTIVATED')
    .pop();

  return (
    <Collapse in={isEmergencyActive}>
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(90deg, #d32f2f 0%, #f44336 50%, #d32f2f 100%)',
          color: 'white',
          p: 2,
          mb: 2,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'repeating-linear-gradient(90deg, #fff 0px, #fff 10px, transparent 10px, transparent 20px)',
            animation: 'emergencyStripe 1s linear infinite'
          },
          '@keyframes emergencyStripe': {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '20px 0' }
          }
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.2)',
                animation: 'pulse 1.5s infinite'
              }}
            >
              <HospitalIcon fontSize="large" />
            </Box>
            
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🚨 EMERGENCY MODE ACTIVE
                {triageLevel && (
                  <Chip
                    size="small"
                    label={triageLevel.label}
                    sx={{
                      bgcolor: triageLevel.color,
                      color: triageLevel.level <= 2 ? 'white' : 'black',
                      fontWeight: 'bold',
                      ml: 1
                    }}
                  />
                )}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {currentMode.hiddenSections?.length || 0} non-critical sections hidden • 
                Only essential fields visible
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            {deferredFields.length > 0 && (
              <Chip
                icon={<TimerIcon />}
                label={`${deferredFields.length} deferred`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            )}
            
            <Button
              size="small"
              variant="outlined"
              onClick={() => setShowDetails(!showDetails)}
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
              startIcon={showDetails ? <VisibilityOffIcon /> : <VisibilityIcon />}
            >
              {showDetails ? 'Hide' : 'Details'}
            </Button>
            
            <Button
              size="small"
              variant="contained"
              onClick={deactivateEmergencyMode}
              sx={{ 
                bgcolor: 'white', 
                color: '#d32f2f',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              Exit Emergency
            </Button>
          </Stack>
        </Stack>

        <Collapse in={showDetails}>
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
          <Stack spacing={1}>
            <Typography variant="subtitle2">
              <SpeedIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
              Activation Reason: {lastActivation?.reason || 'Manual activation'}
            </Typography>
            
            {triageLevel?.action && (
              <Typography variant="body2">
                ⏱️ Required Response: {triageLevel.action}
              </Typography>
            )}
            
            {triageLevel?.reasons?.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Critical Indicators:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {triageLevel.reasons.map((reason, idx) => (
                    <Chip 
                      key={idx} 
                      label={reason} 
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </Collapse>
      </Paper>
    </Collapse>
  );
}