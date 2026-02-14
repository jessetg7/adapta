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
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
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
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d7377 0%, #14FFEC 100%)',
        position: 'relative',
        p: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 100%)',
        },
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LocalHospitalIcon
              sx={{ fontSize: 64, color: 'primary.main', mb: 1 }}
            />
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#334155' }}>
              ADAPTA
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Medical Forms Platform
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
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
              sx={{ mb: 2 }}
              autoComplete="email"
              InputLabelProps={{ sx: { color: '#64748b' } }}
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
              InputLabelProps={{ sx: { color: '#64748b' } }}
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
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f1f5f9', borderRadius: 1, border: '1px solid #e2e8f0' }}>
            <Typography variant="caption" fontWeight={600} display="block" gutterBottom sx={{ color: '#1e293b' }}>
              Demo Credentials:
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: '#334155', mb: 0.5 }}>
              Admin: admin@adapta.com / admin123
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: '#334155', mb: 0.5 }}>
              Doctor: doctor@adapta.com / doctor123
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: '#334155', mb: 0.5 }}>
              Nurse: nurse@adapta.com / nurse123
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: '#334155' }}>
              Receptionist: receptionist@adapta.com / receptionist123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;