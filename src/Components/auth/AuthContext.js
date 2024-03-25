import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initial check to see if the user is logged in based on localStorage
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      const baseUrl = 'https://projectfinancetracker-backend-2f2604a2f7f0.herokuapp.com';
      const isLocalLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const token = localStorage.getItem('token');

      if (isLocalLoggedIn && token) {
        try {
          const response = await fetch(`${baseUrl}/projects`, { // Assuming a validate-session endpoint
            method: 'GET', // Using GET instead of POST
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          setIsLoggedIn(response.ok);
          if (!response.ok) {
            // If the session is not valid, clear the relevant localStorage items
            localStorage.removeItem('token');
            localStorage.setItem('isLoggedIn', false);
            localStorage.removeItem('fiscalfoxID');
          }
        } catch (error) {
          console.error("Error validating session:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const logout = () => { // Use camelCase for functions
    localStorage.removeItem('token'); // Remove token from storage
    localStorage.setItem('isLoggedIn', false); // Update isLoggedIn status
    localStorage.removeItem('fiscalfoxID')
    setIsLoggedIn(false); // Update state
  };

  // Ensure there's a function to update the isLoggedIn state based on localStorage
  const login = (token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', true);
    setIsLoggedIn(true); // Update the context state
  };

  
  

  // Provide isLoggedIn and logout function through context
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
