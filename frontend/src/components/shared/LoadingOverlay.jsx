// src/components/shared/LoadingOverlay.jsx
import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

/**
 * Loading Overlay Component
 */
const LoadingOverlay = ({
  open = false,
  message = 'Loading...',
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <Backdrop
        open={open}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
        }}
      >
        <CircularProgress color="inherit" size={48} />
        {message && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Backdrop>
    );
  }

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 10,
      }}
    >
      <CircularProgress size={40} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingOverlay;