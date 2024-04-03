import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Card, CardContent, Container } from '@mui/material';
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

function DialogManager({ openDialog, handleCloseDialogs, handleOpenDialogs }) {

    return (
        <>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                <Card>
                    <CardContent>
                        <Grid container spacing={4} alignItems="center" justifyContent="center">
                            {/* Dynamically generate buttons */}
                            {[
                                { icon: AddCircleOutlineIcon, label: "Add New Project", onClick: () => handleOpenDialogs('addProject'), colorScheme: '#FE6B8B 30%, #FF8E53 90%' },
                                { icon: MoneyOffIcon, label: "Add New Expense", onClick: () => handleOpenDialogs('addExpense'), colorScheme: '#f44336, #e91e63' },
                                { icon: AttachMoneyIcon, label: "Add New Revenue", onClick: () => handleOpenDialogs('addRevenue'), colorScheme: '#4caf50, #81c784' },
                                { icon: AddBusinessIcon, label: "Add Asset", onClick: () => handleOpenDialogs('mainAssetDialogue'), colorScheme: '#29b6f6, #4fc3f7' },
                                { icon: PersonAddIcon, label: "Add Client", onClick: () => handleOpenDialogs('addClient'), colorScheme: '#42a5f5, #478ed1' },
                                { icon: ReceiptIcon, label: "Add Invoice", onClick: () => handleOpenDialogs('addInvoice'), colorScheme: '#1976d2, #1565c0' },
                                { icon: FormatQuoteIcon, label: "Add Quote", onClick: () => handleOpenDialogs('addQuote'), colorScheme: '#66bb6a, #43a047' },
                            ].map((button, index) => (
                                <Grid item xs={6} key={index}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<button.icon />}
                                        onClick={button.onClick}
                                        sx={{
                                            backgroundImage: `linear-gradient(45deg, ${button.colorScheme})`,
                                            color: 'white',
                                            ':hover': {
                                                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                                            },
                                        }}
                                    >
                                        {button.label}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
            <AddProject open={openDialog === 'addProject'} handleClose={() => handleCloseDialogs()} />
            <AddExpense open={openDialog === 'addExpense'} handleClose={() => handleCloseDialogs()} />
            <AddRevenue open={openDialog === 'addRevenue'} handleClose={() => handleCloseDialogs()} />
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
