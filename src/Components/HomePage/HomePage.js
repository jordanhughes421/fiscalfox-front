import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Typography, Grid, Paper, Card, CardContent, Container } from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import UserLoggedInHomePage from '../UserLoggedIn/UserLoggedInHomePage';
import UserLoggedOutHomePage from '../UserLoggedOut/UserLoggedOutHomePage';

function HomePage() {
    const { isLoggedIn } = useAuth();
    const { login } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Function to parse query string and extract 'token' parameter
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            //console.log('Token found in URL:', token);
            login(token);
            navigate('/');
        }
    }, [location, navigate]);

    return (
        <>
            {isLoggedIn && (
                <UserLoggedInHomePage />
            )}
            {!isLoggedIn && (
                <UserLoggedOutHomePage />
            )}
        </>
    );
}

export default HomePage;
