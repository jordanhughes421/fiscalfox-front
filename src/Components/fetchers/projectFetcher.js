import React, { useState, useEffect } from 'react';

const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com';

const ProjectFetcher = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      const userID = localStorage.getItem('fiscalfoxID');
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${baseUrl}/projects`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Assuming the token is stored under this key
          }
        });
        const data = await response.json();
        if (response.ok) {
          setProjects(data);
        } else {
          throw new Error(data.message || "Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
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
        setProjects([...projects, newProject]);
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
        <ul key={project._id}>
          <li>{project.name}</li>
          <li>{project.expenses}</li>
        </ul>
          
          
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