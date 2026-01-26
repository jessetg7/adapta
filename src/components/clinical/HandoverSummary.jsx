import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Button
} from '@mui/material';
import {
  SwapHoriz as HandoverIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as PendingIcon,
  LocalPharmacy as MedIcon,
  MonitorHeart as VitalsIcon,
  Note as NoteIcon,
  Print as PrintIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useClinical } from '../../context/ClinicalContext';
import { useEmergency } from '../../context/EmergencyContext';

export default function HandoverSummary({ patientName = 'Patient' }) {
  const { 
    getClinicalSummary, 
    administeredMeds, 
    activeAlerts, 
    patientData,
    medicationTimeline
  } = useClinical();
  
  const { 
    isEmergencyActive, 
    triageLevel, 
    deferredFields 
  } = useEmergency();

  const summary = getClinicalSummary();
  const givenMeds = administeredMeds.filter(m => m.status === 'given');
  const pendingMeds = administeredMeds.filter(m => m.status === 'ordered');

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: isEmergencyActive ? 'error.main' : 'primary.main',
          color: 'white'
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <HandoverIcon fontSize="large" />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Handover Summary
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {patientName} • {new Date().toLocaleString()}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<PrintIcon />}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Print
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<ShareIcon />}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Share
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Critical Alerts */}
          {activeAlerts.length > 0 && (
            <Grid item xs={12}>
              <Alert severity="error" icon={<WarningIcon />}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Active Alerts ({activeAlerts.length})
                </Typography>
                {activeAlerts.map((alert, idx) => (
                  <Typography key={idx} variant="body2">
                    • {alert.message}
                  </Typography>
                ))}
              </Alert>
            </Grid>
          )}

          {/* Patient Status */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <VitalsIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Patient Status
                  </Typography>
                </Stack>
                
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Mode:</Typography>
                    <Chip 
                      label={isEmergencyActive ? 'Emergency' : 'Normal'} 
                      color={isEmergencyActive ? 'error' : 'success'}
                      size="small"
                    />
                  </Stack>
                  
                  {triageLevel && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Triage Level:</Typography>
                      <Chip 
                        label={triageLevel.label}
                        sx={{ bgcolor: triageLevel.color, color: 'white' }}
                        size="small"
                      />
                    </Stack>
                  )}
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Allergies:</Typography>
                    <Typography fontWeight="medium">
                      {summary.allergiesCount > 0 
                        ? summary.allergies.join(', ') 
                        : 'NKDA'
                      }
                    </Typography>
                  </Stack>
                  
                  {patientData.weight && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Weight:</Typography>
                      <Typography fontWeight="medium">{patientData.weight} kg</Typography>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Medications Summary */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <MedIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Medications
                  </Typography>
                </Stack>
                
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Given:</Typography>
                    <Chip 
                      icon={<CheckIcon />}
                      label={givenMeds.length}
                      color="success"
                      size="small"
                    />
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Pending:</Typography>
                    <Chip 
                      icon={<PendingIcon />}
                      label={pendingMeds.length}
                      color="warning"
                      size="small"
                    />
                  </Stack>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  {givenMeds.slice(0, 3).map((med) => (
                    <Typography key={med.id} variant="body2">
                      • {med.medicationName} {med.dose} @ {new Date(med.administeredAt).toLocaleTimeString()}
                    </Typography>
                  ))}
                  
                  {givenMeds.length > 3 && (
                    <Typography variant="caption" color="text.secondary">
                      +{givenMeds.length - 3} more medications
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Pending Tasks */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ bgcolor: 'warning.50' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <PendingIcon color="warning" />
                  <Typography variant="subtitle1" fontWeight="bold" color="warning.dark">
                    Pending Tasks
                  </Typography>
                </Stack>
                
                <List dense>
                  {pendingMeds.length > 0 && (
                    <ListItem>
                      <ListItemIcon><MedIcon color="warning" /></ListItemIcon>
                      <ListItemText 
                        primary={`${pendingMeds.length} medication(s) to administer`}
                        secondary={pendingMeds.map(m => m.medicationName).join(', ')}
                      />
                    </ListItem>
                  )}
                  
                  {deferredFields.length > 0 && (
                    <ListItem>
                      <ListItemIcon><NoteIcon color="warning" /></ListItemIcon>
                      <ListItemText 
                        primary={`${deferredFields.length} deferred field(s) to complete`}
                        secondary="Complete before discharge"
                      />
                    </ListItem>
                  )}
                  
                  {pendingMeds.length === 0 && deferredFields.length === 0 && (
                    <ListItem>
                      <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                      <ListItemText 
                        primary="No pending tasks"
                        secondary="All tasks completed"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Timeline Summary */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <NoteIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Timeline Summary
                  </Typography>
                </Stack>
                
                <Stack spacing={0.5}>
                  {medicationTimeline.slice(-5).map((event, idx) => (
                    <Typography key={idx} variant="body2">
                      <strong>{event.time}</strong> - {event.action}: {event.medication} {event.dose} ({event.route})
                    </Typography>
                  ))}
                  
                  {medicationTimeline.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No events recorded
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}