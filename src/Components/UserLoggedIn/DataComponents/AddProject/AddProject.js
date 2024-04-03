import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const AddProject = ({ open, handleClose, refreshProjects }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const baseUrl = 'https://www.fiscalfoxapi.com'; // Make sure to replace this with your actual backend URL

  const handleSave = async () => {
    const userID = localStorage.getItem('fiscalfoxID');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${baseUrl}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name: projectName, 
          description, 
          startDate, 
          endDate
        }),
      });

      if (response.ok) {
        await response.json();
        //setProjects(prevProjects => [...prevProjects, { ...newProject, expenses: [], revenues: [] }]);
        refreshProjects();
        handleClose(); // Close the dialog on success
        
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add project");
      }
    } catch (error) {
      console.error("Error adding project:", error.message);
      // Optionally, handle the display of the error to the user here
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Project Name"
          type="text"
          fullWidth
          variant="outlined"
          required
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="description"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          id="start-date"
          label="Start Date"
          type="date"
          fullWidth
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          margin="dense"
          id="end-date"
          label="End Date"
          type="date"
          fullWidth
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProject;
