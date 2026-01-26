import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  Button,
  Collapse,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as DeferredIcon,
  ArrowForward as ArrowIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useEmergency } from '../../context/EmergencyContext';

export default function DeferredFieldsAlert({ onNavigateToField }) {
  const { deferredFields, removeDeferredField, isEmergencyActive } = useEmergency();
  const [expanded, setExpanded] = React.useState(false);

  if (deferredFields.length === 0) return null;

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        bgcolor: 'warning.50',
        border: '1px solid',
        borderColor: 'warning.300'
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setExpanded(!expanded)}
        sx={{ cursor: 'pointer' }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <DeferredIcon color="warning" />
          <Typography variant="subtitle1" fontWeight="medium">
            {deferredFields.length} Field{deferredFields.length > 1 ? 's' : ''} Deferred
          </Typography>
          <Chip
            label={isEmergencyActive ? 'Complete before discharge' : 'Pending completion'}
            size="small"
            color="warning"
          />
        </Stack>
        <Button
          size="small"
          endIcon={<ArrowIcon sx={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s' }} />}
        >
          {expanded ? 'Hide' : 'Show'}
        </Button>
      </Stack>

      <Collapse in={expanded}>
        <List dense sx={{ mt: 1 }}>
          {deferredFields.map((field) => (
            <ListItem
              key={field.fieldId}
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  {onNavigateToField && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onNavigateToField(field.fieldId)}
                    >
                      Go to Field
                    </Button>
                  )}
                  <Tooltip title="Mark as completed">
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => removeDeferredField(field.fieldId)}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
              sx={{
                bgcolor: 'white',
                borderRadius: 1,
                mb: 0.5
              }}
            >
              <ListItemIcon>
                <WarningIcon color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={field.fieldLabel}
                secondary={`Section: ${field.sectionId} • Deferred at ${new Date(field.deferredAt).toLocaleTimeString()}`}
              />
            </ListItem>
          ))}
        </List>
        
        <Alert severity="info" sx={{ mt: 1 }}>
          These fields were skipped during emergency care. Please complete them before discharge.
        </Alert>
      </Collapse>
    </Paper>
  );
}