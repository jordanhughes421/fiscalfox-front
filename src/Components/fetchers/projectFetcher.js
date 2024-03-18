import React, { useState, useEffect } from 'react';

const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com';

const ProjectFetcher = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]); // New state for storing revenues

  useEffect(() => {
    const fetchProjectsExpensesAndRevenues = async () => {
      const token = localStorage.getItem('token');

      try {
        const [expensesResponse, projectsResponse, revenuesResponse] = await Promise.all([
          fetch(`${baseUrl}/expense`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }),
          fetch(`${baseUrl}/projects`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }),
          fetch(`${baseUrl}/revenue`, { // Fetching revenue data
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          })
        ]);

        if (expensesResponse.ok && projectsResponse.ok && revenuesResponse.ok) {
          const expensesData = await expensesResponse.json();
          const projectsData = await projectsResponse.json();
          const revenuesData = await revenuesResponse.json(); // Getting revenues data
          setExpenses(expensesData);
          setRevenues(revenuesData); // Setting the revenues state
          
          // Combining projects with their expenses and revenues
          const projectsWithExpensesAndRevenues = projectsData.map(project => {
            const projectExpenses = expensesData.filter(expense => project.expenses.includes(expense._id));
            const projectRevenues = revenuesData.filter(revenue => project._id === revenue.project);

            // Calculating total expenses and revenues for the project
            const totalExpenses = projectExpenses.reduce((acc, curr) => acc + curr.amount, 0);
            const totalRevenues = projectRevenues.reduce((acc, curr) => acc + curr.amount, 0);

            // Calculating profit for the project
            const profit = totalRevenues - totalExpenses;

            return {
              ...project,
              expenses: projectExpenses,
              revenues: projectRevenues,
              profit, // Adding profit to the project object
            };
          });

          setProjects(projectsWithExpensesAndRevenues);
        } else {
          throw new Error("Failed to fetch expenses, revenues, or projects");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProjectsExpensesAndRevenues();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    const userID = localStorage.getItem('fiscalfoxID');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${baseUrl}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newProjectName, user: userID }), // Adjusted to match expected user ID format
      });
      if (response.ok) {
        const newProject = await response.json();
        setProjects([...projects, { ...newProject, expenses: [], revenues: [] }]);
        setNewProjectName(''); // Reset the input field after successful addition
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add project");
      }
    } catch (error) {
      console.error("Error adding project:", error.message);
    }
  };

  return (
    <div>
      <h2>My Projects</h2>
      {projects.map(project => (
        <div key={project._id}>
          <h3>{project.name}</h3>
          <h5>Expenses:</h5>
          <ul>
            {project.expenses.map(expense => (
              <li key={expense._id}>{expense.description}: ${expense.amount}</li>
            ))}
          </ul>
          <h5>Revenues:</h5>
          <ul>
            {project.revenues.map(revenue => (
              <li key={revenue._id}>{revenue.description}: ${revenue.amount}</li>
            ))}
          </ul>
          <h5>Profit: ${project.profit}</h5> {/* Displaying profit */}
        </div>
      ))}
      <form onSubmit={handleAddProject}>
        <input
          type="text"
          value={newProjectName}
          onChange={e => setNewProjectName(e.target.value)}
          placeholder="New Project Name"
          required
        />
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default ProjectFetcher;
