// src/layouts/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Tooltip,
  Avatar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArticleIcon from '@mui/icons-material/Article';
import RuleIcon from '@mui/icons-material/Rule';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../context/AuthContext';
import { useAdapta } from '../context/AdaptaContext';
import { navigationConfig } from '../config/navigationConfig';

const Sidebar = ({ open, onToggle, drawerWidth, drawerWidthCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();
  const { currentUser } = useAdapta(); // Use currentUser from AdaptaContext

  // Icon mapping
  const iconMap = {
    DashboardIcon,
    BuildIcon,
    MedicationIcon,
    LocalHospitalIcon,
    ArticleIcon,
    RuleIcon,
    AccountTreeIcon,
    AdminPanelSettingsIcon,
    SettingsIcon,
  };

  // Filter menu items based on permissions
  const visibleMenuItems = navigationConfig.menuItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : drawerWidthCollapsed,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : drawerWidthCollapsed,
          boxSizing: 'border-box',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: 'hidden',
          // Glassmorphism effect
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(10, 10, 10, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRight: (theme) => theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.08)',
          // Gradient overlay
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)'
              : 'linear-gradient(180deg, rgba(25, 118, 210, 0.05) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          },
        },
      }}
    >
      {/* Logo Section with enhanced styling */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          minHeight: 64,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '10px',
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
              : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          }}
        >
          <LocalHospitalIcon sx={{ color: '#fff', fontSize: 24 }} />
        </Box>
        {open && (
          <Typography
            variant="h6"
            sx={{
              ml: 1.5,
              fontWeight: 700,
              background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
                : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ADAPTA
          </Typography>
        )}
      </Box>

      <Divider sx={{ opacity: 0.1 }} />

      {/* Enhanced User Info Section */}
      {open && currentUser && (
        <Box
          sx={{
            p: 2,
            mx: 1.5,
            my: 1,
            borderRadius: 2,
            position: 'relative',
            zIndex: 1,
            // Glassmorphic card
            background: (theme) => theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.02)',
            backdropFilter: 'blur(10px)',
            border: (theme) => theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)',
              transform: 'translateY(-2px)',
              boxShadow: (theme) => theme.palette.mode === 'dark'
                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                : '0 4px 12px rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              {currentUser.name?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentUser.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'capitalize',
                }}
              >
                {currentUser.role}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Divider sx={{ opacity: 0.1, my: 1 }} />

      {/* Enhanced Navigation Menu */}
      <List sx={{ flexGrow: 1, pt: 1, px: 1, position: 'relative', zIndex: 1 }}>
        {visibleMenuItems.map((item) => {
          const Icon = iconMap[item.icon];
          const active = isActive(item.path);

          return (
            <Tooltip
              key={item.id}
              title={open ? '' : item.label}
              placement="right"
              arrow
            >
              <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    mx: 0.5,
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    // Active state with glassmorphism and glow
                    bgcolor: active
                      ? (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'rgba(25, 118, 210, 0.1)'
                      : 'transparent',
                    color: active ? 'primary.main' : 'text.primary',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    // Glowing border for active item
                    border: active
                      ? (theme) => theme.palette.mode === 'dark'
                        ? '1px solid rgba(59, 130, 246, 0.3)'
                        : '1px solid rgba(25, 118, 210, 0.2)'
                      : '1px solid transparent',
                    boxShadow: active
                      ? (theme) => theme.palette.mode === 'dark'
                        ? '0 0 20px rgba(59, 130, 246, 0.2)'
                        : '0 0 20px rgba(25, 118, 210, 0.15)'
                      : 'none',
                    '&:hover': {
                      bgcolor: active
                        ? (theme) => theme.palette.mode === 'dark'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(25, 118, 210, 0.15)'
                        : (theme) => theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.04)',
                      transform: 'translateX(4px)',
                      borderColor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                    // Active indicator bar
                    '&::before': active ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: '60%',
                      borderRadius: '0 3px 3px 0',
                      background: (theme) => theme.palette.mode === 'dark'
                        ? 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)'
                        : 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
                      boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 0 10px rgba(59, 130, 246, 0.5)'
                        : '0 0 10px rgba(25, 118, 210, 0.3)',
                    } : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: active ? 'primary.main' : 'inherit',
                      transition: 'all 0.3s ease',
                      '& svg': {
                        fontSize: 22,
                        filter: active
                          ? (theme) => theme.palette.mode === 'dark'
                            ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
                            : 'drop-shadow(0 0 8px rgba(25, 118, 210, 0.3))'
                          : 'none',
                      },
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: active ? 600 : 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ opacity: 0.1 }} />

      {/* Enhanced Footer */}
      {open && (
        <Box
          sx={{
            p: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              opacity: 0.7,
              fontWeight: 500,
            }}
          >
            Version 1.0.0
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
