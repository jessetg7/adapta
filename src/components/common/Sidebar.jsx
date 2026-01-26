import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Tooltip,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as TemplatesIcon,
  Build as BuilderIcon,
  AccountTree as WorkflowIcon,
  Rule as RulesIcon,
  History as AuditIcon,
  AdminPanelSettings as AdminIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  LocalHospital as HospitalIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    path: '/dashboard'
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: TemplatesIcon,
    path: '/templates'
  },
  {
    id: 'form-builder',
    label: 'Form Builder',
    icon: BuilderIcon,
    path: '/form-builder'
  },
  {
    id: 'workflows',
    label: 'Workflows',
    icon: WorkflowIcon,
    path: '/workflows'
  },
  {
    id: 'rules',
    label: 'Rules Engine',
    icon: RulesIcon,
    path: '/rules'
  },
  {
    id: 'audit',
    label: 'Audit Logs',
    icon: AuditIcon,
    path: '/audit'
  },
  {
    id: 'admin',
    label: 'Admin Panel',
    icon: AdminIcon,
    path: '/admin',
    roles: ['Admin']
  }
];

const Sidebar = ({
  open,
  collapsed,
  onClose,
  onToggleCollapse,
  drawerWidth,
  collapsedWidth,
  isMobile
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper'
      }}
    >
      {/* Logo Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          p: 2,
          minHeight: 64,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 40,
                height: 40
              }}
            >
              <HospitalIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ADAPTA
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hospital Platform
              </Typography>
            </Box>
          </Box>
        )}
        {collapsed && (
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40
            }}
          >
            <HospitalIcon />
          </Avatar>
        )}
        {!isMobile && (
          <IconButton onClick={onToggleCollapse} size="small">
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', py: 2 }}>
        <List>
          {menuItems.map((item) => {
            // Check role-based access
            if (item.roles && !item.roles.some(role => hasRole(role))) {
              return null;
            }

            const isActive = location.pathname === item.path || 
                           location.pathname.startsWith(item.path + '/');
            const Icon = item.icon;

            return (
              <ListItem key={item.id} disablePadding sx={{ px: 1, mb: 0.5 }}>
                <Tooltip title={collapsed ? item.label : ''} placement="right">
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 2,
                      minHeight: 48,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      bgcolor: isActive ? 'primary.light' : 'transparent',
                      color: isActive ? 'primary.main' : 'text.primary',
                      '&:hover': {
                        bgcolor: isActive ? 'primary.light' : 'action.hover'
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed ? 0 : 40,
                        color: isActive ? 'primary.main' : 'text.secondary',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon />
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: isActive ? 600 : 400
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Section */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        {!collapsed ? (
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 1.5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'grey.50'
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  width: 36,
                  height: 36,
                  fontSize: '0.9rem'
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user?.role || 'Guest'}
                </Typography>
              </Box>
            </Box>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.lighter'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Tooltip title={user?.name || 'User'} placement="right">
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  width: 36,
                  height: 36,
                  fontSize: '0.9rem'
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </Tooltip>
            <Tooltip title="Logout" placement="right">
              <IconButton onClick={handleLogout} color="error" size="small">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: currentWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: 'hidden'
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;