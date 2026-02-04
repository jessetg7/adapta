// src/components/shared/EmptyState.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

/**
 * Empty State Component
 */
const EmptyState = ({
  icon: Icon = InboxIcon,
  title = 'No Data',
  description = 'There is nothing to display here yet.',
  actionLabel,
  onAction,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        textAlign: 'center',
        ...sx,
      }}
    >
      <Icon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;