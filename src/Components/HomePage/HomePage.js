import React, { useState } from 'react';
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
import RevenueFetcher from '../fetchers/revenueFetcher';
import AddProject from '../AddProject/AddProject';
import AddExpense from '../AddExpense/AddExpense';
import AddRevenue from '../AddRevenue/AddRevenue'; // Import AddRevenue

// Custom styling for the active link
const activeStyle = {
    textDecoration: "underline",
};

function HomePage() {
    const { isLoggedIn, logout } = useAuth();
    const [openAddProject, setOpenAddProject] = useState(false);
    const [openAddExpense, setOpenAddExpense] = useState(false);
    const [openAddRevenue, setOpenAddRevenue] = useState(false); // State for AddRevenue dialog
    const [projects, setProjects] = useState([]);
    const [assets, setAssets] = useState([]);
    const [employees, setEmployees] = useState([]);

    const handleOpenAddProject = () => setOpenAddProject(true);
    const handleCloseAddProject = () => setOpenAddProject(false);

    const handleOpenAddExpense = () => setOpenAddExpense(true);
    const handleCloseAddExpense = () => setOpenAddExpense(false);

    const handleOpenAddRevenue = () => setOpenAddRevenue(true); // Function to open the AddRevenue dialog
    const handleCloseAddRevenue = () => setOpenAddRevenue(false); // Function to close the AddRevenue dialog

    return (
        <Box sx={{ flexGrow: 1 }}>
            {isLoggedIn && (
                <>
                    <ProjectFetcher />
                    <Button variant="contained" color="primary" onClick={handleOpenAddProject}>
                        Add New Project
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleOpenAddExpense} style={{ marginLeft: '10px' }}>
                        Add New Expense
                    </Button>
                    <Button variant="contained" color="success" onClick={handleOpenAddRevenue} style={{ marginLeft: '10px' }}>
                        Add New Revenue
                    </Button>
                    <AddProject open={openAddProject} handleClose={handleCloseAddProject} setProjects={setProjects}/>
                    <AddExpense open={openAddExpense} handleClose={handleCloseAddExpense} projects={projects} assets={assets} employees={employees} />
                    <AddRevenue open={openAddRevenue} handleClose={handleCloseAddRevenue} projects={projects} /* Pass other props if needed */ />
                </>
            )}
        </Box>
    );
}

export default HomePage;
