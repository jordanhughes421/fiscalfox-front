import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import ProjectFetcher from '../fetchers/projectFetcher';
import AddProject from '../AddProject/AddProject';
import AddExpense from '../AddExpense/AddExpense';
import AddRevenue from '../AddRevenue/AddRevenue';
import DataDeleter from '../DataDeleter/DataDeleter';
import DataEditor from '../DataEditor/DataEditor';
import AddAsset from '../AddAsset/AddAsset';
import AddVehicleAsset from '../AddAsset/AddVehicleAsset';
import MainAssetDialogue from '../AddAsset/MainAssetDialogue';

function HomePage() {
    const { isLoggedIn } = useAuth();
    const [openAddProject, setOpenAddProject] = useState(false);
    const [openAddExpense, setOpenAddExpense] = useState(false);
    const [openAddRevenue, setOpenAddRevenue] = useState(false);
    const [openDataDeleter, setOpenDataDeleter] = useState(false); // State for DataDeleter dialog
    const [projects, setProjects] = useState([]);
    const [assets, setAssets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [openAddAsset, setOpenAddAsset] = useState(false);
    const [openAddVehicleAsset, setOpenAddVehicleAsset] = useState(false);
    const [openMainAssetDialog, setOpenMainAssetDialog] = useState(false);
    const [openDataEditor, setOpenDataEditor] = useState(false);


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
                    <Button variant="contained" color="warning" onClick={handleOpenDataEditor} style={{ marginLeft: '10px' }}>
                        Edit Data
                    </Button>
                    <Button variant="contained" color="error" onClick={handleOpenDataDeleter} style={{ marginLeft: '10px' }}>
                        Delete Data
                    </Button>
                    <AddProject open={openAddProject} handleClose={handleCloseAddProject} setProjects={setProjects}/>
                    <AddExpense open={openAddExpense} handleClose={handleCloseAddExpense} projects={projects} assets={assets} employees={employees} />
                    <AddRevenue open={openAddRevenue} handleClose={handleCloseAddRevenue} projects={projects} />
                    <MainAssetDialogue
                        open={openMainAssetDialog}
                        handleClose={handleCloseMainAssetDialog}
                        handleOpenAddAsset={handleOpenAddAsset}
                        handleOpenAddVehicleAsset={handleOpenAddVehicleAsset}
                    />
                    <AddAsset open={openAddAsset} handleClose={handleCloseAddAssetDialog} />
                    <AddVehicleAsset open={openAddVehicleAsset} handleClose={handleCloseAddVehicleAssetDialog} />
                    <DataDeleter open={openDataDeleter} handleClose={handleCloseDataDeleter} />
                    <DataEditor open={openDataEditor} handleClose={handleCloseDataEditor} />
                </>
            )}
        </Box>
    );
}

export default HomePage;
