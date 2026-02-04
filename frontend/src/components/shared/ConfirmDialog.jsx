// src/components/shared/ConfirmDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';

/**
 * Reusable Confirmation Dialog Component
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  type = 'confirm', // 'confirm', 'warning', 'danger', 'info'
  loading = false,
  showCancel = true,
  maxWidth = 'sm',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <WarningAmberIcon sx={{ fontSize: 48, color: 'warning.main' }} />;
      case 'danger':
        return <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />;
      case 'info':
        return <InfoIcon sx={{ fontSize: 48, color: 'info.main' }} />;
      default:
        return <HelpIcon sx={{ fontSize: 48, color: 'primary.main' }} />;
    }
  };

  const getConfirmColor = () => {
    if (confirmColor !== 'primary') return confirmColor;
    switch (type) {
      case 'danger':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {!loading && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {getIcon()}
          <DialogContentText sx={{ pt: 1 }}>
            {typeof message === 'string' ? message : message}
          </DialogContentText>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {showCancel && (
          <Button onClick={onClose} disabled={loading} color="inherit">
            {cancelText}
          </Button>
        )}
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={getConfirmColor()}
          disabled={loading}
          autoFocus
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;