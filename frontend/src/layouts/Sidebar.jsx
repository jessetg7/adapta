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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArticleIcon from '@mui/icons-material/Article';
import RuleIcon from '@mui/icons-material/Rule';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
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
          borderRight: '1px solid',
          borderColor: 'divider',
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
        }}
      >
        <LocalHospitalIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        {open && (
          <Typography
            variant="h6"
            sx={{ ml: 1.5, fontWeight: 700, color: 'primary.main' }}
          >
            ADAPTA
          </Typography>
        )}
      </Box>
      <Divider />
      {/* User Info */}
      {open && user && (
        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="body2" fontWeight={600}>
            {user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.role}
          </Typography>
        </Box>
      )}
      <Divider />
      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, pt: 1 }}>
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
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    bgcolor: active ? 'primary.light' : 'transparent',
                    color: active ? 'primary.main' : 'text.primary',
                    '&:hover': {
                      bgcolor: active ? 'primary.light' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: active ? 'primary.main' : 'inherit',
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: active ? 600 : 400,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>
      <Divider />
      {/* Footer */}
      {open && (
        <Box sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Version 1.0.0
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};
export default Sidebar;