import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Button } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PageLayout = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = null,
  children
}) => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          {breadcrumbs.map((crumb, index) => (
            <Link
              key={index}
              color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
              href={crumb.path}
              onClick={(e) => {
                e.preventDefault();
                if (crumb.path) navigate(crumb.path);
              }}
              underline={index === breadcrumbs.length - 1 ? 'none' : 'hover'}
              sx={{
                cursor: crumb.path ? 'pointer' : 'default',
                fontWeight: index === breadcrumbs.length - 1 ? 600 : 400
              }}
            >
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {actions}
          </Box>
        )}
      </Box>

      {/* Content */}
      {children}
    </Box>
  );
};

export default PageLayout;