import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { Box, Button, Typography, Grid, Paper, Card, CardContent, Container } from '@mui/material';
import { useAuth } from '../auth/AuthContext';


function HomePage() {
    const { login } = useAuth();

    const location = useLocation();

    useEffect(() => {
        // Function to parse query string and extract 'token' parameter
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            //console.log('Token found in URL:', token);
            // Here you can handle the token as needed, e.g., storing it for future requests
            login(token);
            // Or update your auth context/state
        }
    }, [location]);

    return (
        <Box sx={{ flexGrow: 1 }}> 
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ marginTop: '20px' }}>
                    Welcome to Fiscal Fox
                </Typography>
                <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <Button component={NavLink} variant="contained" color="primary" sx={{ marginRight: '10px' }} to='/register'>
                        Sign Up
                    </Button>
                    <Button component={NavLink} variant="outlined" color="primary" to='/login'>
                        Log In
                    </Button>
                </Box>
                <Grid container spacing={2} sx={{ marginTop: '20px', padding: '0 20px' }}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ padding: '20px' }}>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Organize Your Projects
                            </Typography>
                            <Typography>
                                Keep all your projects, expenses, and revenue streams organized in one place.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ padding: '20px' }}>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Track Your Assets
                            </Typography>
                            <Typography>
                                Manage your assets efficiently with our comprehensive asset tracking system.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ padding: '20px' }}>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Insightful Reports
                            </Typography>
                            <Typography>
                                Gain insights into your financial health with detailed reports and analytics.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default HomePage;
