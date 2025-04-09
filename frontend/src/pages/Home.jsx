// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to TravelMate 🌍</h1>
        <p>Your smart travel recommendation companion!</p>
        <div className="home-buttons">
          <button onClick={() => navigate('/recommend')}>Explore Recommendations</button>
          <button onClick={() => navigate('/favorites')}>View Favorites</button>
          <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          <button onClick={() => navigate('/profile')}>View Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Home;

