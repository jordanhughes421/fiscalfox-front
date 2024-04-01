import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const AddRevenue = ({ open, handleClose, selectedProject, refreshProjects }) => {
  const [projects, setProjects] = useState([]);
  const [revenueData, setRevenueData] = useState({
    project: selectedProject ? selectedProject._id : '', // Pre-populate if selectedProject exists
    description: '',
    amount: '',
    category: '',
    date: '',
  });
  const baseUrl = 'https://www.fiscalfoxapi.com'; // Update with your actual API endpoint
  const token = localStorage.getItem('token');

  
  useEffect(() => {
    if (!selectedProject) { // Only fetch projects if no selectedProject is provided
      const fetchProjects = async () => {
        try {
          const response = await fetch(`${baseUrl}/projects`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            setProjects(data);
          } else {
            throw new Error("Failed to fetch projects");
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };

      fetchProjects();
    }
  }, [selectedProject, token, baseUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRevenueData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${baseUrl}/revenue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(revenueData),
      });

      if (response.ok) {
        handleClose();
        refreshProjects && refreshProjects(); // Optionally call refreshProjects if provided
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add revenue");
      }
    } catch (error) {
      console.error("Error adding revenue:", error.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Revenue</DialogTitle>
      <DialogContent>
      {selectedProject ? (
          <Typography variant="h6" gutterBottom>
            Project: {selectedProject.name} {/* Display selected project as a title */}
          </Typography>
        ) : (
          <FormControl fullWidth margin="dense">
            <InputLabel id="project-select-label">Project</InputLabel>
            <Select
              labelId="project-select-label"
              id="project"
              name="project"
              value={revenueData.project}
              onChange={handleChange}
              required
            >
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>{project.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          autoFocus
          margin="dense"
          id="description"
          name="description"
          label="Description"
          type="text"
          fullWidth
          required
          value={revenueData.description}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="category"
          name="category"
          label="Category"
          type="text"
          fullWidth
          required
          value={revenueData.category}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="date"
          name="date"
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
          value={revenueData.date}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="amount"
          name="amount"
          label="Amount"
          type="number"
          fullWidth
          required
          value={revenueData.amount}
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

export default AddRevenue;
