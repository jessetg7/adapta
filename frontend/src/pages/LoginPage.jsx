// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const LoginPage = () => {
  const { login } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Theme Toggle Button */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10,
          bgcolor: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            bgcolor: (theme) => theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>

      <Container maxWidth="lg" sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <Grid container spacing={0} alignItems="center">
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6} sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            pr: 6,
          }}>
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 3,
                  background: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(25, 118, 210, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: (theme) => theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(25, 118, 210, 0.2)',
                  mb: 3,
                }}
              >
                <MedicalServicesIcon
                  sx={{
                    fontSize: 48,
                    color: 'primary.main',
                  }}
                />
              </Box>

              <Typography
                variant="h2"
                fontWeight={700}
                sx={{
                  color: 'text.primary',
                  mb: 2,
                }}
              >
                ADAPTA
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  mb: 3,
                  fontWeight: 300,
                }}
              >
                Medical Forms Platform
              </Typography>

            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                maxWidth: 480,
                mx: { xs: 2, md: 0 },
                ml: { md: 'auto' },
                // Professional glassmorphism with theme awareness
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(18, 18, 18, 0.8)'
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: (theme) => theme.palette.mode === 'dark'
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: (theme) => theme.palette.mode === 'dark'
                  ? '0 20px 60px rgba(0, 0, 0, 0.5)'
                  : '0 20px 60px rgba(0, 0, 0, 0.15)',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                {/* Mobile Logo */}
                <Box sx={{
                  display: { xs: 'block', md: 'none' },
                  textAlign: 'center',
                  mb: 4,
                }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'primary.main',
                      mb: 2,
                    }}
                  >
                    <LocalHospitalIcon sx={{ fontSize: 40, color: '#fff' }} />
                  </Box>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    ADAPTA
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Medical Forms Platform
                  </Typography>
                </Box>

                {/* Welcome Text */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Welcome Back
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sign in to access your medical dashboard
                  </Typography>
                </Box>

                {/* Error Alert */}
                {error && (
                  <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                  >
                    {error}
                  </Alert>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ mb: 2.5 }}
                    autoComplete="email"
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ mb: 3 }}
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Sign In'}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <Box
                  sx={{
                    mt: 4,
                    p: 2.5,
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(25, 118, 210, 0.05)',
                    borderRadius: 2,
                    border: (theme) => theme.palette.mode === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(25, 118, 210, 0.1)',
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    display="block"
                    gutterBottom
                    sx={{
                      color: 'text.primary',
                      mb: 1.5,
                    }}
                  >
                    Demo Credentials:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {[
                      'Admin: admin@adapta.com / admin123',
                      'Doctor: doctor@adapta.com / doctor123',
                      'Nurse: nurse@adapta.com / nurse123',
                      'Receptionist: receptionist@adapta.com / receptionist123',
                    ].map((cred) => (
                      <Typography
                        key={cred}
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {cred}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
