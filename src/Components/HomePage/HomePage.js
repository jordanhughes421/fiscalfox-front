import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import ProjectFetcher from '../fetchers/projectFetcher';
import AddProject from '../AddProject/AddProject';
import AddExpense from '../AddExpense/AddExpense';
import AddRevenue from '../AddRevenue/AddRevenue';
import DataDeleter from '../DataDeleter/DataDeleter'; // Make sure to import the DataDeleter component

function HomePage() {
    const { isLoggedIn } = useAuth();
    const [openAddProject, setOpenAddProject] = useState(false);
    const [openAddExpense, setOpenAddExpense] = useState(false);
    const [openAddRevenue, setOpenAddRevenue] = useState(false);
    const [openDataDeleter, setOpenDataDeleter] = useState(false); // State for DataDeleter dialog
    const [projects, setProjects] = useState([]);
    const [assets, setAssets] = useState([]);
    const [employees, setEmployees] = useState([]);

    // Handlers for AddProject, AddExpense, and AddRevenue
    const handleOpenAddProject = () => setOpenAddProject(true);
    const handleCloseAddProject = () => setOpenAddProject(false);
    const handleOpenAddExpense = () => setOpenAddExpense(true);
    const handleCloseAddExpense = () => setOpenAddExpense(false);
    const handleOpenAddRevenue = () => setOpenAddRevenue(true);
    const handleCloseAddRevenue = () => setOpenAddRevenue(false);

    // Handlers for DataDeleter
    const handleOpenDataDeleter = () => setOpenDataDeleter(true);
    const handleCloseDataDeleter = () => setOpenDataDeleter(false);

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
                    <Button variant="contained" color="error" onClick={handleOpenDataDeleter} style={{ marginLeft: '10px' }}>
                        Delete Data
                    </Button>
                    <AddProject open={openAddProject} handleClose={handleCloseAddProject} setProjects={setProjects}/>
                    <AddExpense open={openAddExpense} handleClose={handleCloseAddExpense} projects={projects} assets={assets} employees={employees} />
                    <AddRevenue open={openAddRevenue} handleClose={handleCloseAddRevenue} projects={projects} />
                    <DataDeleter open={openDataDeleter} handleClose={handleCloseDataDeleter} />
                </>
            )}
        </Box>
    );
}

export default HomePage;
