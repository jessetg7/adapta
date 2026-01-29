// src/pages/Dashboard.jsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import MedicationIcon from '@mui/icons-material/Medication';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import RuleIcon from '@mui/icons-material/Rule';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import useTemplateStore from '../core/store/useTemplateStore';
import usePatientStore from '../core/store/usePatientStore';
import useRuleStore from '../core/store/useRuleStore';
import useWorkflowStore from '../core/store/useWorkflowStore';

// New Components
import AnimatedStatCard from '../components/shared/AnimatedStatCard';
import ActivityFeed from '../components/shared/ActivityFeed';
import PatientTrendsChart from '../components/shared/PatientTrendsChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const { templates } = useTemplateStore();
  const { patients, visits, prescriptions } = usePatientStore();
  const { rules } = useRuleStore();
  const { workflows } = useWorkflowStore();

  // Stats
  const stats = useMemo(() => ({
    templates: Object.keys(templates).length,
    patients: Object.keys(patients).length,
    prescriptions: Object.keys(prescriptions).length,
    rules: Object.keys(rules).length,
    workflows: Object.keys(workflows).length,
    visits: Object.keys(visits).length,
  }), [templates, patients, prescriptions, rules, workflows, visits]);

  // Recent patients
  const recentPatients = useMemo(() => {
    return Object.values(patients)
      .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
      .slice(0, 5);
  }, [patients]);

  // Quick actions
  const quickActions = [
    {
      title: 'Form Builder',
      description: 'Create and edit medical forms',
      icon: <BuildIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      path: '/form-builder',
    },
    {
      title: 'Prescription Builder',
      description: 'Design prescription layouts',
      icon: <MedicationIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      path: '/prescription-builder',
    },
    {
      title: 'Patient Consultation',
      description: 'Start a new consultation',
      icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      path: '/consultation',
    },
    {
      title: 'Template Manager',
      description: 'Manage all form templates',
      icon: <ArticleIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      path: '/templates',
    },
    {
      title: 'Rule Engine',
      description: 'Configure business rules',
      icon: <RuleIcon sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      path: '/rules',
    },
    {
      title: 'Workflow Manager',
      description: 'Design patient workflows',
      icon: <AccountTreeIcon sx={{ fontSize: 40 }} />,
      color: '#0288d1',
      path: '/workflows',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <LocalHospitalIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            ADAPTA
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Low-Code Medical Forms Platform
          </Typography>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
              : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white'
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Welcome to ADAPTA
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Build, customize, and manage medical forms and prescriptions without writing code.
                Everything is template-driven and fully configurable.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                size="large"
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                onClick={() => navigate('/consultation')}
              >
                Start Consultation
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Animated Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Total Patients', value: stats.patients, icon: <PeopleIcon />, color: '#2e7d32', trend: 'up', trendValue: 12 },
            { label: 'Consultations', value: stats.visits, icon: <EventIcon />, color: '#1976d2', trend: 'up', trendValue: 8 },
            { label: 'Prescriptions', value: stats.prescriptions, icon: <MedicationIcon />, color: '#9c27b0', trend: 'up', trendValue: 15 },
            { label: 'Templates', value: stats.templates, icon: <ArticleIcon />, color: '#ed6c02', trend: null },
          ].map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <AnimatedStatCard
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                trend={stat.trend}
                trendValue={stat.trendValue}
              />
            </Grid>
          ))}
        </Grid>

        {/* Charts and Activity Feed */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Patient Trends Chart */}
          <Grid item xs={12} lg={8}>
            <PatientTrendsChart />
          </Grid>

          {/* Activity Feed */}
          <Grid item xs={12} lg={4}>
            <ActivityFeed />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action) => (
                <Grid item xs={12} sm={6} md={4} key={action.title}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent>
                      <Box sx={{ color: action.color, mb: 2 }}>
                        {action.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Recent Patients */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Recent Patients
            </Typography>
            <Paper>
              {recentPatients.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No patients registered yet
                  </Typography>
                </Box>
              ) : (
                <List>
                  {recentPatients.map((patient, index) => (
                    <React.Fragment key={patient.id}>
                      {index > 0 && <Divider />}
                      <ListItem
                        button
                        onClick={() => navigate(`/consultation/${patient.id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: patient.gender === 'female' ? '#e91e63' : '#1976d2' }}>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${patient.firstName} ${patient.lastName}`}
                          secondary={
                            <>
                              {patient.gender} • {patient.phone}
                            </>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
              <CardActions>
                <Button
                  size="small"
                  fullWidth
                  onClick={() => navigate('/consultation')}
                >
                  View All Patients
                </Button>
              </CardActions>
            </Paper>
          </Grid>
        </Grid>

        {/* LCNC Features Banner */}
        <Paper sx={{ p: 3, mt: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            🚀 True Low-Code / No-Code Features
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              '✅ Zero Hardcoding - Everything is JSON-driven',
              '✅ Drag & Drop Form Builder',
              '✅ Visual Rule Engine',
              '✅ Workflow Designer',
              '✅ Gender & Age Specific Templates',
              '✅ Printable Prescriptions',
              '✅ Real-time Rule Evaluation',
              '✅ Template Versioning',
            ].map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature}>
                <Chip label={feature} variant="outlined" sx={{ width: '100%', justifyContent: 'flex-start' }} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;