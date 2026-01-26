import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const quickLogins = [
  { username: 'admin', password: 'admin123', role: 'Admin', color: '#e53935' },
  { username: 'doctor', password: 'doctor123', role: 'Doctor', color: '#1976d2' },
  { username: 'nurse', password: 'nurse123', role: 'Nurse', color: '#43a047' },
  { username: 'staff', password: 'staff123', role: 'Staff', color: '#ff9800' },
];

function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (user) => {
    setError('');
    setLoading(true);
    try {
      await login(user.username, user.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', p: 2 }}>
      <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 3 }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 4, textAlign: 'center' }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'white', color: 'primary.main', mx: 'auto', mb: 2 }}>
            <HospitalIcon sx={{ fontSize: 36 }} />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">ADAPTA</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Hospital Management Platform</Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3, py: 1.5 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}><Typography variant="caption" color="text.secondary">Quick Demo Login</Typography></Divider>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {quickLogins.map((user) => (
              <Chip
                key={user.username}
                label={user.role}
                onClick={() => handleQuickLogin(user)}
                sx={{ bgcolor: `${user.color}22`, color: user.color, fontWeight: 500, '&:hover': { bgcolor: `${user.color}33` } }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginScreen;