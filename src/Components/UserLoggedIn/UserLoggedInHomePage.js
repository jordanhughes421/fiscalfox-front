import React, { useState } from 'react';
import { Box, Button, Grid, Card, CardContent, Container } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import Dashboard from './Dashboard/Dashboard';
import ProjectFetcher from '../fetchers/projectFetcher';
import DialogManager from './DialogManager/DialogManager';

function UserLoggedInHomePage() {
    const [openDialog, setOpenDialog] = useState('');

    const handleOpenDialog = (dialogName) => setOpenDialog(dialogName);
    const handleCloseDialog = () => setOpenDialog('');

    
    
    return (
        <Box sx={{ flexGrow: 1 }}>
            <DialogManager openDialog={openDialog} handleCloseDialogs={handleCloseDialog} handleOpenDialogs={handleOpenDialog} />
            <Dashboard />
            <ProjectFetcher />
        </Box>
    );
}

export default UserLoggedInHomePage;
