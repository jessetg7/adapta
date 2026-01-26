import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Avatar, Button, Chip } from '@mui/material';
import {
  Description as TemplatesIcon,
  AccountTree as WorkflowIcon,
  Rule as RulesIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../context/FormContext';

function DashboardScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { templates } = useForm();

  const stats = [
    { title: 'Templates', value: templates.length, icon: TemplatesIcon, color: '#1976d2' },
    { title: 'Workflows', value: 3, icon: WorkflowIcon, color: '#43a047' },
    { title: 'Rules', value: 12, icon: RulesIcon, color: '#ff9800' },
    { title: 'Submissions', value: 847, icon: AssignmentIcon, color: '#9c27b0' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
        </Typography>
        <Typography color="text.secondary">
          Here's what's happening with your hospital platform today.
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/form-builder')}>
          Create Template
        </Button>
        <Button variant="outlined" startIcon={<TemplatesIcon />} onClick={() => navigate('/templates')}>
          View Templates
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }, transition: 'all 0.2s' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}22`, color: stat.color }}>
                    <stat.icon />
                  </Avatar>
                  <Chip label="+12%" size="small" sx={{ bgcolor: '#e8f5e9', color: '#43a047' }} />
                </Box>
                <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
                <Typography color="text.secondary">{stat.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Templates</Typography>
          <Grid container spacing={2}>
            {templates.slice(0, 3).map((template) => (
              <Grid item xs={12} md={4} key={template.id}>
                <Card variant="outlined" sx={{ cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }} onClick={() => navigate(`/form-builder/${template.id}`)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar sx={{ bgcolor: `${template.color}22`, color: template.color, width: 32, height: 32 }}>
                        <TemplatesIcon fontSize="small" />
                      </Avatar>
                      <Typography fontWeight={600}>{template.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">{template.description}</Typography>
                    <Chip label={template.category} size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DashboardScreen;