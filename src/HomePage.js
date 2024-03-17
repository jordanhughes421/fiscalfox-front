import React from 'react';
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from './AuthContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dashboard from './Dashboard'; // Import Dashboard component

// Custom styling for the active link
const activeStyle = {
    textDecoration: "underline",
};

function HomePage() {
    const { isLoggedIn, logout } = useAuth();

    return (
        <Box sx={{ flexGrow: 1 }}>
            {isLoggedIn && <Dashboard />} {/* Render Dashboard only if logged in */}
        </Box>

    );
}

export default HomePage;
