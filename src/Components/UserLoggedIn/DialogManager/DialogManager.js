import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Card, CardContent, Container, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import AddProject from '../DataComponents/AddProject/AddProject';
import AddExpense from '../DataComponents/AddExpense/AddExpense';
import AddRevenue from '../DataComponents/AddRevenue/AddRevenue';
import DataDeleter from '../DataComponents/DataDeleter/DataDeleter';
import DataEditor from '../DataComponents/DataEditor/DataEditor';
import AddAsset from '../DataComponents/AddAsset/AddAsset';
import AddVehicleAsset from '../DataComponents/AddAsset/AddVehicleAsset';
import AddConsumableAsset from '../DataComponents/AddAsset/AddConsumableAsset';
import MainAssetDialogue from '../DataComponents/AddAsset/MainAssetDialogue';
import AddClient from '../DataComponents/AddClient/AddClient';
import AddInvoice from '../DataComponents/AddInvoice/AddInvoice';
import AddQuote from '../DataComponents/AddQuote/AddQuote';

function DialogManager({ projects, openDialog, handleCloseDialogs, handleOpenDialogs, refreshProjects }) {
    const [speedDialOpen, setSpeedDialOpen] = useState(false);

    const actions = [
        { icon: <AddCircleOutlineIcon />, name: "Add New Project", action: () => handleOpenDialogs('addProject') },
        { icon: <MoneyOffIcon />, name: "Add New Expense", action: () => handleOpenDialogs('addExpense') },
        { icon: <AttachMoneyIcon />, name: "Add New Revenue", action: () => handleOpenDialogs('addRevenue') },
        { icon: <AddBusinessIcon />, name: "Add Asset", action: () => handleOpenDialogs('mainAssetDialogue') },
        { icon: <PersonAddIcon />, name: "Add Client", action: () => handleOpenDialogs('addClient') },
        { icon: <ReceiptIcon />, name: "Add Invoice", action: () => handleOpenDialogs('addInvoice') },
        { icon: <FormatQuoteIcon />, name: "Add Quote", action: () => handleOpenDialogs('addQuote') },
    ];

    return (
        <>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, position: 'relative' }}>
                <SpeedDial
                    ariaLabel="Actions"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    icon={<SpeedDialIcon />}
                    onClose={() => setSpeedDialOpen(false)}
                    onOpen={() => setSpeedDialOpen(true)}
                    open={speedDialOpen}
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={() => {
                                setSpeedDialOpen(false);
                                action.action();
                            }}
                        />
                    ))}
                </SpeedDial>
            </Container>
            <AddProject open={openDialog === 'addProject'} handleClose={() => handleCloseDialogs()} refreshProjects={refreshProjects} />
            <AddExpense open={openDialog === 'addExpense'} handleClose={() => handleCloseDialogs()} projects={projects} refreshProjects={refreshProjects}/>
            <AddRevenue open={openDialog === 'addRevenue'} handleClose={() => handleCloseDialogs()} projects={projects} refreshProjects={refreshProjects}/>
            <DataDeleter open={openDialog === 'dataDeleter'} handleClose={() => handleCloseDialogs()} />
            <DataEditor open={openDialog === 'dataEditor'} handleClose={() => handleCloseDialogs()} />
            <AddAsset open={openDialog === 'addAsset'} handleClose={() => handleCloseDialogs()} />
            <AddVehicleAsset open={openDialog === 'addVehicleAsset'} handleClose={() => handleCloseDialogs()} />
            <AddConsumableAsset open={openDialog === 'addConsumableAsset'} handleClose={() => handleCloseDialogs()} />
            <MainAssetDialogue 
                open={openDialog === 'mainAssetDialogue'} 
                handleClose={() => handleCloseDialogs()}
                handleOpenAddAsset={() => handleOpenDialogs('addAsset')}
                handleOpenAddVehicleAsset={() => handleOpenDialogs('addVehicleAsset')}
                handleOpenAddConsumableAsset={() => handleOpenDialogs('addConsumableAsset')} 
            />
            <AddClient open={openDialog === 'addClient'} handleClose={() => handleCloseDialogs()} />
            <AddInvoice open={openDialog === 'addInvoice'} handleClose={() => handleCloseDialogs()} />
            <AddQuote open={openDialog === 'addQuote'} handleClose={() => handleCloseDialogs()} />
        </>
    );
}

export default DialogManager;
