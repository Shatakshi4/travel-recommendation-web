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
    const userUsername = token ? jwtDecode(token).sub : null; // userUsername is not used in JSX, but useful for debugging if needed

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
            // Provide a more user-friendly error if token is expired/invalid
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('Your session has expired. Please log in again.');
                localStorage.removeItem('token'); // Clear invalid token
            } else {
                setError(err.response?.data?.error || 'Failed to load dashboard data. Please try again.');
            }
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

    // Mapping for activity types for better readability
    const activityTypeMap = {
        'view': 'Viewed',
        'search': 'Searched for',
        'recommendation_shown': 'Was shown a recommendation for',
        'feedback_positive': 'Gave positive feedback on',
        'feedback_negative': 'Gave negative feedback on',
    };

    if (loading) return <p className="loading-message">Loading your dashboard...</p>;
    if (error) return <p className="error-message">{error}</p>;
    // Check if userData is null/undefined after loading and error checks
    if (!userData) return <p className="info-message">No user data available. Please ensure you are logged in correctly.</p>;

    return (
        <div className="dashboard-container">
            <h2>Welcome, {userData.name || 'Traveler'}!</h2> {/* Fallback for name */}
            <p>Email: {userData.email || 'N/A'}</p> {/* Fallback for email */}

            <div className="dashboard-sections">
                {/* Favorites Section */}
                <div className="dashboard-section favorites">
                    <h3>Your Favorites</h3>
                    {userData.favorites && userData.favorites.length > 0 ? (
                        <ul>
                            {/* Use a unique ID for key if available, otherwise a combination */}
                            {userData.favorites.map((fav, index) => (
                                <li key={fav.id || `${fav}-${index}`}>
                                    {/* Assuming fav is a string like "Place Name" or an object {id, PlaceName} */}
                                    {fav.PlaceName || fav}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You haven't favorited any places yet. Start exploring!</p>
                    )}
                    {/* Add a button here if you want to navigate to a "Browse Favorites" page */}
                    {userData.favorites && userData.favorites.length > 0 && (
                        <div className="section-buttons">
                           <button onClick={() => navigate('/favorites')} className="view-favorites-button">
                                View All Favorites
                            </button>
                        </div>
                    )}
                </div>

                {/* Preferences Section */}
                <div className="dashboard-section preferences">
                    <h3>Your Preferences</h3>
                    {/* Check for preferences and if they have meaningful data beyond just an empty object */}
                    {userData.preferences && Object.keys(userData.preferences).some(key => userData.preferences[key] && key !== 'id') ? (
                        <div>
                            <p><strong>Travel Style:</strong> {userData.preferences.preferred_travel_style || 'Not set'}</p>
                            <p><strong>Budget:</strong> {userData.preferences.preferred_budget || 'Not set'}</p>
                            <p><strong>Preferred Types:</strong> {userData.preferences.preferred_types || 'Not set'}</p>
                        </div>
                    ) : (
                        <p>You haven't set your preferences yet. Setting them helps us give better recommendations!</p>
                    )}
                    {/* Wrap buttons in the section-buttons div */}
                    <div className="section-buttons">
                        <button onClick={() => navigate('/preferences')} className="preferences-button">
                            Manage Preferences
                        </button>
                        {/* NEW: Button to view personalized recommendations */}
                        <button onClick={() => navigate('/personalized-recommendations')} className="view-personalized-recommendations-button">
                            View Personalized Recommendations
                        </button>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="dashboard-section recent-activity">
                    <h3>Recent Activity</h3>
                    {userData.recent_activity && userData.recent_activity.length > 0 ? (
                        <ul>
                            {userData.recent_activity.map((activity) => (
                                <li key={activity.id || `${activity.timestamp}-${activity.Place || activity.search_query}`}>
                                    {/* Display activity type, then place/query, then timestamp */}
                                    {activityTypeMap[activity.activity_type] || activity.activity_type}
                                    {' '}
                                    {activity.Place && (
                                        <span
                                            className="activity-place"
                                            onClick={() => navigate('/place-details', { state: { place: { Place: activity.Place, City: activity.City, State: activity.State } } })}
                                            title={`View details for ${activity.Place}`} // Add title for accessibility
                                        >
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
                        <p>No recent activity recorded. Start interacting with places to see your history!</p>
                    )}
                </div>
            </div>

            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
};

export default Dashboard;