import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const AddVehicleAsset = ({ open, handleClose }) => {
    const baseUrl = 'https://www.fiscalfoxapi.com';
    const [vehicleData, setVehicleData] = useState({
        year: '',
        make: '',
        model: '',
        name: '',
        description: 'vehicle',
        purchaseDate: '',
        value: '',
        mpg: '', // This represents the vehicle's MPG
    });

    // Standard depreciation rate for vehicles (e.g., 15% per year)
    const depreciationRate = 15;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const assetName = `${vehicleData.name} ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`; // Concatenate year, make, and model

        try {
            const response = await fetch(`${baseUrl}/asset`, { // Adjust the endpoint as needed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: assetName,
                    description: vehicleData.description,
                    purchaseDate: vehicleData.purchaseDate,
                    value: Number(vehicleData.value),
                    depreciationRate: depreciationRate,
                    usageRate: Number(vehicleData.mpg), // Save MPG as the usage rate
                }),
            });

            if (response.ok) {
                handleClose();
                setVehicleData({ year: '', make: '', model: '', name: '', description: 'vehicle', purchaseDate: '', value: '', mpg: '' });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add vehicle asset");
            }
        } catch (error) {
            console.error("Error adding vehicle asset:", error.message);
            // Handle error (e.g., show error message to the user)
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Vehicle Asset</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" id="year" name="year" label="Year" type="text" fullWidth variant="outlined" value={vehicleData.year} onChange={handleChange} required />
                <TextField margin="dense" id="make" name="make" label="Make" type="text" fullWidth variant="outlined" value={vehicleData.make} onChange={handleChange} required />
                <TextField margin="dense" id="model" name="model" label="Model" type="text" fullWidth variant="outlined" value={vehicleData.model} onChange={handleChange} required />
                <TextField margin="dense" id="name" name="name" label="Name" type="text" fullWidth variant="outlined" value={vehicleData.name} onChange={handleChange} />
                <TextField margin="dense" id="purchaseDate" name="purchaseDate" label="Purchase Date" type="date" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} value={vehicleData.purchaseDate} onChange={handleChange} />
                <TextField margin="dense" id="value" name="value" label="Value ($)" type="number" fullWidth variant="outlined" value={vehicleData.value} onChange={handleChange} required />
                <TextField margin="dense" id="mpg" name="mpg" label="MPG (miles per gallon)" type="number" fullWidth variant="outlined" value={vehicleData.mpg} onChange={handleChange} required />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddVehicleAsset;
