import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const DataDeleter = ({ open, handleClose, itemId, itemType, refreshProjects }) => {
    const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com';

    const handleDelete = async () => {
        
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${baseUrl}/${itemType}/${itemId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to delete the item");

                 // Refresh the list of projects or expenses
                handleClose(); // Close the delete dialog
                refreshProjects();
            } catch (error) {
                console.error("Error deleting item:", error);
            }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete {itemType}</DialogTitle>
            <DialogContent>
                Are you sure you want to delete this {itemType}? This action cannot be undone.
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDelete} color="primary">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DataDeleter;
