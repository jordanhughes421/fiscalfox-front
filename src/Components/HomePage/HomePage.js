import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import ProjectFetcher from '../fetchers/projectFetcher';
import AddProject from '../AddProject/AddProject';
import AddExpense from '../AddExpense/AddExpense';
import AddRevenue from '../AddRevenue/AddRevenue';
import DataDeleter from '../DataDeleter/DataDeleter';
import DataEditor from '../DataEditor/DataEditor';
import AddAsset from '../AddAsset/AddAsset';
import AddVehicleAsset from '../AddAsset/AddVehicleAsset';
import AddConsumableAsset from '../AddAsset/AddConsumableAsset';
import MainAssetDialogue from '../AddAsset/MainAssetDialogue';

function HomePage() {
    const { isLoggedIn } = useAuth();
    const [openAddProject, setOpenAddProject] = useState(false);
    const [openAddExpense, setOpenAddExpense] = useState(false);
    const [openAddRevenue, setOpenAddRevenue] = useState(false);
    const [openDataDeleter, setOpenDataDeleter] = useState(false); 
    const [projects, setProjects] = useState([]);
    const [assets, setAssets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [openAddAsset, setOpenAddAsset] = useState(false);
    const [openAddVehicleAsset, setOpenAddVehicleAsset] = useState(false);
    const [openMainAssetDialog, setOpenMainAssetDialog] = useState(false);
    const [openDataEditor, setOpenDataEditor] = useState(false);
    const [openAddConsumableAsset, setOpenAddConsumableAsset] = useState(false);


    // Handlers for AddProject, AddExpense, and AddRevenue
    const handleOpenAddProject = () => setOpenAddProject(true);
    const handleCloseAddProject = () => setOpenAddProject(false);
    const handleOpenAddExpense = () => setOpenAddExpense(true);
    const handleCloseAddExpense = () => setOpenAddExpense(false);
    const handleOpenAddRevenue = () => setOpenAddRevenue(true);
    const handleCloseAddRevenue = () => setOpenAddRevenue(false);
    const handleOpenDataEditor = () => setOpenDataEditor(true);
    const handleCloseDataEditor = () => setOpenDataEditor(false);

    
    // Handlers for DataDeleter
    const handleOpenDataDeleter = () => setOpenDataDeleter(true);
    const handleCloseDataDeleter = () => setOpenDataDeleter(false);

    // Handler to open MainAssetDialogue
    const handleOpenMainAssetDialog = () => setOpenMainAssetDialog(true);
    const handleCloseMainAssetDialog = () => setOpenMainAssetDialog(false);
    const handleCloseAddAssetDialog = () => setOpenAddAsset(false);
    const handleCloseAddVehicleAssetDialog = () => setOpenAddVehicleAsset(false);

    const handleOpenAddAsset = () => {
        setOpenMainAssetDialog(false); // Assuming you manage MainAssetDialogue's state here
        setOpenAddAsset(true);
    };

    // Function to open the AddVehicleAsset dialog
    const handleOpenAddVehicleAsset = () => {
        setOpenMainAssetDialog(false); // Assuming you manage MainAssetDialogue's state here
        setOpenAddVehicleAsset(true);
    };

    const handleOpenAddConsumableAsset = () => {
        setOpenMainAssetDialog(false);
        setOpenAddConsumableAsset(true);
    };
    const handleCloseAddConsumableAssetDialog = () => setOpenAddConsumableAsset(false);



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
                    <Button variant="contained" color="info" onClick={handleOpenMainAssetDialog} style={{ marginLeft: '10px' }}>
                        Add Asset
                    </Button>
                    <AddProject open={openAddProject} handleClose={handleCloseAddProject} setProjects={setProjects}/>
                    <AddExpense open={openAddExpense} handleClose={handleCloseAddExpense} projects={projects} assets={assets} employees={employees} />
                    <AddRevenue open={openAddRevenue} handleClose={handleCloseAddRevenue} projects={projects} />
                    <MainAssetDialogue
                        open={openMainAssetDialog}
                        handleClose={handleCloseMainAssetDialog}
                        handleOpenAddAsset={handleOpenAddAsset}
                        handleOpenAddVehicleAsset={handleOpenAddVehicleAsset}
                        handleOpenAddConsumableAsset={handleOpenAddConsumableAsset} // Add this prop
                    />
                    <AddAsset open={openAddAsset} handleClose={handleCloseAddAssetDialog} />
                    <AddVehicleAsset open={openAddVehicleAsset} handleClose={handleCloseAddVehicleAssetDialog} />
                    <AddConsumableAsset open={openAddConsumableAsset} handleClose={handleCloseAddConsumableAssetDialog} />
                    <DataDeleter open={openDataDeleter} handleClose={handleCloseDataDeleter} />
                    <DataEditor open={openDataEditor} handleClose={handleCloseDataEditor} />
                </>
            )}
            {!isLoggedIn && (
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
            )}

        </Box>
    );
}

export default HomePage;
