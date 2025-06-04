import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import StarRatingDisplay from './StarRatingDisplay'; // Assuming this component exists
import './PersonalizedRecommendations.css'; // New CSS file for this component

const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userUsername = token ? jwtDecode(token).sub : null;

  // Check premium status
  const checkPremiumStatus = useCallback(() => {
    console.log('checkPremiumStatus called');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const premiumStatus = decodedToken.is_premium || false;
        setIsPremium(premiumStatus);
        console.log('Decoded token premium status:', premiumStatus);
      } catch (err) {
        console.error('Error decoding token:', err);
        setIsPremium(false);
      }
    } else {
      setIsPremium(false);
      console.log('No token found, isPremium set to false.');
    }
  }, [token]);

  // Log user activity (feedback)
  const logActivity = useCallback(async (placeId, activityType, feedbackRating = null) => {
    if (!userUsername) {
      console.log('Cannot log activity: User not logged in.');
      return;
    }
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

  // Effect to run checkPremiumStatus on component mount and when token changes
  useEffect(() => {
    checkPremiumStatus();
  }, [checkPremiumStatus]);


  // Fetch preferences and then recommendations
  useEffect(() => {
    console.log('PersonalizedRecommendations useEffect triggered.');
    console.log('Current userUsername:', userUsername);
    console.log('Current isPremium state:', isPremium);
    console.log('Current loading state:', loading);


    const fetchPreferencesAndRecommendations = async () => {
      console.log('fetchPreferencesAndRecommendations function called.');
      if (!userUsername) {
        setError('Please log in to view personalized recommendations.');
        setLoading(false);
        console.log('Not logged in, setting error and stopping loading.');
        return;
      }

      // This check is important: if not premium, show modal and stop loading
      if (!isPremium) {
        setShowUpgradeModal(true);
        setLoading(false);
        console.log('Not premium, showing upgrade modal and stopping loading.');
        return;
      }

      setLoading(true);
      setError(null);
      setRecommendations([]);
      console.log('Starting fetch for recommendations...');

      try {
        // 1. Fetch user preferences
        console.log('Fetching user preferences...');
        const prefsResponse = await axios.get('http://127.0.0.1:5000/api/user_preferences', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userPreferences = prefsResponse.data;
        console.log('User preferences fetched:', userPreferences);

        // Construct preference text from fetched preferences
        let preferenceText = '';
        if (userPreferences.preferred_travel_style) {
          preferenceText += userPreferences.preferred_travel_style + ' ';
        }
        if (userPreferences.preferred_budget) {
          preferenceText += userPreferences.preferred_budget + ' ';
        }
        if (userPreferences.preferred_types) {
          preferenceText += userPreferences.preferred_types.replace(/,/g, ' ') + ' ';
        }
        
        // If no preferences are set, inform the user
        if (!preferenceText.trim()) {
          setError('No preferences set. Please go to your Dashboard and set your preferences to get personalized recommendations.');
          setLoading(false);
          console.log('No preferences set, setting error and stopping loading.');
          return;
        }
        console.log('Generated preference text:', preferenceText.trim());

        // 2. Request advanced recommendations based on preferences
        console.log('Requesting advanced recommendations...');
        const recommendationsResponse = await axios.post('http://127.0.0.1:5000/api/advanced_recommendations', {
          mode: 'discover_by_preference',
          preference_text: preferenceText.trim(),
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecommendations(recommendationsResponse.data);
        console.log('Recommendations received:', recommendationsResponse.data);

        if (recommendationsResponse.data.length === 0) {
          setError('No personalized recommendations found based on your preferences. Try adjusting them!');
          console.log('No recommendations found.');
        }
      } catch (err) {
        console.error('Error fetching personalized recommendations:', err.response ? err.response.data : err);
        setError(err.response?.data?.error || 'Failed to fetch personalized recommendations. Please try again.');
        console.log('Error during recommendation fetch:', err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
        console.log('Finished loading recommendations.');
      }
    };

    // Only attempt to fetch if user is logged in AND is premium.
    // The `loading` state is also a dependency to ensure it re-runs if `loading`
    // was initially false (e.g., due to an error) and then becomes true again.
    if (userUsername && isPremium) {
        fetchPreferencesAndRecommendations();
    } else if (userUsername && !isPremium && !showUpgradeModal) { // If logged in but not premium, and modal not yet shown
        setShowUpgradeModal(true);
        setLoading(false);
        console.log('User is logged in but not premium, showing upgrade modal.');
    } else if (!userUsername) { // If not logged in
        setLoading(false);
        setError('Please log in to view personalized recommendations.');
        console.log('User not logged in, stopping loading and setting error.');
    }

  }, [userUsername, token, isPremium, logActivity, showUpgradeModal]); // Added showUpgradeModal to dependencies

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
      checkPremiumStatus(); // Re-check premium status to update UI
      setShowUpgradeModal(false);
    } catch (err) {
      console.error('Upgrade failed:', err.response ? err.response.data : err);
      console.log(err.response?.data?.error || 'Failed to upgrade account.');
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

  // Conditional rendering based on loading, error, and premium status
  if (loading) return (
    <div className="personalized-recommendations-container">
      <div className="loading-spinner-container">
        <div className="spinner"></div>
        <p className="loading-message">Loading personalized recommendations...</p>
      </div>
    </div>
  );
  
  if (error) return <p className="error-message">{error}</p>;
  
  // If not premium and modal is shown, only render the modal
  if (!isPremium && showUpgradeModal) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Unlock Premium Recommendations!</h3>
          <p>Access our advanced, AI-powered personalized recommendations by upgrading to a premium account.</p>
          <button className="modal-button primary" onClick={handleUpgrade}>Upgrade Now (Free Trial)</button>
          <button className="modal-button secondary" onClick={() => setShowUpgradeModal(false)}>No Thanks</button>
        </div>
      </div>
    );
  }

  // If premium and no recommendations found
  if (isPremium && recommendations.length === 0) {
    return <p className="no-results-message">No personalized recommendations found based on your preferences. Try adjusting them!</p>;
  }

  // If premium and recommendations are found
  return (
    <div className="personalized-recommendations-container">
      <h2>Your Personalized Recommendations</h2>

      <div className="recommendations-grid">
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
    </div>
  );
};

export default PersonalizedRecommendations;
