import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StarRatingDisplay from './StarRatingDisplay';
import { jwtDecode } from 'jwt-decode';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  const stateFilter = queryParams.get('state') || '';
  const cityFilter = queryParams.get('city') || '';
  const typeFilter = queryParams.get('type') || '';
  const minRatingFilter = queryParams.get('min_rating') || '';

  const token = localStorage.getItem('token');
  const userUsername = token ? jwtDecode(token).sub : null;

  const logActivity = useCallback(async (activityType, query = null) => {
    if (!userUsername) return;
    try {
      await axios.post('http://127.0.0.1:5000/api/log_activity', {
        user_username: userUsername,
        place_id: null,
        activity_type: activityType,
        search_query: query,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`Activity logged: ${activityType} for query "${query}"`);
    } catch (err) {
      console.error('Error logging search activity:', err);
    }
  }, [userUsername, token]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      setResults([]);

      try {
        const response = await axios.get('http://127.0.0.1:5000/api/search', {
          params: {
            q: searchQuery,
            state: stateFilter,
            city: cityFilter,
            type: typeFilter,
            min_rating: minRatingFilter,
          },
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        });
        setResults(response.data);
        if (response.data.length === 0) {
          setError('No results found for your search criteria.');
        }
        logActivity('search', searchQuery);

      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, stateFilter, cityFilter, typeFilter, minRatingFilter, logActivity, token]);

  const handlePlaceClick = (place) => {
    navigate('/place-details', { state: { place } });
  };

  if (loading) return <p className="loading-message">Loading search results...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="search-results-container">
      <h2>Search Results for "{searchQuery}"</h2>
      {stateFilter && <p>State: {stateFilter}</p>}
      {cityFilter && <p>City: {cityFilter}</p>}
      {typeFilter && <p>Type: {typeFilter}</p>}
      {minRatingFilter && <p>Min Rating: {minRatingFilter}</p>}

      {results.length === 0 ? (
        <p className="no-results-message">No places found matching your search criteria. Try a different search.</p>
      ) : (
        <div className="results-grid">
          {results.map((place) => (
            <div key={place.id} className="result-card" onClick={() => handlePlaceClick(place)}>
              <img
                src={place.single_image || place.Image?.split(',')[0] || "https://placehold.co/400x250/cccccc/333333?text=No+Image"}
                alt={place.Place}
                className="place-card-image"
                onError={(e) => (e.target.src = "https://placehold.co/400x250/cccccc/333333?text=No+Image")}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
