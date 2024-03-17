import React, { useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import { useAuth } from './AuthContext'; // Import useAuth only
import Dashboard from './Dashboard'; // Import Dashboard component

function HomePage() {
    const { isLoggedIn, logout } = useAuth();
    
    return (
        <>
            <nav>
                {isLoggedIn ? (
                    <div>Welcome, user! <button onClick={logout}>Logout</button></div>
                ) : (
                    <div>Please log in or register.</div>
                )}
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    { !isLoggedIn && (
                        <>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/register">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            {isLoggedIn && <Dashboard />} {/* Render Dashboard only if logged in */}

            <Outlet />
        </>
    );
}

export default HomePage;
