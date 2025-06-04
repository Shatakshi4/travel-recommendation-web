import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './UserPreferences.css';

const UserPreferences = () => {
  const [preferences, setPreferences] = useState({
    preferred_travel_style: '',
    preferred_budget: '',
    preferred_types: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [allPlaceTypes, setAllPlaceTypes] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userUsername = token ? jwtDecode(token).sub : null;

  useEffect(() => {
    const fetchAllTypes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/inferred-types?state=all');
        setAllPlaceTypes(response.data);
      } catch (err) {
        console.error('Error fetching all types:', err);
        setError('Failed to load available place types.');
      }
    };
    fetchAllTypes();
  }, []);

  useEffect(() => {
    if (!userUsername) {
      setError('You must be logged in to manage preferences.');
      setLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/user_preferences', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedPrefs = response.data;
        if (fetchedPrefs.preferred_types) {
          fetchedPrefs.preferred_types = fetchedPrefs.preferred_types.split(',');
        } else {
          fetchedPrefs.preferred_types = [];
        }
        setPreferences(fetchedPrefs);
      } catch (err) {
        console.error('Error fetching preferences:', err);
        setError('Failed to load your preferences.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [userUsername, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'preferred_types') {
      setPreferences((prevPrefs) => {
        const newTypes = checked
          ? [...prevPrefs.preferred_types, value]
          : prevPrefs.preferred_types.filter((type) => type !== value);
        return { ...prevPrefs, preferred_types: newTypes };
      });
    } else {
      setPreferences((prevPrefs) => ({
        ...prevPrefs,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage('');

    if (!userUsername) {
      setError('You must be logged in to save preferences.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...preferences,
        preferred_types: preferences.preferred_types.join(','),
      };

      const response = await axios.post('http://127.0.0.1:5000/api/user_preferences', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.data.msg);
    } catch (err) {
      console.error('Error saving preferences:', err.response ? err.response.data : err);
      setError(err.response?.data?.error || 'Failed to save preferences.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-message">Loading preferences...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!userUsername) return <p className="info-message">Please log in to manage your travel preferences.</p>;

  return (
    <div className="user-preferences-container">
      <h2>Your Travel Preferences</h2>
      <p className="description">Help us personalize your recommendations by telling us about your travel style.</p>

      <form onSubmit={handleSubmit} className="preferences-form">
        <div className="form-group">
          <label htmlFor="travel-style">Preferred Travel Style:</label>
          <select
            id="travel-style"
            name="preferred_travel_style"
            value={preferences.preferred_travel_style}
            onChange={handleChange}
          >
            <option value="">Select a style</option>
            <option value="Relaxation">Relaxation</option>
            <option value="Adventure">Adventure</option>
            <option value="Cultural">Cultural Immersion</option>
            <option value="Foodie">Food & Culinary</option>
            <option value="Nature">Nature & Wildlife</option>
            <option value="Shopping">Shopping & City Life</option>
            <option value="Spiritual">Spiritual & Wellness</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="budget">Preferred Budget:</label>
          <select
            id="budget"
            name="preferred_budget"
            value={preferences.preferred_budget}
            onChange={handleChange}
          >
            <option value="">Select a budget</option>
            <option value="Low">Budget-Friendly</option>
            <option value="Medium">Mid-Range</option>
            <option value="High">Luxury</option>
          </select>
        </div>

        <div className="form-group">
          <label>Preferred Place Types:</label>
          <div className="checkbox-group">
            {allPlaceTypes.map((type) => (
              <label key={type} className="checkbox-label">
                <input
                  type="checkbox"
                  name="preferred_types"
                  value={type}
                  checked={preferences.preferred_types.includes(type)}
                  onChange={handleChange}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default UserPreferences;
