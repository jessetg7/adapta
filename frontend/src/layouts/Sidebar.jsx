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
  alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArticleIcon from '@mui/icons-material/Article';
import RuleIcon from '@mui/icons-material/Rule';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { useAuth } from '../context/AuthContext';
import { navigationConfig } from '../config/navigationConfig';

const Sidebar = ({ open, onToggle, drawerWidth, drawerWidthCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasPermission } = useAuth();

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
    ReceiptLongIcon,
    MonitorHeartIcon,
    AssessmentIcon,
    QrCodeIcon,
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
    // Handle nested routes like /consultation/:patientId
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
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
          borderRight: '1px dashed',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: 'none',
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          minHeight: 64,
          mb: 1
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 3,
            bgcolor: 'primary.main', // Solid Medical Teal
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 128, 128, 0.3)',
            flexShrink: 0,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 6px 16px rgba(0, 128, 128, 0.4)',
            }
          }}
        >
          <LocalHospitalIcon sx={{ color: 'white' }} />
        </Box>
        {open && (
          <Box sx={{ ml: 2, overflow: 'hidden' }}>
            <Typography variant="h6" noWrap sx={{ fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>
              ADAPTA
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Medical Platform
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 2, mx: 2 }} />

      {/* Menu Items */}
      <List sx={{ px: 1 }}>
        {visibleMenuItems.map((item) => {
          const Icon = iconMap[item.icon];
          const active = isActive(item.path);

          return (
            <Tooltip
              key={item.path}
              title={!open ? item.label : ''}
              placement="right"
            >
              <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: 3, // 12px pill shape
                    mx: 1,
                    mb: 0.5,
                    color: active ? 'primary.main' : 'text.secondary',
                    bgcolor: active ? alpha('#008080', 0.1) : 'transparent',
                    fontWeight: active ? 700 : 500,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: -4,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 4,
                      height: 24,
                      borderRadius: '0 4px 4px 0',
                      bgcolor: 'primary.main',
                      display: active && open ? 'block' : 'none'
                    },
                    '&:hover': {
                      bgcolor: active ? alpha('#008080', 0.15) : 'action.hover',
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: active ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {Icon ? <Icon /> : <DashboardIcon />}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    sx={{
                      opacity: open ? 1 : 0,
                      '& .MuiTypography-root': {
                        fontWeight: active ? 700 : 500,
                        fontSize: '0.9rem'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      {/* User Info at Bottom */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Box
          sx={{
            p: open ? 1.5 : 0.5,
            borderRadius: 3,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'flex-start' : 'center',
            cursor: 'pointer',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.2s',
            '&:hover': { borderColor: 'primary.main', bgcolor: 'background.paper', boxShadow: 1 }
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'secondary.main',
              fontSize: '0.875rem'
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>

          {open && (
            <Box sx={{ ml: 1.5, overflow: 'hidden' }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" noWrap color="text.secondary">
                {user?.role || 'Guest'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;