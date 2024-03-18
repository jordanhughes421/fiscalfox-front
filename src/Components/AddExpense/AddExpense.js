import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AddExpense = ({ open, handleClose }) => {
    // Assuming projects, assets, and employees are fetched from the parent component for now
    const [projects, setProjects] = useState([]); // Placeholder if you're fetching projects here
    const [assets, setAssets] = useState([]); // Placeholder for assets state
    const [employees, setEmployees] = useState([]); // Placeholder for employees state
    const [expenseData, setExpenseData] = useState({
      expenseType: '',
      project: '',
      category: '',
      date: '',
      amount: '',
      quantity: '',
      unit: '',
      unitPrice: '',
      asset: '',
      employee: ''
    });
  const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com'; // Make sure to replace this with your actual backend URL
  
  useEffect(() => {
    const fetchProjectsAssetsAndEmployees = async () => {
      const token = localStorage.getItem('token');

      try {
        const [projectsResponse, assetsResponse, employeesResponse] = await Promise.all([
          fetch(`${baseUrl}/projects`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }),
          fetch(`${baseUrl}/asset`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }),
          fetch(`${baseUrl}/employee`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          })
        ]);

        if (projectsResponse.ok && assetsResponse.ok && employeesResponse.ok) {
          const projectsData = await projectsResponse.json();
          const assetsData = await assetsResponse.json();
          const employeesData = await employeesResponse.json();

          setProjects(projectsData);
          setAssets(assetsData);
          setEmployees(employeesData);
        } else {
          throw new Error("Failed to fetch projects, assets, or employees");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProjectsAssetsAndEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    // Assuming the base URL is defined outside this function
    const formattedExpense = {
        ...expenseData,
        amount: expenseData.amount ? parseFloat(expenseData.amount) : undefined,
        quantity: parseInt(expenseData.quantity, 10) || 0,
        unitPrice: parseFloat(expenseData.unitPrice) || undefined,
        date: new Date(expenseData.date).toISOString() // Format the date to ISO string if necessary
    };

    try {
        const response = await fetch(`${baseUrl}/expenses`, { // Ensure the endpoint matches your backend API route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formattedExpense),
        });

        if (response.ok) {
            const addedExpense = await response.json();
            // Assuming there's a way to update the parent component or context that holds the expenses state
            // For example, if this component was passed a method to update the expenses in the parent component:
            // updateExpenses([...expenses, addedExpense]);
            handleClose(); // Close the dialog
            // Reset the form data state here if you want the form to be cleared on successful submission
            setExpenseData({
                project: '',
                description: '',
                amount: '',
                category: '',
                date: '',
                quantity: '',
                unit: '',
                unitPrice: '',
                asset: '',
                employee: ''
            });
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add expense");
        }
    } catch (error) {
        console.error("Error adding expense:", error.message);
        // Optionally, handle displaying the error to the user here
    }
};


return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Expense</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel id="expense-type-label">Expense Type</InputLabel>
          <Select
            labelId="expense-type-label"
            id="expenseType"
            name="expenseType"
            value={expenseData.expenseType}
            onChange={handleChange}
            required
          >
            <MenuItem value="Asset Expense">Asset Expense</MenuItem>
            <MenuItem value="Single Expense">Single Expense</MenuItem>
            <MenuItem value="Unit Expense">Unit Expense</MenuItem>
            <MenuItem value="Employee Expense">Employee Expense</MenuItem>
          </Select>
        </FormControl>
        {/* Common fields for all expense types */}
        <CommonFields projects={projects} expenseData={expenseData} handleChange={handleChange} />

        {expenseData.expenseType === "Asset Expense" && (
          <FormControl fullWidth margin="dense">
            <InputLabel id="asset-select-label">Asset</InputLabel>
            <Select
              labelId="asset-select-label"
              id="asset"
              name="asset"
              value={expenseData.asset}
              onChange={handleChange}
              required
            >
              {assets.map((asset) => (
                <MenuItem key={asset._id} value={asset._id}>{asset.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {expenseData.expenseType === "Unit Expense" && (
          <>
            <TextField
              margin="dense"
              id="unit"
              name="unit"
              label="Unit"
              type="text"
              fullWidth
              variant="outlined"
              value={expenseData.unit}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              id="unitPrice"
              name="unitPrice"
              label="Unit Price"
              type="number"
              fullWidth
              variant="outlined"
              value={expenseData.unitPrice}
              onChange={handleChange}
              required
            />
          </>
        )}
        {expenseData.expenseType === "Employee Expense" && (
          <FormControl fullWidth margin="dense">
            <InputLabel id="employee-select-label">Employee</InputLabel>
            <Select
              labelId="employee-select-label"
              id="employee"
              name="employee"
              value={expenseData.employee}
              onChange={handleChange}
              required
            >
              {employees.map((employee) => (
                <MenuItem key={employee._id} value={employee._id}>{employee.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

const CommonFields = ({ projects, expenseData, handleChange }) => (
  <>
    <FormControl fullWidth margin="dense">
      <InputLabel id="project-select-label">Project</InputLabel>
      <Select
        labelId="project-select-label"
        id="project"
        name="project"
        value={expenseData.project}
        onChange={handleChange}
        required
      >
        {projects.map((project) => (
          <MenuItem key={project._id} value={project._id}>{project.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      margin="dense"
      id="category"
      name="category"
      label="Category"
      type="text"
      fullWidth
      variant="outlined"
      value={expenseData.category}
      onChange={handleChange}
      required
    />
    <TextField
      margin="dense"
      id="date"
      name="date"
      label="Date"
      type="date"
      fullWidth
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      value={expenseData.date}
      onChange={handleChange}
      required
    />
    <TextField
      margin="dense"
      id="amount"
      name="amount"
      label="Amount"
      type="number"
      fullWidth
      variant="outlined"
      value={expenseData.amount}
      onChange={handleChange}
      required
    />
  </>
);

export default AddExpense;
