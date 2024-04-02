import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { Box, Button, Typography, Grid, Paper, Card, CardContent, Container } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
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
import AddClient from '../AddClient/AddClient';
import AddInvoice from '../AddInvoice/AddInvoice';
import AddQuote from '../AddQuote/AddQuote';
import Dashboard from './Dashboard/Dashboard';

function UserLoggedInHomePage() {
    const { isLoggedIn } = useAuth();
    const { login } = useAuth();
    const [openAddProject, setOpenAddProject] = useState(false);
    const [openAddExpense, setOpenAddExpense] = useState(false);
    const [openAddRevenue, setOpenAddRevenue] = useState(false);
    const [openDataDeleter, setOpenDataDeleter] = useState(false); 
    const [openAddClient, setOpenAddClient] = useState(false);
    const [openAddInvoice, setOpenAddInvoice] = useState(false);
    const [openAddQuote, setOpenAddQuote] = useState(false);
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
    const handleOpenAddClient = () => setOpenAddClient(true);
    const handleCloseAddClient = () => setOpenAddClient(false);
    const handleOpenAddInvoice = () => setOpenAddInvoice(true);
    const handleCloseAddInvoice = () => setOpenAddInvoice(false);
    const handleOpenAddQuote = () => setOpenAddQuote(true);
    const handleCloseAddQuote = () => setOpenAddQuote(false);
    
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
            <Dashboard />
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
                                <Grid item xs={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleOpenAddClient}
                                        startIcon={<PersonAddIcon />}
                                        sx={{
                                            backgroundImage: 'linear-gradient(to right, #42a5f5, #478ed1)', // Adjusted gradient direction and colors
                                            color: 'white',
                                            border: '1px solid rgba(255, 255, 255, 0.25)', // Subtle border
                                            ':hover': {
                                            bgcolor: 'info.dark',
                                            boxShadow: '0 4px 6px 2px rgba(66, 165, 245, .3)', // Slightly different shadow for distinction
                                            },
                                        }}
                                        >
                                        Add Client
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleOpenAddInvoice} // Make sure to adjust the handler for adding an invoice
                                        startIcon={<ReceiptIcon />}
                                        sx={{
                                            backgroundImage: 'linear-gradient(to right, #1976d2, #1565c0)', // Deepening the blue gradient
                                            color: 'white',
                                            border: '1px solid rgba(255, 255, 255, 0.25)', // Keeping the subtle border
                                            ':hover': {
                                            // Adjusting hover styles for a distinct but coherent look
                                            bgcolor: 'primary.dark', // Switching to primary dark for a different hover effect
                                            boxShadow: '0 4px 6px 2px rgba(25, 118, 210, .4)', // Deepened shadow for more emphasis
                                            },
                                        }}
                                        >
                                        Add Invoice
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleOpenAddQuote} // Adjusted handler for adding a quote
                                        startIcon={<FormatQuoteIcon />}
                                        sx={{
                                            backgroundImage: 'linear-gradient(to right, #66bb6a, #43a047)', // A fresh green gradient
                                            color: 'white',
                                            border: '1px solid rgba(255, 255, 255, 0.25)', // Subtle white border for sophistication
                                            ':hover': {
                                            bgcolor: 'success.dark', // Use a dark success color for hover for differentiation
                                            boxShadow: '0 4px 6px 2px rgba(102, 187, 106, .4)', // Shadow with a green hue for emphasis
                                            },
                                        }}
                                        >
                                        Add Quote
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
                <AddClient open={openAddClient} handleClose={handleCloseAddClient} />
                <AddInvoice open={openAddInvoice} handleClose={handleCloseAddInvoice} />
                <AddQuote open={openAddQuote} handleClose={handleCloseAddQuote} />
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
        </Box>
    );
}

export default UserLoggedInHomePage;
