import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const AddQuote = ({ open, handleClose, selectedClient, refreshQuotes }) => {
  const [clients, setClients] = useState([]);
  const [quoteData, setQuoteData] = useState({
    client: selectedClient ? selectedClient._id : '',
    project: '',
    details: '',
    amount: '',
    approved: false,
    dateApproved: ''
  });
  const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com'; // Update with your actual API endpoint
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!selectedClient) {
      const fetchClients = async () => {
        try {
          const response = await fetch(`${baseUrl}/client`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const clientsData = await response.json();
            setClients(clientsData);
          } else {
            throw new Error("Failed to fetch clients");
          }
        } catch (error) {
          console.error("Error fetching clients:", error);
        }
      };

      fetchClients();
    }
  }, [selectedClient, token, baseUrl]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setQuoteData(prevData => ({
      ...prevData,
      [name]: name === 'approved' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      if (!quoteData.project) {
          delete quoteData.project; // Adapted to handle optional project field
      }
      const response = await fetch(`${baseUrl}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...quoteData,
          dateApproved: quoteData.approved ? quoteData.dateApproved : null, // Adjust for conditional dateApproved
        }),
      });

      if (response.ok) {
        handleClose();
        refreshQuotes && refreshQuotes(); // Refresh the quotes list if provided
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add quote");
      }
    } catch (error) {
      console.error("Error adding quote:", error.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Quote</DialogTitle>
      <DialogContent>
        {selectedClient ? (
            <Typography variant="h6" gutterBottom>
              Client: {selectedClient.name}
            </Typography>
          ) : (
            <FormControl fullWidth margin="dense">
              <InputLabel id="client-select-label">Client</InputLabel>
              <Select
                labelId="client-select-label"
                id="client"
                name="client"
                value={quoteData.client}
                onChange={handleChange}
                required
              >
                {clients.map((client) => (
                  <MenuItem key={client._id} value={client._id}>{client.firstName} {client.lastName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
         <TextField
          autoFocus
          margin="dense"
          id="details"
          name="details"
          label="Details"
          type="text"
          fullWidth
          required
          value={quoteData.details}
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
          value={quoteData.amount}
          onChange={handleChange}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={quoteData.approved}
                onChange={handleChange}
                name="approved"
              />
            }
            label="Approved"
          />
        </FormGroup>
        {quoteData.approved && (
          <TextField
            margin="dense"
            id="dateApproved"
            name="dateApproved"
            label="Date Approved"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            required={quoteData.approved}
            value={quoteData.dateApproved}
            onChange={handleChange}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddQuote;
