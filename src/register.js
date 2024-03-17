// HomePage.js example
import { Outlet, Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './register.css'
import React, { useState } from 'react';
const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com/'; // Adjust according to your backend server

function Register() {
  const navigate = useNavigate();
  // State for registration form
  const [formData, setFormData] = useState({
    username: '',
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
      // Update the fetch URL to your backend endpoint for registration
      const response = await fetch(`${baseUrl}/auth/register`, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
  
      // Handle response data
      console.log(data);
      localStorage.setItem('token', data.token); // Assuming 'data.token' is your token
      localStorage.setItem('isLoggedIn', true);
      navigate('/');// Redirect the user or show a success message
      
      // For example, if login is successful, you might want to redirect
      // window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error('Error during registration:', error);
      // Display error message to user
    }
  };

    return (
    <div className="register-container">
      <div className="form-wrapper">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <input
              type="email"
              name="email"
              placeholder="Email Id"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="submit-container">
            <button type="submit" className="submit-btn">Sign Up</button>
          </div>
          <div className="login-container">
            <span>Already have an account?</span>
            <button onClick={() => navigate('/login')} className="login-btn">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;