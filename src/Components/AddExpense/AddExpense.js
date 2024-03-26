import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const AddExpense = ({ open, handleClose, selectedProject, refreshProjects }) => {
    // Assuming projects, assets, and employees are fetched from the parent component for now
    const [projects, setProjects] = useState([]); // Placeholder if you're fetching projects here
    const [assets, setAssets] = useState([]); // Placeholder for assets state
    const [employees, setEmployees] = useState([]); // Placeholder for employees state
    const [isVehicle, setIsVehicle] = useState(false);
    const [isConsumable, setIsConsumable] = useState(false);
    const [vehicleUsageRate, setVehicleUsageRate] = useState(null);
    const [expenseData, setExpenseData] = useState({
      expenseType: '',
      project: selectedProject ? selectedProject._id : '',
      description: '',
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


  

  const calculateAndSetAmount = (newValue, fieldName) => {
    // Ensure all necessary values are numbers and present before calculating
    let { quantity, unitPrice } = expenseData;
    if (fieldName === "quantity") {
        quantity = newValue;
    } else if (fieldName === "unitPrice") {
        unitPrice = newValue;
    }
    
    const mpg = vehicleUsageRate;

    if (!quantity || !unitPrice || !mpg) {
        return; // Exit if any value is missing or zero
    }

    const milesDriven = parseFloat(quantity);
    const pricePerGallon = parseFloat(unitPrice);
    const usageRate = parseFloat(mpg);

    const gallonsUsed = milesDriven / usageRate;
    const amount = gallonsUsed * pricePerGallon;

    // Update the expenseData state with the calculated amount
    setExpenseData(prevData => ({
        ...prevData,
        amount: amount.toFixed(2) // Keeping two decimal places for currency formatting
    }));
  };

  const calculateAndSetAmountConsumable = (newValue, fieldName) => {
    // Ensure all necessary values are numbers and present before calculating
    let { quantity, unitPrice } = expenseData;
    if (fieldName === "quantity") {
        quantity = newValue;
    } else if (fieldName === "unitPrice") {
        unitPrice = newValue;
    }
    

    if (!quantity || !unitPrice ) {
        return; // Exit if any value is missing or zero
    }

    const unitsUsed = parseFloat(quantity);
    const pricePerUnit = parseFloat(unitPrice);
    const amount = unitsUsed * pricePerUnit;

    // Update the expenseData state with the calculated amount
    setExpenseData(prevData => ({
        ...prevData,
        amount: amount.toFixed(2) // Keeping two decimal places for currency formatting
    }));
  };


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

    // When an asset is selected, check if it's a vehicle or a consumable based on the description
    if (name === "asset") {
        const selectedAsset = assets.find(asset => asset._id === value);
        const isVehicleSelected = selectedAsset && selectedAsset.description === "vehicle";
        const isConsumableSelected = selectedAsset && selectedAsset.description.startsWith("consumable");

        setIsVehicle(isVehicleSelected);
        setIsConsumable(isConsumableSelected);

        // If a vehicle is selected, store its MPG (usage rate), else reset it
        setVehicleUsageRate(isVehicleSelected ? selectedAsset.usageRate : null);


        // Handle consumable asset selection
        if (isConsumableSelected) {
            // Extract the unit from the description, e.g., "consumable, unit"
            const [, unit] = selectedAsset.description.split(",");
            const unitPrice = selectedAsset.value / selectedAsset.usageRate
            setExpenseData(prevData => ({
                ...prevData,
                unitPrice: unitPrice,
                unit: unit // Update the unit based on the asset's description
            }));
        } else if (!isVehicleSelected) {
            // Reset unit if not a vehicle and not a consumable
            setExpenseData(prevData => ({
                ...prevData,
                unit: ''
            }));
        }
    }

    setExpenseData(prevData => ({
        ...prevData,
        [name]: value
    }));

    // Immediately calculate and update amount if any relevant field changes and it's a vehicle expense
    if (isVehicle && (name === "quantity" || name === "unitPrice" || name === "asset")) {
        calculateAndSetAmount(value, name);
    }
    if (isConsumable && (name === "quantity" || name === "unitPrice" || name === "asset")) {
      calculateAndSetAmountConsumable(value, name);
  }
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

    // Remove asset and employee fields if they are empty to prevent casting errors
    if (!formattedExpense.asset) delete formattedExpense.asset;
    if (!formattedExpense.employee) delete formattedExpense.employee;

    try {
        const response = await fetch(`${baseUrl}/expense`, { // Ensure the endpoint matches your backend API route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formattedExpense),
        });

        if (response.ok) {
            //const addedExpense = await response.json();
            // Assuming there's a way to update the parent component or context that holds the expenses state
            // For example, if this component was passed a method to update the expenses in the parent component:
            // updateExpenses([...expenses, addedExpense]);
            refreshProjects && refreshProjects();
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
        {/* Common fields for all expense types */}
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
              value={expenseData.project}
              onChange={handleChange}
              required
            >
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>{project.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
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
            <MenuItem value="Single Expense">Single Expense</MenuItem>
            <MenuItem value="Asset Expense">Asset Expense</MenuItem>
            <MenuItem value="Unit Expense">Unit Expense</MenuItem>
            <MenuItem value="Employee Expense">Employee Expense</MenuItem>
          </Select>
        </FormControl>
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={expenseData.description}
            onChange={handleChange}
            required
          />
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
            InputProps={{
                readOnly: isVehicle || isConsumable, // Make amount field read-only if an asset is a vehicle
            }}
          />


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
            <TextField
              margin="dense"
              id="quantity"
              name="quantity"
              label={isVehicle ? "Miles Driven" : isConsumable ? "Units Used" : "Quantity"}
              type="number"
              fullWidth
              variant="outlined"
              value={expenseData.quantity}
              onChange={handleChange}
              required
            />
            
            <TextField
                margin="dense"
                id="unitPrice"
                name="unitPrice"
                label={isVehicle ? "$/Gallon of Gas" : isConsumable ? "$/Unit" : "Unit Price"}
                type="number"
                fullWidth
                variant="outlined"
                value={expenseData.unitPrice}
                onChange={handleChange}
                  required
            />
            {isVehicle && (
                <TextField
                    margin="dense"
                    id="unit"
                    name="unit"
                    label="Unit"
                    type="text"
                    fullWidth
                    value="Miles" // For vehicles, set this statically to "Miles"
                    variant="outlined"
                    InputProps={{
                        readOnly: true, // Make the field read-only if it's a vehicle
                    }}
                />
            )}
            {isConsumable && (
                <TextField
                    margin="dense"
                    id="unit"
                    name="unit"
                    label="Unit"
                    type="text"
                    fullWidth
                    value={expenseData.unit} // For vehicles, set this statically to "Miles"
                    variant="outlined"
                    InputProps={{
                        readOnly: true, // Make the field read-only if it's a vehicle
                    }}
                />
            )}
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


export default AddExpense;
