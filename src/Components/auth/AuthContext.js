import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initial check to see if the user is logged in based on localStorage
    return localStorage.getItem('isLoggedIn') === 'true';
  });

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
