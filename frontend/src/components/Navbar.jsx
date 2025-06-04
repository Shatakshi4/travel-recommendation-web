import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(token && token !== 'undefined' && token !== 'null');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')}>WanderGo</div>

      <ul className="nav-links">
        <li><button onClick={() => navigate('/home')}>Home</button></li>
        <li><button onClick={() => navigate('/recommend')}>Recommendations</button></li>
        <li><button onClick={() => navigate('/favorites')}>Favorites</button></li>
        <li><button onClick={() => navigate('/places')}>All places</button></li>
        <li><button onClick={() => navigate('/advanced-recommend')}>AdvancedRecommend</button></li>
        {isLoggedIn ? (
          <li className="profile-menu">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="Profile"
              className="profile-icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="dropdown">
                <button onClick={() => navigate('/dashboard')}>Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
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
