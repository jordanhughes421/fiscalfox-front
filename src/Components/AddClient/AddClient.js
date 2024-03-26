import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const AddClient = ({ open, handleClose, refreshClients }) => {
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: ''
  });
  const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com'; // Update with your actual API endpoint
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${baseUrl}/client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        handleClose();
        setClientData({
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            phone: ''
        })
        refreshClients && refreshClients(); // Optionally call refreshClients if provided
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add client");
      }
    } catch (error) {
      console.error("Error adding client:", error.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Client</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="firstName"
          name="firstName"
          label="First Name"
          type="text"
          fullWidth
          required
          value={clientData.firstName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="lastName"
          name="lastName"
          label="Last Name"
          type="text"
          fullWidth
          required
          value={clientData.lastName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="email"
          name="email"
          label="Email"
          type="email"
          fullWidth
          required
          value={clientData.email}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="address"
          name="address"
          label="Address"
          type="text"
          fullWidth
          value={clientData.address}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="phone"
          name="phone"
          label="Phone"
          type="tel"
          fullWidth
          value={clientData.phone}
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

export default AddClient;
