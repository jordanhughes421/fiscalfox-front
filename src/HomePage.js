import React, { useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import { useAuth } from './AuthContext'; // Import useAuth only

function HomePage() {
    const { isLoggedIn, logout } = useAuth(); // Removed setIsLoggedIn since it's not directly used here

    return (
        <>
            <nav>
                {isLoggedIn ? (
                    // If logged in, welcome the user and provide a logout button
                    <div>Welcome, user! <button onClick={logout}>Logout</button></div>
                ) : (
                    // If not logged in, suggest to log in or register
                    <div>Please log in or register.</div>
                )}
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    { !isLoggedIn && ( // Only show these links if the user is not logged in
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

            <Outlet />
        </>
    );
}

export default HomePage;
