import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth only




const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com'; // Adjust according to your backend server

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  // State for login form
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way
  
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    };
  
    try {
      // Update the fetch URL to your backend endpoint for login
      const response = await fetch(`${baseUrl}/auth/login`, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
  
      // Handle response data
      console.log(data);
      // Assuming 'data' contains a success indicator or token
      // Store token in localStorage or sessionStorage
      localStorage.setItem('token', data.token); // Assuming 'data.token' is your token
      localStorage.setItem('isLoggedIn', true);
      login(data.token);
      console.log(localStorage.getItem('token'));
      console.log(localStorage.getItem('isLoggedIn'));
      // You might want to save the token to localStorage/sessionStorage here
      navigate('/'); // Redirect to homepage upon successful login
    } catch (error) {
      console.error('Error during login:', error);
      // Display error message to user, maybe in a state variable to be rendered in the UI
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;