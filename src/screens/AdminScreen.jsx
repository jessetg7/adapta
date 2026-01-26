import React from 'react';
import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Avatar, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox } from '@mui/material';
import { AdminPanelSettings as AdminIcon, LocalHospital as DoctorIcon, HealthAndSafety as NurseIcon, Person as StaffIcon } from '@mui/icons-material';

const roles = [
  { id: 'admin', name: 'Admin', icon: AdminIcon, color: '#e53935', users: 2 },
  { id: 'doctor', name: 'Doctor', icon: DoctorIcon, color: '#1976d2', users: 15 },
  { id: 'nurse', name: 'Nurse', icon: NurseIcon, color: '#43a047', users: 28 },
  { id: 'staff', name: 'Staff', icon: StaffIcon, color: '#ff9800', users: 12 },
];

const permissions = ['View Templates', 'Create Templates', 'Edit Templates', 'Delete Templates', 'Manage Workflows', 'View Audit'];
const matrix = {
  Admin: [true, true, true, true, true, true],
  Doctor: [true, true, true, false, true, false],
  Nurse: [true, false, false, false, false, false],
  Staff: [true, false, false, false, false, false],
};

function AdminScreen() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Admin Panel</Typography>
        <Typography color="text.secondary">Manage roles and permissions</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Roles</Typography>
              <List>
                {roles.map((role) => (
                  <ListItem key={role.id} sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${role.color}22`, color: role.color }}><role.icon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={role.name} secondary={`${role.users} users`} />
                    <Chip label="Active" size="small" color="success" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Permission Matrix</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Permission</TableCell>
                      {roles.map((r) => <TableCell key={r.id} align="center">{r.name}</TableCell>)}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {permissions.map((perm, i) => (
                      <TableRow key={perm}>
                        <TableCell>{perm}</TableCell>
                        {roles.map((r) => (
                          <TableCell key={r.id} align="center">
                            <Checkbox checked={matrix[r.name]?.[i] || false} size="small" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminScreen;