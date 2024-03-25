import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { Box, Button, Typography, Grid, Paper, Card, CardContent, Container } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
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
                    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={4} alignItems="center" justifyContent="center">
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={handleOpenAddProject}
                                            startIcon={<AddCircleOutlineIcon />}
                                            sx={{
                                                backgroundImage: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                                color: 'white',
                                                ':hover': {
                                                bgcolor: 'primary.dark', // Darken the button when hovered
                                                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                                                },
                                            }}
                                            >
                                            Add New Project
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={handleOpenAddExpense}
                                            startIcon={<MoneyOffIcon />}
                                            sx={{
                                                backgroundImage: 'linear-gradient(45deg, #f44336, #e91e63)', // A red-pink gradient
                                                color: 'white',
                                                ':hover': {
                                                bgcolor: 'secondary.dark', // Darken the button when hovered
                                                boxShadow: '0 3px 5px 2px rgba(233, 30, 99, .3)', // Adjust the shadow color to match
                                                },
                                            }}
                                            >
                                            Add New Expense
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={handleOpenAddRevenue}
                                            startIcon={<AttachMoneyIcon />}
                                            sx={{
                                                backgroundImage: 'linear-gradient(45deg, #4caf50, #81c784)',
                                                color: 'white',
                                                ':hover': {
                                                bgcolor: 'success.dark',
                                                boxShadow: '0 3px 5px 2px rgba(129, 199, 132, .3)',
                                                },
                                            }}
                                            >
                                            Add New Revenue
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            color="info"
                                            fullWidth
                                            onClick={handleOpenMainAssetDialog}
                                            startIcon={<AddBusinessIcon />}
                                            sx={{
                                                backgroundImage: 'linear-gradient(45deg, #29b6f6, #4fc3f7)', // Blue gradient
                                                color: 'white',
                                                ':hover': {
                                                bgcolor: 'info.dark', // Darken the button when hovered
                                                boxShadow: '0 3px 5px 2px rgba(79, 195, 247, .3)', // Custom shadow
                                                },
                                            }}
                                            >
                                            Add Asset
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Container>
                    <ProjectFetcher />
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
