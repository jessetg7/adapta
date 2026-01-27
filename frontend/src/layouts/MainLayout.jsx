// src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 70;

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        open={sidebarOpen} 
        onToggle={handleToggleSidebar}
        drawerWidth={DRAWER_WIDTH}
        drawerWidthCollapsed={DRAWER_WIDTH_COLLAPSED}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          // Use standard MUI transitions for smooth resizing
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          // Calculate width based on sidebar state
          width: sidebarOpen 
            ? `calc(100% - ${DRAWER_WIDTH}px)` 
            : `calc(100% - ${DRAWER_WIDTH_COLLAPSED}px)`,
        }}
      >
        <TopBar onToggleSidebar={handleToggleSidebar} sidebarOpen={sidebarOpen} />
        
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: 'grey.50',
            // Ensure content takes up at least the screen height minus the TopBar (approx 64px)
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto', // Adds scroll to content if needed
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;