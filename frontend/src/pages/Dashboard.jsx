import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Holds user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if no token exists
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data', error);
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>No user data available.</p>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome back, {user.name} 👋</h1>
      <p>Email: {user.email}</p>

      <section className="section">
        <h2>🌟 Recommended for You</h2>
        <div className="card-row">
          {user.recommendations.map((place, index) => (
            <div
              key={index}
              className="card"
              onClick={() => navigate(`/place-details`, { state: { place: { name: place } } })}
            >
              <h3>{place}</h3>
              <p>Explore amazing experiences</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>❤️ Your Favorites</h2>
        <div className="card-row">
          {user.favorites.map((place, index) => (
            <div key={index} className="card">
              <h3>{place}</h3>
              <p>Saved to your list</p>
            </div>
          ))}
        </div>
      </section>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
