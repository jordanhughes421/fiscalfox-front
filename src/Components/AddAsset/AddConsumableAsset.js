import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const AddConsumableAsset = ({ open, handleClose }) => {
    const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com';
    const [consumableAssetData, setConsumableAssetData] = useState({
        name: '',
        description: '',
        purchaseDate: '',
        value: '',
        quantity: '',
        units: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValues = {
            ...consumableAssetData,
            [name]: value
        };

        // Automatically set description based on units input
        if (name === 'units') {
            newValues.description = `consumable, ${value}`;
        }

        setConsumableAssetData(newValues);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const usageRate = consumableAssetData.value && consumableAssetData.quantity ? (Number(consumableAssetData.value) / Number(consumableAssetData.quantity)).toFixed(2) : 0;
        
        try {
            const response = await fetch(`${baseUrl}/asset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...consumableAssetData,
                    value: Number(consumableAssetData.value),
                    depreciationRate: 0, // Assuming consumable assets do not depreciate
                    usageRate: Number(usageRate),
                    description: consumableAssetData.description || `consumable, ${consumableAssetData.units}`
                }),
            });

            if (response.ok) {
                handleClose();
                setConsumableAssetData({ name: '', description: '', purchaseDate: '', value: '', quantity: '', units: '' });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add consumable asset");
            }
        } catch (error) {
            console.error("Error adding consumable asset:", error.message);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Consumable Asset</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={consumableAssetData.name}
                    onChange={handleChange}
                    required
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
                    value={consumableAssetData.purchaseDate}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="value"
                    name="value"
                    label="Purchase Value ($)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={consumableAssetData.value}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="quantity"
                    name="quantity"
                    label="Quantity"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={consumableAssetData.quantity}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="units"
                    name="units"
                    label="Units"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={consumableAssetData.units}
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

export default AddConsumableAsset;
