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
        p: 2,
        position: 'relative',
        overflow: 'hidden',
        // Animated mesh gradient background
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      {/* Floating particles effect */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
          '&::before': {
            width: 300,
            height: 300,
            top: '10%',
            left: '10%',
            animation: 'float 8s ease-in-out infinite',
          },
          '&::after': {
            width: 200,
            height: 200,
            bottom: '15%',
            right: '15%',
            animation: 'float 6s ease-in-out infinite reverse',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(30px, -30px)' },
          },
        }}
      />

      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          position: 'relative',
          zIndex: 1,
          // Glassmorphism effect
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          // Floating animation
          animation: 'cardFloat 3s ease-in-out infinite',
          '@keyframes cardFloat': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                mb: 2,
                animation: 'iconGlow 2s ease-in-out infinite',
                '@keyframes iconGlow': {
                  '0%, 100%': {
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
                  },
                  '50%': {
                    boxShadow: '0 0 40px rgba(99, 102, 241, 0.8)'
                  },
                },
              }}
            >
              <LocalHospitalIcon
                sx={{ fontSize: 64, color: '#fff' }}
              />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
              ADAPTA
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Medical Forms Platform
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(211, 47, 47, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(211, 47, 47, 0.3)',
                color: '#fff',
              }}
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
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.8)',
                },
              }}
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.8)',
                },
              }}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
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
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontWeight: 600,
                py: 1.5,
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  boxShadow: '0 6px 30px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography variant="caption" fontWeight={600} display="block" gutterBottom sx={{ color: '#fff' }}>
              Demo Credentials:
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Admin: admin@adapta.com / admin123
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Doctor: doctor@adapta.com / doctor123
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Nurse: nurse@adapta.com / nurse123
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Receptionist: receptionist@adapta.com / receptionist123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
