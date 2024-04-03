import React from 'react';
import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material';

const MainAssetDialogue = ({ open, handleClose, handleOpenAddAsset, handleOpenAddVehicleAsset, handleOpenAddConsumableAsset }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogActions>
                <Button onClick={() => { handleClose(); handleOpenAddAsset(); }}>Add Custom Asset</Button>
                <Button onClick={() => { handleClose(); handleOpenAddVehicleAsset(); }}>Add Vehicle</Button>
                <Button onClick={() => { handleClose(); handleOpenAddConsumableAsset(); }}>Add Consumable</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MainAssetDialogue;