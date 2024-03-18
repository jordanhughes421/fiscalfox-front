import React from 'react';
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from '../auth/AuthContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ProjectFetcher from '../fetchers/projectFetcher';
import ExpenseFetcher from '../fetchers/expenseFetcher';

// Custom styling for the active link
const activeStyle = {
    textDecoration: "underline",
};

function HomePage() {
    const { isLoggedIn, logout } = useAuth();

    return (
        <Box sx={{ flexGrow: 1 }}>
            {isLoggedIn && <ProjectFetcher />} {/* Render Dashboard only if logged in */}
            {isLoggedIn && <ExpenseFetcher />} {/* Render Dashboard only if logged in */}
        </Box>

    );
}

export default HomePage;
