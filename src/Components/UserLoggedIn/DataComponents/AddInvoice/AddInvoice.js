import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const AddInvoice = ({ open, handleClose, selectedClient, refreshInvoices }) => {
  const [clients, setClients] = useState([]);
  const [invoiceData, setInvoiceData] = useState({
    client: selectedClient ? selectedClient._id : '', // Pre-populate if selectedClient exists
    project: '', // Assuming you may still want to associate an invoice with a project
    details: '',
    amount: '',
    paid: false,
    datePaid: ''
  });
  const baseUrl = 'https://www.fiscalfoxapi.com'; // Update with your actual API endpoint
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!selectedClient) { // Only fetch clients if no selectedClient is provided
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
    setInvoiceData(prevData => ({
      ...prevData,
      [name]: name === 'paid' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
        // If the project field is an empty string, delete it from the requestData object
        if (!invoiceData.project) {
            delete invoiceData.project;
        }
      const response = await fetch(`${baseUrl}/invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(invoiceData),
      });


      if (response.ok) {
        handleClose();
        refreshInvoices && refreshInvoices(); // Optionally call refreshInvoices if provided
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add invoice");
      }
    } catch (error) {
      console.error("Error adding invoice:", error.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Invoice</DialogTitle>
      <DialogContent>
        {selectedClient ? (
            <Typography variant="h6" gutterBottom>
              Client: {selectedClient.name} {/* Display selected client as a title */}
            </Typography>
          ) : (
            <FormControl fullWidth margin="dense">
              <InputLabel id="client-select-label">Client</InputLabel>
              <Select
                labelId="client-select-label"
                id="client"
                name="client"
                value={invoiceData.client}
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
          value={invoiceData.details}
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
          value={invoiceData.amount}
          onChange={handleChange}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={invoiceData.paid}
                onChange={handleChange}
                name="paid"
              />
            }
            label="Paid"
          />
        </FormGroup>
        {invoiceData.paid && (
          <TextField
            margin="dense"
            id="datePaid"
            name="datePaid"
            label="Date Paid"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            required={invoiceData.paid}
            value={invoiceData.datePaid}
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

export default AddInvoice;
