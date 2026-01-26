import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  Info as InfoIcon,
  Rule as RuleIcon,
  Visibility as VisibleIcon,
  VisibilityOff as HiddenIcon,
  LocalHospital as EmergencyIcon,
  History as HistoryIcon,
  Psychology as AIIcon,
  Settings as SettingsIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { useEmergency } from '../../context/EmergencyContext';

export default function ExplainabilityPanel({ formData = {} }) {
  const {
    currentMode,
    isEmergencyActive,
    activeRules,
    explainabilityLog,
    triageLevel,
    deferredFields
  } = useEmergency();

  const [expanded, setExpanded] = useState(false);

  // Generate human-readable explanations
  const generateExplanations = () => {
    const explanations = [];

    if (isEmergencyActive) {
      explanations.push({
        type: 'mode',
        icon: <EmergencyIcon color="error" />,
        title: 'Emergency Mode Active',
        description: 'Form has been simplified to show only critical fields',
        rules: ['emergency-mode-rule']
      });
    }

    if (triageLevel) {
      explanations.push({
        type: 'triage',
        icon: <AIIcon color="primary" />,
        title: `Triage Level: ${triageLevel.label}`,
        description: triageLevel.reasons?.join(', ') || 'Based on vital signs assessment',
        rules: ['triage-calculation-rule']
      });
    }

    if (currentMode.hiddenSections?.length > 0 && isEmergencyActive) {
      explanations.push({
        type: 'visibility',
        icon: <HiddenIcon color="warning" />,
        title: `${currentMode.hiddenSections.length} Sections Hidden`,
        description: 'Non-critical sections are hidden in emergency mode',
        rules: ['section-visibility-rule']
      });
    }

    if (deferredFields.length > 0) {
      explanations.push({
        type: 'deferred',
        icon: <HistoryIcon color="info" />,
        title: `${deferredFields.length} Fields Deferred`,
        description: 'Fields marked for later completion',
        rules: ['deferred-capture-rule']
      });
    }

    return explanations;
  };

  const explanations = generateExplanations();

  return (
    <Paper sx={{ mb: 2, overflow: 'hidden' }}>
      <Box
        sx={{
          p: 2,
          bgcolor: 'grey.100',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <InfoIcon color="primary" />
          <Typography variant="subtitle1" fontWeight="medium">
            Why am I seeing this?
          </Typography>
          <Chip
            label={`${explanations.length} active rules`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Stack>
        <IconButton size="small">
          <ExpandIcon
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: '0.2s'
            }}
          />
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {/* Current State Summary */}
          <Alert
            severity={isEmergencyActive ? 'error' : 'info'}
            icon={isEmergencyActive ? <EmergencyIcon /> : <SettingsIcon />}
            sx={{ mb: 2 }}
          >
            <Typography variant="subtitle2">
              Current Mode: <strong>{currentMode.icon} {currentMode.label}</strong>
            </Typography>
            {triageLevel && (
              <Typography variant="body2">
                Triage: <strong>{triageLevel.label}</strong> - {triageLevel.action}
              </Typography>
            )}
          </Alert>

          {/* Active Explanations */}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Active Rules & Behaviors
          </Typography>
          
          <Stack spacing={1}>
            {explanations.map((exp, idx) => (
              <Paper
                key={idx}
                variant="outlined"
                sx={{ p: 1.5 }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ mt: 0.5 }}>{exp.icon}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {exp.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exp.description}
                    </Typography>
                    <Stack direction="row" spacing={0.5} mt={1}>
                      {exp.rules.map((rule) => (
                        <Chip
                          key={rule}
                          label={rule}
                          size="small"
                          icon={<RuleIcon />}
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>

          {/* Activity Log */}
          {explainabilityLog.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Recent Activity
              </Typography>
              <List dense>
                {explainabilityLog.slice(-5).reverse().map((log, idx) => (
                  <ListItem key={idx} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <HistoryIcon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={log.action.replace(/_/g, ' ')}
                      secondary={`${new Date(log.timestamp).toLocaleTimeString()} - ${log.reason || ''}`}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {/* Help Text */}
          <Alert severity="info" icon={<HelpIcon />} sx={{ mt: 2 }}>
            <Typography variant="caption">
              This panel explains why certain sections and fields are visible or hidden.
              All decisions are made by the rule engine based on patient data and context.
              No AI is used - only transparent, configurable rules.
            </Typography>
          </Alert>
        </Box>
      </Collapse>
    </Paper>
  );
}