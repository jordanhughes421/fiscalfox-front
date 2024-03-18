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
import AddProject from '../AddProject/AddProject'; // Assuming this path is correct
import AddExpense from '../AddExpense/AddExpense'; // Import AddExpense

// Custom styling for the active link
const activeStyle = {
    textDecoration: "underline",
};

function HomePage() {
    const { isLoggedIn, logout } = useAuth();
    const [openAddProject, setOpenAddProject] = useState(false); // State to control the AddProject dialog
    const [openAddExpense, setOpenAddExpense] = useState(false); // State to control the AddExpense dialog
    const [projects, setProjects] = useState([]);
    const [assets, setAssets] = useState([]);
    const [employees, setEmployees] = useState([]);

    // You might also need states for assets and employees if they are used in AddExpense

    const handleOpenAddProject = () => setOpenAddProject(true);
    const handleCloseAddProject = () => setOpenAddProject(false);

    const handleOpenAddExpense = () => setOpenAddExpense(true); // Function to open the AddExpense dialog
    const handleCloseAddExpense = () => setOpenAddExpense(false); // Function to close the AddExpense dialog

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
                    <AddProject open={openAddProject} handleClose={handleCloseAddProject} setProjects={setProjects}/>
                    <AddExpense open={openAddExpense} handleClose={handleCloseAddExpense} projects={projects} assets={assets} employees={employees} />
                </>
            )}
        </Box>
    );
}

export default HomePage;
