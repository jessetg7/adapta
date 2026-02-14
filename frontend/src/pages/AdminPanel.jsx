// src/pages/AdminPanel.jsx
import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Chip,
    Avatar,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Alert,
} from '@mui/material';
import {
    People as PeopleIcon,
    Settings as SettingsIcon,
    Security as SecurityIcon,
    Assessment as AssessmentIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
    AdminPanelSettings as AdminIcon,
    LocalHospital as DoctorIcon,
    MedicalServices as NurseIcon,
    Person as PatientIcon,
} from '@mui/icons-material';

const AdminPanel = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Dr. Sanjay Kumar',
            email: 'doctor@example.com',
            role: 'Doctor',
            department: 'General Medicine',
            status: 'Active',
            lastLogin: '2026-02-14 08:30',
            permissions: ['consultation.view', 'prescriptions.create', 'reports.view'],
        },
        {
            id: 2,
            name: 'Nurse Priya Sharma',
            email: 'nurse@example.com',
            role: 'Nurse',
            department: 'Emergency',
            status: 'Active',
            lastLogin: '2026-02-14 09:15',
            permissions: ['consultation.view', 'vitals.record'],
        },
        {
            id: 3,
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'Admin',
            department: 'Administration',
            status: 'Active',
            lastLogin: '2026-02-14 09:45',
            permissions: ['admin.access', 'users.manage', 'system.configure'],
        },
        {
            id: 4,
            name: 'Dr. Rajesh Patel',
            email: 'rajesh@example.com',
            role: 'Doctor',
            department: 'Cardiology',
            status: 'Inactive',
            lastLogin: '2026-02-10 14:20',
            permissions: ['consultation.view', 'prescriptions.create'],
        },
    ]);

    const [systemSettings, setSystemSettings] = useState({
        siteName: 'ADAPTA Health',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        language: 'English',
        sessionTimeout: 30,
        enableEmergencyMode: true,
        enableQRVerification: true,
        enableAIAlerts: true,
        maintenanceMode: false,
    });

    const statsData = {
        totalUsers: 4,
        activeUsers: 3,
        totalDoctors: 2,
        totalNurses: 1,
        totalAdmins: 1,
        systemUptime: '99.9%',
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setOpenUserDialog(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setOpenUserDialog(true);
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== userId));
        }
    };

    const handleToggleUserStatus = (userId) => {
        setUsers(users.map(u =>
            u.id === userId
                ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
                : u
        ));
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'Doctor': return <DoctorIcon />;
            case 'Nurse': return <NurseIcon />;
            case 'Admin': return <AdminIcon />;
            default: return <PatientIcon />;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Doctor': return 'primary';
            case 'Nurse': return 'success';
            case 'Admin': return 'error';
            default: return 'default';
        }
    };

    // Tab 1: User Management
    const UserManagementTab = () => (
        <Box>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Total Users</Typography>
                                    <Typography variant="h4" fontWeight="bold">{statsData.totalUsers}</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <PeopleIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Active Users</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="success.main">
                                        {statsData.activeUsers}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <CheckCircleIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Doctors</Typography>
                                    <Typography variant="h4" fontWeight="bold">{statsData.totalDoctors}</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.main' }}>
                                    <DoctorIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Nurses</Typography>
                                    <Typography variant="h4" fontWeight="bold">{statsData.totalNurses}</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'warning.main' }}>
                                    <NurseIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* User Table */}
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">User Management</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddUser}>
                        Add User
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                                <TableCell><strong>User</strong></TableCell>
                                <TableCell><strong>Role</strong></TableCell>
                                <TableCell><strong>Department</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Last Login</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar>{user.name.charAt(0)}</Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">{user.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={getRoleIcon(user.role)}
                                            label={user.role}
                                            color={getRoleColor(user.role)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{user.department}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.status}
                                            color={user.status === 'Active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption">{user.lastLogin}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" color="primary" onClick={() => handleEditUser(user)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color={user.status === 'Active' ? 'warning' : 'success'}
                                            onClick={() => handleToggleUserStatus(user.id)}
                                        >
                                            {user.status === 'Active' ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );

    // Tab 2: System Settings
    const SystemSettingsTab = () => (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>General Settings</Typography>
                    <Divider sx={{ mb: 3 }} />

                    <TextField
                        fullWidth
                        label="Site Name"
                        value={systemSettings.siteName}
                        onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                        sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Timezone</InputLabel>
                        <Select
                            value={systemSettings.timezone}
                            label="Timezone"
                            onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                        >
                            <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                            <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                            <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                            <MenuItem value="Asia/Tokyo">Asia/Tokyo (JST)</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Date Format</InputLabel>
                        <Select
                            value={systemSettings.dateFormat}
                            label="Date Format"
                            onChange={(e) => setSystemSettings({ ...systemSettings, dateFormat: e.target.value })}
                        >
                            <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                            <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                            <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={systemSettings.language}
                            label="Language"
                            onChange={(e) => setSystemSettings({ ...systemSettings, language: e.target.value })}
                        >
                            <MenuItem value="English">English</MenuItem>
                            <MenuItem value="Hindi">Hindi</MenuItem>
                            <MenuItem value="Spanish">Spanish</MenuItem>
                            <MenuItem value="French">French</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        type="number"
                        label="Session Timeout (minutes)"
                        value={systemSettings.sessionTimeout}
                        onChange={(e) => setSystemSettings({ ...systemSettings, sessionTimeout: e.target.value })}
                    />
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Feature Toggles</Typography>
                    <Divider sx={{ mb: 3 }} />

                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Emergency Mode"
                                secondary="Enable one-click emergency mode for critical situations"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={systemSettings.enableEmergencyMode}
                                        onChange={(e) => setSystemSettings({ ...systemSettings, enableEmergencyMode: e.target.checked })}
                                    />
                                }
                                label=""
                            />
                        </ListItem>
                        <Divider />

                        <ListItem>
                            <ListItemText
                                primary="QR Code Verification"
                                secondary="Enable QR code generation for prescriptions"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={systemSettings.enableQRVerification}
                                        onChange={(e) => setSystemSettings({ ...systemSettings, enableQRVerification: e.target.checked })}
                                    />
                                }
                                label=""
                            />
                        </ListItem>
                        <Divider />

                        <ListItem>
                            <ListItemText
                                primary="AI-Powered Alerts"
                                secondary="Enable ML-based pregnancy risk alerts"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={systemSettings.enableAIAlerts}
                                        onChange={(e) => setSystemSettings({ ...systemSettings, enableAIAlerts: e.target.checked })}
                                    />
                                }
                                label=""
                            />
                        </ListItem>
                        <Divider />

                        <ListItem>
                            <ListItemText
                                primary="Maintenance Mode"
                                secondary="Put system in maintenance mode (users cannot login)"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={systemSettings.maintenanceMode}
                                        onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                                        color="error"
                                    />
                                }
                                label=""
                            />
                        </ListItem>
                    </List>

                    <Box sx={{ mt: 3 }}>
                        <Button variant="contained" fullWidth>
                            Save Settings
                        </Button>
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Alert severity="info">
                    <strong>Note:</strong> Changes to system settings will take effect immediately. Some settings may require users to log out and log back in.
                </Alert>
            </Grid>
        </Grid>
    );

    // Tab 3: Permissions & Roles
    const PermissionsTab = () => (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Role Permissions</Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Doctor Role</Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="View patient consultations" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Create prescriptions" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Generate reports" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Access analytics" />
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Nurse Role</Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="View patient consultations" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Record vital signs" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><BlockIcon color="error" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Create prescriptions" secondary="Not allowed" />
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Admin Role</Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Full system access" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="User management" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="System configuration" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="View all analytics" />
                        </ListItem>
                    </List>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Permission Categories</Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                        Consultation Permissions
                    </Typography>
                    <List dense sx={{ mb: 2 }}>
                        <ListItem><ListItemText primary="• consultation.view" /></ListItem>
                        <ListItem><ListItemText primary="• consultation.create" /></ListItem>
                        <ListItem><ListItemText primary="• consultation.edit" /></ListItem>
                        <ListItem><ListItemText primary="• consultation.delete" /></ListItem>
                    </List>

                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                        Prescription Permissions
                    </Typography>
                    <List dense sx={{ mb: 2 }}>
                        <ListItem><ListItemText primary="• prescriptions.view" /></ListItem>
                        <ListItem><ListItemText primary="• prescriptions.create" /></ListItem>
                        <ListItem><ListItemText primary="• prescriptions.edit" /></ListItem>
                        <ListItem><ListItemText primary="• prescriptions.verify" /></ListItem>
                    </List>

                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                        Admin Permissions
                    </Typography>
                    <List dense sx={{ mb: 2 }}>
                        <ListItem><ListItemText primary="• admin.access" /></ListItem>
                        <ListItem><ListItemText primary="• users.manage" /></ListItem>
                        <ListItem><ListItemText primary="• system.configure" /></ListItem>
                        <ListItem><ListItemText primary="• reports.export" /></ListItem>
                    </List>

                    <Button variant="outlined" fullWidth>
                        Manage Custom Permissions
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );

    // Tab 4: System Analytics
    const SystemAnalyticsTab = () => (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>System Health</Typography>
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <Typography variant="h2" fontWeight="bold" color="success.main">
                                {statsData.systemUptime}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Uptime</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <List dense>
                            <ListItem>
                                <ListItemText primary="CPU Usage" secondary="45%" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Memory Usage" secondary="62%" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Disk Space" secondary="78% used" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Database Size" secondary="2.4 GB" />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Activity</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="New user registered: Dr. Amit Verma"
                                secondary="2 hours ago"
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="System settings updated by Admin"
                                secondary="5 hours ago"
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="Database backup completed successfully"
                                secondary="1 day ago"
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="Security patch applied: v1.2.3"
                                secondary="2 days ago"
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="50 new prescriptions generated"
                                secondary="Today"
                            />
                        </ListItem>
                    </List>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Alert severity="success">
                    <strong>System Status:</strong> All services are running normally. Last backup: 2 hours ago.
                </Alert>
            </Grid>
        </Grid>
    );

    // User Dialog
    const UserDialog = () => (
        <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        defaultValue={selectedUser?.name || ''}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        defaultValue={selectedUser?.email || ''}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Role</InputLabel>
                        <Select defaultValue={selectedUser?.role || 'Doctor'} label="Role">
                            <MenuItem value="Doctor">Doctor</MenuItem>
                            <MenuItem value="Nurse">Nurse</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Receptionist">Receptionist</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Department</InputLabel>
                        <Select defaultValue={selectedUser?.department || 'General Medicine'} label="Department">
                            <MenuItem value="General Medicine">General Medicine</MenuItem>
                            <MenuItem value="Cardiology">Cardiology</MenuItem>
                            <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                            <MenuItem value="Emergency">Emergency</MenuItem>
                            <MenuItem value="Administration">Administration</MenuItem>
                        </Select>
                    </FormControl>
                    {!selectedUser && (
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            sx={{ mb: 2 }}
                        />
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
                <Button variant="contained" onClick={() => setOpenUserDialog(false)}>
                    {selectedUser ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Admin Panel
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage users, configure system settings, and monitor platform health
                </Typography>
            </Box>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={(e, newValue) => setCurrentTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab icon={<PeopleIcon />} label="User Management" />
                    <Tab icon={<SettingsIcon />} label="System Settings" />
                    <Tab icon={<SecurityIcon />} label="Permissions & Roles" />
                    <Tab icon={<AssessmentIcon />} label="System Analytics" />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            <Box>
                {currentTab === 0 && <UserManagementTab />}
                {currentTab === 1 && <SystemSettingsTab />}
                {currentTab === 2 && <PermissionsTab />}
                {currentTab === 3 && <SystemAnalyticsTab />}
            </Box>

            {/* User Dialog */}
            <UserDialog />
        </Box>
    );
};

export default AdminPanel;
