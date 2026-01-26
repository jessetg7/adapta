import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import {
  MedicalServices as MedIcon,
  Schedule as TimeIcon,
  CheckCircle as GivenIcon,
  AddCircle as OrderedIcon,
  Cancel as StoppedIcon
} from '@mui/icons-material';
import { useMedication } from '../../context/MedicationContext';

const ACTION_CONFIG = {
  ORDERED: { icon: <OrderedIcon fontSize="small" />, color: 'warning.main' },
  GIVEN: { icon: <GivenIcon fontSize="small" />, color: 'success.main' },
  STOPPED: { icon: <StoppedIcon fontSize="small" />, color: 'error.main' }
};

export default function MedicationTimeline() {
  const { timeline } = useMedication();

  if (timeline.length === 0) {
    return (
      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography color="text.secondary" textAlign="center">
          No medication activity yet
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <TimeIcon color="primary" />
        <Typography variant="subtitle2" fontWeight="bold">
          Medication Timeline
        </Typography>
        <Chip
          label={`${timeline.length} events`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Stack>

      <Box sx={{ position: 'relative', pl: 3 }}>
        {/* Vertical line */}
        <Box
          sx={{
            position: 'absolute',
            left: 8,
            top: 8,
            bottom: 8,
            width: 2,
            bgcolor: 'primary.200',
            borderRadius: 1
          }}
        />

        {/* Timeline items */}
        <Stack spacing={2}>
          {[...timeline].reverse().map((item, index) => {
            const config = ACTION_CONFIG[item.action] || ACTION_CONFIG.ORDERED;
            
            return (
              <Box key={index} sx={{ position: 'relative' }}>
                {/* Dot */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: -24,
                    top: 4,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: config.color,
                    border: '3px solid',
                    borderColor: 'background.paper',
                    boxShadow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />

                {/* Content */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    ml: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'primary.50',
                      borderColor: 'primary.300'
                    }
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {config.icon}
                        <Typography variant="body2" fontWeight="medium">
                          {item.medication}
                        </Typography>
                        <Chip
                          label={item.action}
                          size="small"
                          color={item.action === 'GIVEN' ? 'success' : item.action === 'STOPPED' ? 'error' : 'warning'}
                        />
                      </Stack>
                      {(item.dose || item.route) && (
                        <Stack direction="row" spacing={0.5} mt={0.5}>
                          {item.dose && (
                            <Chip
                              label={item.dose}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                          {item.route && (
                            <Chip
                              label={item.route}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Stack>
                      )}
                      {item.reason && (
                        <Typography variant="caption" color="error.main">
                          Reason: {item.reason}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 'bold',
                        bgcolor: 'grey.100',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.time}
                    </Typography>
                  </Stack>
                </Paper>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Summary */}
      <Divider sx={{ my: 2 }} />
      <Stack direction="row" spacing={2} justifyContent="center">
        <Chip
          label={`${timeline.filter(t => t.action === 'GIVEN').length} administered`}
          size="small"
          color="success"
        />
        <Chip
          label={`${timeline.filter(t => t.action === 'ORDERED').length} ordered`}
          size="small"
          color="warning"
        />
      </Stack>
    </Paper>
  );
}