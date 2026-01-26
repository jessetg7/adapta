import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';

const EmptyState = ({ 
  icon, 
  title = 'No data found', 
  description = '', 
  action = null,
  minHeight = 300
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        p: 4,
        textAlign: 'center',
        bgcolor: 'grey.50',
        borderRadius: 2,
        border: '2px dashed',
        borderColor: 'grey.200'
      }}
    >
      <Box sx={{ color: 'grey.400', mb: 2 }}>
        {icon || <InboxIcon sx={{ fontSize: 64 }} />}
      </Box>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 400 }}>
          {description}
        </Typography>
      )}
      {action && (
        <Box sx={{ mt: 2 }}>
          {action}
        </Box>
      )}
    </Paper>
  );
};

export default EmptyState;