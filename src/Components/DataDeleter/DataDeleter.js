import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const DataDeleter = ({ open, handleClose }) => {
    const [entityType, setEntityType] = useState('');
    const [entities, setEntities] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState('');
    const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com'; // Make sure to replace this with your actual backend URL

    useEffect(() => {
        if (!entityType) return;

        const fetchEntities = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${baseUrl}/${entityType}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch data");
                
                const data = await response.json();
                setEntities(data);
            } catch (error) {
                console.error(error);
                setEntities([]);
            }
        };

        fetchEntities();
    }, [entityType]);

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${baseUrl}/${entityType}/${selectedEntity}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete entity");
            }

            // Handle successful deletion here, e.g., refreshing the entity list or closing the dialog
            handleClose();
            setEntityType('');
            setSelectedEntity('');
            // Optionally refresh the entities list here if the dialog stays open
        } catch (error) {
            console.error(error);
            // Optionally, display the error to the user
        }
    };

    return (
        <Dialog open={open} onClose={() => {
            handleClose();
            setEntityType('');
            setSelectedEntity('');
        }}>
            <DialogTitle>Delete Record</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Select Type</InputLabel>
                    <Select
                        value={entityType}
                        onChange={(e) => setEntityType(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="" disabled></MenuItem>
                        <MenuItem value="projects">Project</MenuItem>
                        <MenuItem value="asset">Asset</MenuItem>
                        <MenuItem value="employee">Employee</MenuItem>
                        <MenuItem value="expense">Expense</MenuItem>
                        <MenuItem value="revenue">Revenue</MenuItem>
                    </Select>
                </FormControl>
                {entities.length > 0 && (
                    <FormControl fullWidth margin="dense">
                        
                        <Select
                            value={selectedEntity}
                            onChange={(e) => setSelectedEntity(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Select {entityType}</MenuItem>
                            {entities.map((entity) => (
                                <MenuItem key={entity._id} value={entity._id}>
                                {entity.name ? `${entity.name}` : `${entity.description}: $${entity.amount}`}
                              </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    handleClose();
                    setEntityType('');
                    setSelectedEntity('');
                }}>Cancel</Button>
                <Button onClick={handleDelete} color="primary">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DataDeleter;
