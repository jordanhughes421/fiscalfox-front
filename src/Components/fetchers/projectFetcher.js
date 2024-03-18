import React, { useState, useEffect } from 'react';

const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com';

const ProjectFetcher = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpensesAndProjects = async () => {
      const token = localStorage.getItem('token');

      try {
        const [expensesResponse, projectsResponse] = await Promise.all([
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
          })
        ]);

        if (expensesResponse.ok && projectsResponse.ok) {
          const expensesData = await expensesResponse.json();
          const projectsData = await projectsResponse.json();
          // Assuming expensesData and projectsData are arrays
          setExpenses(expensesData);
          // Relate projects with their expenses
          const projectsWithExpenses = projectsData.map(project => {
            return {
              ...project,
              expenses: expensesData.filter(expense => project.expenses.includes(expense._id)),
            };
          });
          setProjects(projectsWithExpenses);
        } else {
          throw new Error("Failed to fetch expenses or projects");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchExpensesAndProjects();
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
        body: JSON.stringify({ name: newProjectName, user: { id:userID }}),
      });
      const newProject = await response.json();
      if (response.ok) {
        setProjects([...projects, { ...newProject, expenses: [] }]);
        setNewProjectName(''); // Reset the input field after successful addition
      } else {
        throw new Error(newProject.message || "Failed to add project");
      }
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  return (
    <div>
      <h2>My Projects</h2>
      {projects.map(project => (
        <div key={project._id}>
          <h3>{project.name}</h3>
          <h5>Project Expenses</h5>
          <ul>
            {project.expenses.map(expense => (
              <li key={expense._id}>{expense.description}: ${expense.amount}</li>
            ))}
          </ul>
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
