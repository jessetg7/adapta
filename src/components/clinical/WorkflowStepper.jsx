import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Stack,
  Chip,
  Tooltip,
  styled
} from '@mui/material';
import {
  HowToReg as RegistrationIcon,
  MonitorHeart as VitalsIcon,
  MedicalServices as DoctorIcon,
  LocalPharmacy as MedicationIcon,
  ExitToApp as DischargeIcon,
  Check as CheckIcon,
  Lock as LockIcon,
  PlayArrow as CurrentIcon
} from '@mui/icons-material';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';

// Custom connector styling
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(95deg, #2196f3 0%, #21cbf3 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(95deg, #4caf50 0%, #8bc34a 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 1,
  },
}));

// Custom step icon component
function CustomStepIcon({ active, completed, icon, step, skipped, locked }) {
  const icons = {
    1: <RegistrationIcon />,
    2: <VitalsIcon />,
    3: <DoctorIcon />,
    4: <MedicationIcon />,
    5: <DischargeIcon />
  };

  let bgcolor = 'grey.300';
  let color = 'grey.600';

  if (completed) {
    bgcolor = 'success.main';
    color = 'white';
  } else if (active) {
    bgcolor = 'primary.main';
    color = 'white';
  } else if (skipped) {
    bgcolor = 'warning.main';
    color = 'white';
  } else if (locked) {
    bgcolor = 'grey.400';
    color = 'grey.600';
  }

  return (
    <Box
      sx={{
        width: 50,
        height: 50,
        borderRadius: '50%',
        bgcolor,
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: active ? '0 4px 10px rgba(0,0,0,0.25)' : 'none',
        transition: 'all 0.3s',
        position: 'relative'
      }}
    >
      {completed ? <CheckIcon /> : locked ? <LockIcon /> : icons[icon]}
      {active && (
        <Box
          sx={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 16,
            height: 16,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CurrentIcon sx={{ fontSize: 10, color: 'white' }} />
        </Box>
      )}
    </Box>
  );
}

const WORKFLOW_STEPS = [
  { 
    id: 'registration', 
    label: 'Registration', 
    description: 'Patient check-in',
    roles: ['staff', 'nurse', 'doctor', 'admin'],
    canSkipInEmergency: true
  },
  { 
    id: 'vitals', 
    label: 'Vitals', 
    description: 'Vital signs assessment',
    roles: ['nurse', 'doctor', 'admin'],
    canSkipInEmergency: false
  },
  { 
    id: 'consultation', 
    label: 'Doctor', 
    description: 'Medical consultation',
    roles: ['doctor', 'admin'],
    canSkipInEmergency: false
  },
  { 
    id: 'medication', 
    label: 'Medication', 
    description: 'Prescribe & administer',
    roles: ['nurse', 'doctor', 'admin'],
    canSkipInEmergency: false
  },
  { 
    id: 'discharge', 
    label: 'Discharge', 
    description: 'Complete & discharge',
    roles: ['nurse', 'doctor', 'admin'],
    canSkipInEmergency: false
  }
];

export default function WorkflowStepper({ currentStep = 1, completedSteps = [], onStepClick }) {
  const { isEmergencyActive } = useEmergency();
  const { user, hasRole } = useAuth();

  // In emergency mode, skip registration step
  const skippedSteps = isEmergencyActive 
    ? WORKFLOW_STEPS.filter(s => s.canSkipInEmergency).map((_, i) => i)
    : [];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          Workflow Progress
        </Typography>
        {isEmergencyActive && (
          <Chip 
            label="Emergency: Some steps skipped" 
            color="error" 
            size="small" 
            variant="outlined"
          />
        )}
      </Stack>

      <Stepper 
        alternativeLabel 
        activeStep={currentStep} 
        connector={<ColorlibConnector />}
      >
        {WORKFLOW_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isActive = currentStep === index;
          const isSkipped = skippedSteps.includes(index);
          const isLocked = !step.roles.includes(user?.role);

          return (
            <Step key={step.id} completed={isCompleted}>
              <Tooltip 
                title={
                  isLocked 
                    ? `Requires: ${step.roles.join(', ')}` 
                    : isSkipped 
                    ? 'Skipped in emergency' 
                    : step.description
                }
                arrow
              >
                <StepLabel
                  StepIconComponent={(props) => (
                    <CustomStepIcon 
                      {...props} 
                      step={step}
                      skipped={isSkipped}
                      locked={isLocked}
                    />
                  )}
                  onClick={() => !isLocked && onStepClick?.(index)}
                  sx={{ 
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isSkipped ? 0.6 : 1
                  }}
                >
                  <Typography 
                    variant="body2" 
                    fontWeight={isActive ? 'bold' : 'normal'}
                    color={isActive ? 'primary.main' : isSkipped ? 'text.disabled' : 'text.primary'}
                  >
                    {step.label}
                  </Typography>
                  {isSkipped && (
                    <Typography variant="caption" color="warning.main">
                      Skipped
                    </Typography>
                  )}
                </StepLabel>
              </Tooltip>
            </Step>
          );
        })}
      </Stepper>

      {/* Current step info */}
      <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CurrentIcon color="primary" />
          <Typography variant="body2">
            <strong>Current:</strong> {WORKFLOW_STEPS[currentStep]?.label} - {WORKFLOW_STEPS[currentStep]?.description}
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
}