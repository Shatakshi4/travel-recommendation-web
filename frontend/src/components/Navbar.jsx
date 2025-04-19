// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">WanderGo</div>
      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
         {isLoggedIn ? (
          <>
        <li><Link to="/recommend">Recommendations</Link></li>
        <li><Link to="/favorites">Favorites</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/places">All places</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
        </>
         ) : (
          <>
          <li><button onClick={() => navigate('/login')}>Login</button></li>
            <li><button onClick={() => navigate('/register')}>Register</button></li>
          </>
         )}
      </ul>
    </nav>
  );
};

export default Navbar;
