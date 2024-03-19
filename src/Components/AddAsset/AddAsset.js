import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const AddAsset = ({ open, handleClose }) => {
    const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com'; // Update with your actual API endpoint
    const [assetData, setAssetData] = useState({
        name: '',
        description: '',
        purchaseDate: '',
        value: '',
        depreciationRate: '',
        usageRate: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssetData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${baseUrl}/asset`, { // Adjust the endpoint as needed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...assetData,
                    // Convert value, depreciationRate, and usageRate to their appropriate types if necessary
                    value: Number(assetData.value),
                    depreciationRate: assetData.depreciationRate ? Number(assetData.depreciationRate) : undefined,
                    usageRate: assetData.usageRate ? Number(assetData.usageRate) : undefined
                }),
            });
    
            if (response.ok) {
                // Assuming you want to do something like update the asset list in the parent component
                // You might want to fetch the latest list of assets or update the state directly if the API returns the new asset
                // For now, just close the dialog
                handleClose();
                // Optionally reset assetData state here to clear the form
                setAssetData({ name: '', description: '', purchaseDate: '', value: '', depreciationRate: '', usageRate: '' });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add asset");
            }
        } catch (error) {
            console.error("Error adding asset:", error.message);
            // Here you might want to show an error message to the user
        }
    };
    

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    name="name"
                    label="Asset Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={assetData.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    id="description"
                    name="description"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={assetData.description}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="purchaseDate"
                    name="purchaseDate"
                    label="Purchase Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={assetData.purchaseDate}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="value"
                    name="value"
                    label="Value ($)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={assetData.value}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    id="depreciationRate"
                    name="depreciationRate"
                    label="Depreciation Rate (%)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={assetData.depreciationRate}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="usageRate"
                    name="usageRate"
                    label="Usage Rate ($/unit)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={assetData.usageRate}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddAsset;
