import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  AdminPanelSettings as AdminIcon,
  LocalHospital as DoctorIcon,
  HealthAndSafety as NurseIcon,
  Person as StaffIcon
} from '@mui/icons-material';

const roles = [
  { id: 'admin', name: 'Admin', icon: AdminIcon, color: '#e53935', users: 2 },
  { id: 'doctor', name: 'Doctor', icon: DoctorIcon, color: '#1976d2', users: 15 },
  { id: 'nurse', name: 'Nurse', icon: NurseIcon, color: '#43a047', users: 28 },
  { id: 'staff', name: 'Staff', icon: StaffIcon, color: '#ff9800', users: 12 }
];

const RoleManager = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Role Management
        </Typography>
        <List>
          {roles.map((role) => (
            <ListItem
              key={role.id}
              secondaryAction={
                <IconButton edge="end">
                  <EditIcon />
                </IconButton>
              }
              sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: `${role.color}22`, color: role.color }}>
                  <role.icon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={role.name}
                secondary={`${role.users} users`}
              />
              <Chip label="Active" size="small" color="success" sx={{ mr: 1 }} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RoleManager;