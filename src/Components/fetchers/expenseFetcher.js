import React, { useState, useEffect } from 'react';

const baseUrl = 'https://www.fiscalfoxapi.com';

const ExpenseFetcher = () => {
  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newExpense, setNewExpense] = useState({
    project: '',
    description: '',
    amount: '',
    category: '',
    date: '',
    quantity: '',
    unit: '',
    unitPrice: ''
  });

  useEffect(() => {
    const fetchExpensesAndProjects = async () => {
      const token = localStorage.getItem('token');
      console.log('expense fetcher');

      try {
        const [expensesResponse, projectsResponse] = await Promise.all([
          fetch(`${baseUrl}/expense`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }),
          fetch(`${baseUrl}/projects`, { // Adjust this endpoint as needed
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          })
        ]);

        if (expensesResponse.ok && projectsResponse.ok) {
          const expensesData = await expensesResponse.json();
          const projectsData = await projectsResponse.json();
          setExpenses(expensesData);
          setProjects(projectsData);
        } else {
          throw new Error("Failed to fetch expenses or projects");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchExpensesAndProjects();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formattedExpense = {
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      quantity: parseInt(newExpense.quantity, 10) || 0,
      unitPrice: parseFloat(newExpense.unitPrice) || undefined
    };

    try {
      const response = await fetch(`${baseUrl}/expense`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formattedExpense),
      });

      if (response.ok) {
        const addedExpense = await response.json();
        setExpenses([...expenses, addedExpense]);
        setNewExpense({
          project: '',
          description: '',
          amount: '',
          category: '',
          date: '',
          quantity: '',
          unit: '',
          unitPrice: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>My Expenses</h2>
      <ul>
        {expenses.map(expense => (
          <li key={expense._id}>{`${expense.description}: $${expense.amount}`}</li>
        ))}
      </ul>
      <form onSubmit={handleAddExpense}>
        <select
          name="project"
          value={newExpense.project}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a Project</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>{project.name}</option>
          ))}
        </select>
        <input
          name="description"
          value={newExpense.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        />
        <input
          name="amount"
          type="number"
          value={newExpense.amount}
          onChange={handleInputChange}
          placeholder="Amount"
          required
        />
        <input
          name="category"
          value={newExpense.category}
          onChange={handleInputChange}
          placeholder="Category"
          required
        />
        <input
          name="date"
          type="date"
          value={newExpense.date}
          onChange={handleInputChange}
          required
        />
        <input
          name="quantity"
          type="number"
          value={newExpense.quantity}
          onChange={handleInputChange}
          placeholder="Quantity"
        />
        <input
          name="unit"
          value={newExpense.unit}
          onChange={handleInputChange}
          placeholder="Unit"
        />
        <input
          name="unitPrice"
          type="number"
          value={newExpense.unitPrice}
          onChange={handleInputChange}
          placeholder="Unit Price"
        />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseFetcher;
