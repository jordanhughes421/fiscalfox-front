import React from 'react';
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from './AuthContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

// Custom styling for the active link
const activeStyle = {
    textDecoration: "underline",
};

function HomePage() {
    const { isLoggedIn, logout } = useAuth();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                        >
                            Fiscal Fox
                        </Typography>
                        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
                            <Button color="inherit" component={NavLink} to="/" end style={({ isActive }) => isActive ? activeStyle : undefined}>
                                Home
                            </Button>
                            {!isLoggedIn && (
                                <>
                                    <Button color="inherit" component={NavLink} to="/register" style={({ isActive }) => isActive ? activeStyle : undefined}>
                                        Register
                                    </Button>
                                    <Button color="inherit" component={NavLink} to="/login" style={({ isActive }) => isActive ? activeStyle : undefined}>
                                        Login
                                    </Button>
                                </>
                            )}
                            {isLoggedIn && (
                                <Button color="inherit" onClick={logout}>Logout</Button>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Outlet />
        </Box>
    );
}

export default HomePage;
