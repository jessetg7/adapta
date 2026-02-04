// src/components/shared/DroppableZone.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

/**
 * Generic Droppable Zone Component
 */
const DroppableZone = ({
  id,
  data = {},
  children,
  placeholder = 'Drop items here',
  showPlaceholder = true,
  disabled = false,
  sx = {},
}) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id,
    data,
    disabled,
  });

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minHeight: 100,
        p: 2,
        borderRadius: 1,
        border: '2px dashed',
        borderColor: isOver ? 'primary.main' : 'divider',
        bgcolor: isOver ? 'primary.50' : 'transparent',
        transition: 'all 0.2s ease',
        ...sx,
      }}
    >
      {children}

      {isEmpty && showPlaceholder && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            color: 'text.secondary',
          }}
        >
          <AddIcon sx={{ fontSize: 32, mb: 1, opacity: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {placeholder}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DroppableZone;