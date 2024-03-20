import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import HomePage from './Components/HomePage/HomePage'; // Make sure the path to your HomePage component is correct
import Login from './Components/auth/login';
import Register from './Components/auth/register';
import { AuthProvider } from './Components/auth/AuthContext';
import Navbar from './Components/Navbar/navbar';

function App() {
  const authenticate = () => new Promise((resolve) => setTimeout(resolve, 2000)) // 2 seconds

  useEffect(() => {
    authenticate().then(() => {
      const ele = document.getElementById('ipl-progress-indicator')
      if (ele) {
        // fade out
        ele.classList.add('available')
        setTimeout(() => {
          // remove from DOM
          ele.outerHTML = ''
        }, 2000)
      }
    })
  }, [])
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Navbar/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            {/* Define more routes here as needed */}
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
