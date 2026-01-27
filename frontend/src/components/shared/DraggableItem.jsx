// src/components/shared/DraggableItem.jsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Box, Paper, IconButton, Typography } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

/**
 * Generic Draggable Item Component
 */
const DraggableItem = ({
  id,
  data = {},
  children,
  handle = true,
  disabled = false,
  sx = {},
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data,
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: disabled ? 'default' : 'grab',
  };

  // If handle is true, only the handle icon triggers drag
  const dragProps = handle ? {} : { ...listeners, ...attributes };
  const handleProps = handle ? { ...listeners, ...attributes } : {};

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...dragProps}
      sx={{
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: disabled ? 1 : 3,
        },
        ...sx,
      }}
    >
      {handle && !disabled && (
        <IconButton
          size="small"
          {...handleProps}
          sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
      )}
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Paper>
  );
};

export default DraggableItem;