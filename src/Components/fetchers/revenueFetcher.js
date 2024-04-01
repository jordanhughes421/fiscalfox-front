import React, { useState, useEffect } from 'react';

const baseUrl = 'https://www.fiscalfoxapi.com';

const RevenueFetcher = () => {
  const [revenues, setRevenues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newRevenue, setNewRevenue] = useState({
    project: '',
    description: '',
    amount: '',
    category: '',
    date: ''
  });

  useEffect(() => {
    console.log('revenue fetcher');
    const fetchRevenuesAndProjects = async () => {
      const token = localStorage.getItem('token');

      try {
        const [revenuesResponse, projectsResponse] = await Promise.all([
          fetch(`${baseUrl}/revenue`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }),
          fetch(`${baseUrl}/projects`, { // Assuming this endpoint remains the same
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          })
        ]);

        if (revenuesResponse.ok && projectsResponse.ok) {
          const revenuesData = await revenuesResponse.json();
          const projectsData = await projectsResponse.json();
          setRevenues(revenuesData);
          setProjects(projectsData);
        } else {
          throw new Error("Failed to fetch revenues or projects");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRevenuesAndProjects();
  }, []);

  const handleAddRevenue = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formattedRevenue = {
      ...newRevenue,
      amount: parseFloat(newRevenue.amount),
    };

    try {
      const response = await fetch(`${baseUrl}/revenue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formattedRevenue),
      });

      if (response.ok) {
        const addedRevenue = await response.json();
        setRevenues([...revenues, addedRevenue]);
        setNewRevenue({
          project: '',
          description: '',
          amount: '',
          category: '',
          date: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add revenue");
      }
    } catch (error) {
      console.error("Error adding revenue:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRevenue(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>My Revenues</h2>
      <ul>
        {revenues.map(revenue => (
          <li key={revenue._id}>{`${revenue.description}: $${revenue.amount}`}</li>
        ))}
      </ul>
      <form onSubmit={handleAddRevenue}>
        {/* Form fields adjusted as needed based on the revenue model */}
        <select
          name="project"
          value={newRevenue.project}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a Project</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>{project.name}</option>
          ))}
        </select>
        {/* The rest of the inputs remain essentially the same, minus 'quantity', 'unit', and 'unitPrice' */}
        <input
          name="description"
          value={newRevenue.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        />
        <input
          name="amount"
          type="number"
          value={newRevenue.amount}
          onChange={handleInputChange}
          placeholder="Amount"
          required
        />
        <input
          name="category"
          value={newRevenue.category}
          onChange={handleInputChange}
          placeholder="Category"
          required
        />
        <input
          name="date"
          type="date"
          value={newRevenue.date}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Revenue</button>
      </form>
    </div>
  );
};

export default RevenueFetcher;
