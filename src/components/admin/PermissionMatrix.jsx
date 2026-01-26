import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox
} from '@mui/material';

const permissions = [
  { id: 'view_templates', name: 'View Templates' },
  { id: 'create_templates', name: 'Create Templates' },
  { id: 'edit_templates', name: 'Edit Templates' },
  { id: 'delete_templates', name: 'Delete Templates' },
  { id: 'view_workflows', name: 'View Workflows' },
  { id: 'manage_workflows', name: 'Manage Workflows' }
];

const roles = ['Admin', 'Doctor', 'Nurse', 'Staff'];

const matrix = {
  Admin: ['view_templates', 'create_templates', 'edit_templates', 'delete_templates', 'view_workflows', 'manage_workflows'],
  Doctor: ['view_templates', 'create_templates', 'edit_templates', 'view_workflows'],
  Nurse: ['view_templates', 'view_workflows'],
  Staff: ['view_templates']
};

const PermissionMatrix = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Permission Matrix
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Permission</TableCell>
                {roles.map((role) => (
                  <TableCell key={role} align="center">{role}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>{permission.name}</TableCell>
                  {roles.map((role) => (
                    <TableCell key={role} align="center">
                      <Checkbox
                        checked={matrix[role]?.includes(permission.id)}
                        size="small"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default PermissionMatrix;