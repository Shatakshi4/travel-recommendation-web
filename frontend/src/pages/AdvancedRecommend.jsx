import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StarRatingDisplay from './StarRatingDisplay';
import './AdvancedRecommend.css';
import { jwtDecode } from 'jwt-decode';

const AdvancedRecommend = () => {
  const [mode, setMode] = useState('similar_to_place');
  const [allPlaces, setAllPlaces] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [preferenceText, setPreferenceText] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userUsername = token ? jwtDecode(token).sub : null;

  const checkPremiumStatus = useCallback(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsPremium(decodedToken.is_premium || false);
      } catch (err) {
        console.error('Error decoding token:', err);
        setIsPremium(false);
      }
    } else {
      setIsPremium(false);
    }
  }, [token]);

  const logActivity = useCallback(async (placeId, activityType, feedbackRating = null) => {
    if (!userUsername) return;
    try {
      await axios.post('http://127.0.0.1:5000/api/log_activity', {
        user_username: userUsername,
        place_id: placeId,
        activity_type: activityType,
        rating_feedback: feedbackRating,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`Activity logged: ${activityType} for place ID ${placeId} (Feedback: ${feedbackRating})`);
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  }, [userUsername, token]);


  useEffect(() => {
    checkPremiumStatus();
    const fetchAllPlaces = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/places');
        setAllPlaces(response.data);
      } catch (err) {
        console.error('Error fetching all places:', err);
        setError('Failed to load places for selection.');
      }
    };
    fetchAllPlaces();
  }, [checkPremiumStatus]);

  const handleUpgrade = async () => {
    if (!token) {
      console.log('Please login to upgrade your account.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/upgrade_premium', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data.msg);
      localStorage.setItem('token', response.data.access_token);
      checkPremiumStatus();
      setShowUpgradeModal(false);
    } catch (err) {
      console.error('Upgrade failed:', err.response ? err.response.data : err);
      console.log(err.response?.data?.error || 'Failed to upgrade account.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendations([]);

    let payload = { mode: mode };
    if (mode === 'similar_to_place') {
      if (!selectedPlaceId) {
        setError('Please select a place.');
        setLoading(false);
        return;
      }
      payload.place_id = parseInt(selectedPlaceId);
    } else if (mode === 'discover_by_preference') {
      if (!preferenceText.trim()) {
        setError('Please enter your preferences.');
        setLoading(false);
        return;
      }
      payload.preference_text = preferenceText.trim();
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/advanced_recommendations', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRecommendations(response.data);
      if (response.data.length === 0) {
        setError('No recommendations found for your criteria.');
      }
    } catch (err) {
      console.error('Error fetching advanced recommendations:', err.response ? err.response.data : err);
      setError(err.response?.data?.error || 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceClick = (place) => {
    navigate('/place-details', { state: { place } });
  };

  const handleFeedback = (placeId, feedbackType) => {
    if (!userUsername) {
      console.log('Please log in to provide feedback.');
      return;
    }
    const rating = feedbackType === 'positive' ? 5 : 1;
    logActivity(placeId, `feedback_${feedbackType}`, rating);
  };


  return (
    <div className="advanced-recommend-container">
      <h2>Advanced Travel Recommendations</h2>

      {!isPremium && (
        <div className="premium-overlay">
          <p className="premium-message">This is a premium feature. Please log in and upgrade your account to access personalized recommendations!</p>
          <button className="upgrade-button" onClick={() => setShowUpgradeModal(true)}>Upgrade to Premium</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="advanced-recommend-form" style={{ filter: isPremium ? 'none' : 'blur(5px)' }}>
        <div className="mode-selection">
          <label>
            <input
              type="radio"
              value="similar_to_place"
              checked={mode === 'similar_to_place'}
              onChange={() => setMode('similar_to_place')}
              disabled={!isPremium}
            />
            Similar to a Place
          </label>
          <label>
            <input
              type="radio"
              value="discover_by_preference"
              checked={mode === 'discover_by_preference'}
              onChange={() => setMode('discover_by_preference')}
              disabled={!isPremium}
            />
            Discover by Preference
          </label>
        </div>

        {mode === 'similar_to_place' && (
          <div className="form-group">
            <label htmlFor="select-place">Select a Place:</label>
            <select
              id="select-place"
              value={selectedPlaceId}
              onChange={(e) => setSelectedPlaceId(e.target.value)}
              disabled={loading || !isPremium}
            >
              <option value="">-- Choose a Place --</option>
              {allPlaces.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.Place} ({place.City}, {place.State})
                </option>
              ))}
            </select>
          </div>
        )}

        {mode === 'discover_by_preference' && (
          <div className="form-group">
            <label htmlFor="preference-text">Describe your preferences:</label>
            <textarea
              id="preference-text"
              value={preferenceText}
              onChange={(e) => setPreferenceText(e.target.value)}
              placeholder="e.g., 'historical sites with good food', 'peaceful beaches for relaxation', 'adventure sports in the mountains'"
              rows="4"
              disabled={loading || !isPremium}
            ></textarea>
          </div>
        )}

        <button type="submit" disabled={loading || !isPremium}>
          {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {loading && (
        <div className="loading-spinner-container">
          <div className="spinner"></div>
          <p className="loading-message">Loading recommendations...</p>
        </div>
      )}

      {!loading && !error && recommendations.length > 0 && (
        <div className="recommendations-grid">
          <h3>Your Personalized Recommendations:</h3>
          {recommendations.map((place) => (
            <div key={place.id} className="place-card">
              <img 
                src={place.single_image || place.Image?.split(',')[0] || "https://placehold.co/400x250/cccccc/333333?text=No+Image"} 
                alt={place.Place} 
                className="place-card-image"
                onError={(e) => e.target.src = "https://placehold.co/400x250/cccccc/333333?text=No+Image"}
              />
              <div className="place-card-info">
                <h3>{place.Place}</h3>
                <p><strong>City:</strong> {place.City}</p>
                <p><strong>State:</strong> {place.State}</p>
                <p><strong>Type:</strong> {place.Type}</p>
                <p>
                  <strong>Rating:</strong> 
                  {place.average_rating > 0 ? (
                    <StarRatingDisplay rating={place.average_rating} />
                  ) : (
                    ' Not yet rated'
                  )}
                </p>
                <p className="place-card-desc">{place.place_desc ? place.place_desc.substring(0, 100) + '...' : 'No description available.'}</p>
                <div className="place-card-actions">
                    <button onClick={() => handlePlaceClick(place)} className="view-details-button">
                        View Details
                    </button>
                    {userUsername && (
                        <div className="feedback-buttons">
                            <button onClick={() => handleFeedback(place.id, 'positive')} className="feedback-like-button">👍</button>
                            <button onClick={() => handleFeedback(place.id, 'negative')} className="feedback-dislike-button">👎</button>
                        </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && recommendations.length === 0 && (mode === 'similar_to_place' || mode === 'discover_by_preference') && (
        <p className="no-results-message">No recommendations found for your selection. Try a different input.</p>
      )}

      {showUpgradeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Unlock Premium Recommendations!</h3>
            <p>Access our advanced, AI-powered personalized recommendations by upgrading to a premium account.</p>
            <button className="modal-button primary" onClick={handleUpgrade}>Upgrade Now (Free Trial)</button>
            <button className="modal-button secondary" onClick={() => setShowUpgradeModal(false)}>No Thanks</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedRecommend;
