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
  Button,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import RuleIcon from '@mui/icons-material/Rule';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MedicationIcon from '@mui/icons-material/Medication';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WavingHandIcon from '@mui/icons-material/WavingHand';

import { useAdapta } from '../context/AdaptaContext';
import useTemplateStore from '../core/store/useTemplateStore';
import usePatientStore from '../core/store/usePatientStore';
import useRuleStore from '../core/store/useRuleStore';
import useWorkflowStore from '../core/store/useWorkflowStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { templates } = useTemplateStore();
  const { patients, visits, prescriptions } = usePatientStore();
  const { rules } = useRuleStore();
  const { workflows } = useWorkflowStore();
  const { clinicInfo } = useAdapta();

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
      title: 'New Consultation',
      description: 'Start OPD consultation',
      icon: <LocalHospitalIcon sx={{ fontSize: 32 }} />,
      bgcolor: 'primary.main', // Solid Blue/Teal
      path: '/consultation',
    },
    {
      title: 'Patient Billing',
      description: 'Generate invoices',
      icon: <ReceiptLongIcon sx={{ fontSize: 32 }} />,
      bgcolor: 'secondary.main', // Solid Purple/Slate
      path: '/billing',
    },
    {
      title: 'Form Builder',
      description: 'Create templates',
      icon: <ArticleIcon sx={{ fontSize: 32 }} />,
      bgcolor: 'info.main', // Solid Blue
      path: '/form-builder',
    },
    {
      title: 'Prescription',
      description: 'Create prescriptions',
      icon: <MedicationIcon sx={{ fontSize: 32 }} />,
      bgcolor: 'success.main', // Solid Green
      path: '/prescription-builder',
    },
    {
      title: 'Rule Engine',
      description: 'Configure rules',
      icon: <RuleIcon sx={{ fontSize: 32 }} />,
      bgcolor: 'warning.main', // Solid Orange/Yellow
      path: '/rules',
    },
    {
      title: 'Workflows',
      description: 'Design workflows',
      icon: <AccountTreeIcon sx={{ fontSize: 32 }} />,
      bgcolor: 'error.main', // Solid Red (or deep purple)
      path: '/workflows',
    },
  ];

  // Stat card component
  const StatCard = ({ label, value, icon, color, trend }) => (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        bgcolor: color, // Solid Color
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4, // 16px
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          bgcolor: alpha('#fff', 0.1),
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, color: 'inherit' }}>
              {label}
            </Typography>
            <Typography variant="h3" fontWeight={700} sx={{ color: 'inherit' }}>
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">
                  +{trend}% this month
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ opacity: 0.3, fontSize: 48 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', flexGrow: 1, pb: 6 }}>

      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          py: 6,
          px: 3,
          mb: 4,
          borderRadius: 0,
          bgcolor: '#0288d1', // Solid Light Blue Shade
          color: 'white',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WavingHandIcon sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h3" fontWeight={700} sx={{ color: 'inherit' }}>
              Welcome to ADAPTA
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.95, maxWidth: 800, color: 'inherit' }}>
            Your complete hospital management system. Manage patients, consultations, billing, and more—all in one place.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<LocalHospitalIcon />}
              onClick={() => navigate('/consultation')}
              sx={{
                bgcolor: 'background.paper',

                color: 'primary.main',
                '&:hover': { bgcolor: alpha('#fff', 0.9) },
                boxShadow: 3
              }}
            >
              Start Consultation
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/form-builder')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Customize Forms
            </Button>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl">
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total Patients"
              value={stats.patients}
              icon={<PeopleIcon />}
              color="#2e7d32"
              trend={12}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Consultations"
              value={stats.visits}
              icon={<EventIcon />}
              color="#1976d2"
              trend={8}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Prescriptions"
              value={stats.prescriptions}
              icon={<MedicationIcon />}
              color="#9c27b0"
              trend={15}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Active Templates"
              value={stats.templates}
              icon={<ArticleIcon />}
              color="#ed6c02"
            />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action) => (
              <Grid item xs={12} sm={6} md={4} key={action.title}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: 4, // 16px
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: action.bgcolor, // Use solid color
                        color: 'white',
                        mb: 2
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'primary.main' }}>
                      <Typography variant="body2" fontWeight={600}>
                        Open
                      </Typography>
                      <ArrowForwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {/* Recent Patients */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                  Recent Patients
                </Typography>
                {recentPatients.length === 0 ? (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.3, mb: 1 }} />
                    <Typography color="text.secondary">
                      No patients registered yet
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => navigate('/consultation')}
                    >
                      Register First Patient
                    </Button>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {recentPatients.map((patient, index) => (
                      <React.Fragment key={patient.id}>
                        {index > 0 && <Divider />}
                        <ListItem
                          button
                          onClick={() => navigate(`/consultation/${patient.id}`)}
                          sx={{
                            borderRadius: 1,
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: patient.gender === 'female' ? '#e91e63' : '#1976d2' }}>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${patient.firstName} ${patient.lastName}`}
                            secondary={`${patient.gender} • ${patient.phone}`}
                            primaryTypographyProps={{ fontWeight: 600 }}
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* System Overview */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                  System Overview
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Templates Created
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {stats.templates} / 20
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.templates / 20) * 100}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Active Rules
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {stats.rules} / 15
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.rules / 15) * 100}
                    sx={{ height: 8, borderRadius: 1 }}
                    color="secondary"
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Workflows Configured
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {stats.workflows} / 10
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.workflows / 10) * 100}
                    sx={{ height: 8, borderRadius: 1 }}
                    color="success"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Features Banner */}
        <Paper elevation={0} sx={{ p: 3, mt: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
            🚀 Platform Features
          </Typography>
          <Grid container spacing={1.5}>
            {[
              'Zero Hardcoding - Everything JSON-driven',
              'Drag & Drop Form Builder',
              'Visual Rule Engine',
              'Workflow Designer',
              'Gender & Age Specific Templates',
              'Printable Prescriptions',
              'Real-time Rule Evaluation',
              'Template Versioning',
            ].map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature}>
                <Chip
                  label={feature}
                  variant="outlined"
                  size="small"
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    fontWeight: 500
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;