import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  IconButton,
  Collapse,
  Alert,
  AlertTitle,
  Button
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  Notifications as NotificationIcon,
  LocalHospital as HospitalIcon
} from '@mui/icons-material';
import { useClinical } from '../../context/ClinicalContext';

export default function ClinicalRiskBanner() {
  const { activeAlerts, clearAlert, getClinicalSummary } = useClinical();
  const [expanded, setExpanded] = React.useState(true);

  const summary = getClinicalSummary();
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
  const warningAlerts = activeAlerts.filter(a => a.severity === 'warning');

  if (activeAlerts.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      {/* Critical Alerts - Always Prominent */}
      {criticalAlerts.map((alert) => (
        <Paper
          key={alert.id}
          sx={{
            mb: 1,
            overflow: 'hidden',
            border: '2px solid',
            borderColor: 'error.main',
            animation: 'pulse 2s infinite'
          }}
        >
          <Box
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.2)'
                }}
              >
                <ErrorIcon />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  ⚠️ CRITICAL: {alert.message}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Rule: {alert.ruleName} • {new Date(alert.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            </Stack>
            <IconButton 
              size="small" 
              onClick={() => clearAlert(alert.id)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}

      {/* Warning Alerts - Collapsible */}
      {warningAlerts.length > 0 && (
        <Paper sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.300' }}>
          <Box
            sx={{
              px: 2,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              bgcolor: 'warning.100'
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <WarningIcon color="warning" />
              <Typography variant="subtitle2" fontWeight="medium">
                {warningAlerts.length} Warning{warningAlerts.length > 1 ? 's' : ''}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {expanded ? 'Hide' : 'Show'}
            </Typography>
          </Box>
          
          <Collapse in={expanded}>
            <Stack spacing={1} sx={{ p: 2 }}>
              {warningAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  severity="warning"
                  onClose={() => clearAlert(alert.id)}
                  sx={{ py: 0.5 }}
                >
                  <Typography variant="body2">{alert.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rule: {alert.ruleName}
                  </Typography>
                </Alert>
              ))}
            </Stack>
          </Collapse>
        </Paper>
      )}

      {/* Risk Summary */}
      {summary.blockedMedications > 0 && (
        <Alert severity="error" sx={{ mt: 1 }}>
          <AlertTitle>Medication Restrictions Active</AlertTitle>
          {summary.blockedMedications} medication(s) blocked due to patient allergies or contraindications
        </Alert>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(211, 47, 47, 0); }
            100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); }
          }
        `}
      </style>
    </Box>
  );
}