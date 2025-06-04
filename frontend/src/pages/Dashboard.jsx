import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userUsername = token ? jwtDecode(token).sub : null;

  const fetchDashboardData = useCallback(async () => {
    if (!token) {
      setError('You must be logged in to view the dashboard.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get('http://127.0.0.1:5000/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err.response ? err.response.data : err);
      setError(err.response?.data?.error || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const activityTypeMap = {
    'view': 'Viewed',
    'search': 'Searched for',
    'recommendation_shown': 'Was shown a recommendation',
    'feedback_positive': 'Gave positive feedback on',
    'feedback_negative': 'Gave negative feedback on',
  };

  if (loading) return <p className="loading-message">Loading dashboard...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!userData) return <p className="info-message">No user data available. Please log in.</p>;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {userData.name}!</h2>
      <p>Email: {userData.email}</p>

      <div className="dashboard-sections">
        {/* Favorites Section */}
        <div className="dashboard-section">
          <h3>Your Favorites</h3>
          {userData.favorites && userData.favorites.length > 0 ? (
            <ul>
              {userData.favorites.map((fav, index) => (
                <li key={index}>{fav}</li>
              ))}
            </ul>
          ) : (
            <p>You haven't favorited any places yet.</p>
          )}
        </div>

        {/* Preferences Section */}
        <div className="dashboard-section">
          <h3>Your Preferences</h3>
          {userData.preferences && Object.keys(userData.preferences).length > 1 ? (
            <div>
              <p><strong>Travel Style:</strong> {userData.preferences.preferred_travel_style || 'Not set'}</p>
              <p><strong>Budget:</strong> {userData.preferences.preferred_budget || 'Not set'}</p>
              <p><strong>Preferred Types:</strong> {userData.preferences.preferred_types || 'Not set'}</p>
            </div>
          ) : (
            <p>You haven't set your preferences yet. This helps us give better recommendations!</p>
          )}
          <button onClick={() => navigate('/preferences')} className="preferences-button">
            Manage Preferences
          </button>
          {/* NEW: Button to view personalized recommendations */}
          <button onClick={() => navigate('/personalized-recommendations')} className="view-personalized-recommendations-button">
            View Personalized Recommendations
          </button>
        </div>

        {/* Recent Activity Section */}
        <div className="dashboard-section">
          <h3>Recent Activity</h3>
          {userData.recent_activity && userData.recent_activity.length > 0 ? (
            <ul>
              {userData.recent_activity.map((activity, index) => (
                <li key={index}>
                  {activityTypeMap[activity.activity_type] || activity.activity_type}
                  {' '}
                  {activity.Place && (
                    <span className="activity-place" onClick={() => navigate('/place-details', { state: { place: { Place: activity.Place, City: activity.City, State: activity.State } } })}>
                      {activity.Place} ({activity.City}, {activity.State})
                    </span>
                  )}
                  {activity.search_query && ` for "${activity.search_query}"`}
                  {activity.rating_feedback && ` (Rating: ${activity.rating_feedback})`}
                  {' '}
                  <span className="activity-timestamp">({new Date(activity.timestamp).toLocaleString()})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent activity recorded.</p>
          )}
        </div>
      </div>

      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default Dashboard;
