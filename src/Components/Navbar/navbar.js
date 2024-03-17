import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { useAuth } from '../auth/AuthContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

// Custom styling for the active link
const activeStyle = {
    textDecoration: "underline",
};

function Navbar() {
    const { isLoggedIn, logout } = useAuth();
    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
                    >
                        Fiscal Fox
                    </Typography>

                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {/* Mobile menu items */}
                            <MenuItem onClick={handleCloseNavMenu} component={NavLink} to="/" style={({ isActive }) => isActive ? activeStyle : undefined}>
                                <Typography textAlign="center">Home</Typography>
                            </MenuItem>
                            {!isLoggedIn && (
                                <>
                                    <MenuItem onClick={handleCloseNavMenu} component={NavLink} to="/register" style={({ isActive }) => isActive ? activeStyle : undefined}>
                                        <Typography textAlign="center">Register</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseNavMenu} component={NavLink} to="/login" style={({ isActive }) => isActive ? activeStyle : undefined}>
                                        <Typography textAlign="center">Login</Typography>
                                    </MenuItem>
                                </>
                            )}
                            {isLoggedIn && (
                                <MenuItem onClick={() => {
                                    handleCloseNavMenu();
                                    logout();
                                }}>
                                    <Typography textAlign="center">Logout</Typography>
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
                        {/* Desktop menu items */}
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
    );
}

export default Navbar;
