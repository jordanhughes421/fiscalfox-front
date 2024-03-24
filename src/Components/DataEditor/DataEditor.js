import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';


const entityFields = {
    asset: ["name", "purchaseDate", "value", "depreciationRate", "usageRate"],
    employee: ["firstName", "lastName", "position", "hourlyRate"],
    expense: ["description", "amount", "category", "date", "quantity", "unit", "unitPrice"],
    project: ["name", "description", "startDate", "endDate"],
    revenue: ["description", "amount", "category", "date"],
};

const endpointMappings = {
    project: "projects",
    asset: "asset",
    employee: "employee",
    expense: "expense",
    revenue: "revenue",
    // Extend this object as needed
};

const DataEditor = ({ open, handleClose, refreshProjects }) => {
    const [entityType, setEntityType] = useState('');
    const [entities, setEntities] = useState([]);
    const [selectedEntityId, setSelectedEntityId] = useState('');
    const [selectedEntityData, setSelectedEntityData] = useState({});
    const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com';

    useEffect(() => {
        if (!entityType) return;

        const fetchEntities = async () => {
            const token = localStorage.getItem('token');
            const endpoint = endpointMappings[entityType]; // Use the mapping to get the correct endpoint
            try {
                const response = await fetch(`${baseUrl}/${endpoint}`, { // Use the mapped endpoint
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch data");
        
                const data = await response.json();
                setEntities(data);
                setSelectedEntityId('');
                setSelectedEntityData({});
            } catch (error) {
                console.error("Error fetching entities:", error);
            }
        };
        

        fetchEntities();
    }, [entityType]);

    useEffect(() => {
        if (!selectedEntityId) {
            setSelectedEntityData({});
            return;
        }

        const selected = entities.find(entity => entity._id === selectedEntityId);
        const initialEntityData = entityFields[entityType].reduce((acc, field) => {
            acc[field] = selected ? selected[field] : '';
            return acc;
        }, {});

        const formattedEntityData = {};

        Object.keys(initialEntityData || {}).forEach(key => {
            if (entityFields[entityType].includes(key) && key.toLowerCase().includes('date') && selected[key]) {
                // Extract the date part from the ISO string
                const formattedDate = selected[key].split('T')[0];
                formattedEntityData[key] = formattedDate;
            } else {
                // For non-date fields or null dates
                formattedEntityData[key] = selected[key];
            }
        });
        
        setSelectedEntityData(formattedEntityData);
    }, [selectedEntityId, entityType, entities]);

    const handleEntityDataChange = (e) => {
        const { name, value } = e.target;
        setSelectedEntityData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const endpoint = endpointMappings[entityType]; // Use the mapping to get the correct endpoint
        try {
            const response = await fetch(`${baseUrl}/${endpoint}/${selectedEntityId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(selectedEntityData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update entity");
            }
            
            handleClose();
            refreshProjects();
            // Refresh entities list or provide success feedback here
        } catch (error) {
            console.error("Error updating entity:", error);
            // Handle displaying the error to the user
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Edit {entityType.charAt(0).toUpperCase() + entityType.slice(1)}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="entity-type-select-label">Entity Type</InputLabel>
                    <Select
                        labelId="entity-type-select-label"
                        value={entityType}
                        onChange={(e) => setEntityType(e.target.value)}
                        displayEmpty
                    >
                        {Object.keys(entityFields).map(type => (
                            <MenuItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="entity-select-label">Select {entityType}</InputLabel>
                    <Select
                        labelId="entity-select-label"
                        value={selectedEntityId}
                        onChange={(e) => setSelectedEntityId(e.target.value)}
                        displayEmpty
                    >
                        {entities.map((entity) => (
                            <MenuItem key={entity._id} value={entity._id}>
                                {entity.name || entity.description || `${entity.firstName} ${entity.lastName}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {Object.keys(selectedEntityData).map(field => {
                const isDateField = entityFields[entityType].includes(field) && field.toLowerCase().includes('date');
                    return (
                        <TextField
                            key={field}
                            margin="dense"
                            id={field}
                            name={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                            type={isDateField ? "date" : "text"} // Use "date" type for date fields
                            fullWidth
                            variant="outlined"
                            value={selectedEntityData[field] || ''} // Ensures controlled component for date fields
                            onChange={handleEntityDataChange}
                            InputLabelProps={isDateField ? { shrink: true } : undefined}
                        />
                    );
                })}

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DataEditor;
