import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Paper, Alert } from '@mui/material';

const baseUrl = 'https://www.fiscalfoxapi.com';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    };


    try {
      const response = await fetch(`${baseUrl}/auth/register`, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('fiscalfoxID', data.user.id);

      // Set success message and redirect after a delay
      setSuccessMessage('Registration successful! Please login.');
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect after 3 seconds
      
    } catch (error) {
      console.error('Error during registration:', error);
      // Optionally, handle and display error messages to the user here
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Sign Up
        </Typography>
        {successMessage && (
          <Alert severity="success" sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'center' }}>
            {successMessage}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Button
          fullWidth
          variant="outlined"
          onClick={() => window.location.href = `${baseUrl}/auth/auth/google`}
          sx={{ mb: 2 }}
          >
          Sign Up with Google
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            sx={{ mb: 2 }}
          >
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
