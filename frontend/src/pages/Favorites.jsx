// src/pages/Favorites.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // ✅ Import Link
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]); // For storing favorite places
  const [recommendations, setRecommendations] = useState([]); // For storing recommended places
  const [loading, setLoading] = useState(true);

  // Fetch both favorites and recommendations
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch favorite places
      const favoritesRes = await axios.get('http://localhost:5000/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(favoritesRes.data);

      // Fetch recommended places (or any other endpoint that gives you recommendations)
      const recommendationsRes = await axios.get('http://localhost:5000/recommendations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecommendations(recommendationsRes.data);
    } catch (err) {
      console.error('Error fetching favorites or recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Remove a place from the favorites list
  const removeFavorite = async (placeName, state) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { place_name: placeName, state },
      });
      // Update the state by removing the place from the favorites list
      setFavorites(prev =>
        prev.filter(place => !(place.place_name === placeName && place.state === state))
      );
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  // Fetch data when the component is mounted
  useEffect(() => {
    fetchFavorites();
  }, []);

  // Combine favorites and recommendations into one array
  const combinedPlaces = [...favorites, ...recommendations];

  return (
    <div className="favorites-container">
      <h2>Your Favorite and Recommended Places ❤️</h2>
      {loading ? (
        <p>Loading...</p>
      ) : combinedPlaces.length === 0 ? (
        <p>You have no places in your favorites or recommendations yet.</p>
      ) : (
        <div className="favorites-grid">
          {combinedPlaces.map((place, index) => (
            <div className="favorite-card" key={index}>
              {/* ✅ Wrap the card with Link to navigate to PlaceDetails */}
              <Link to={`/placedetails/${place.place_name}`} className="place-link">
              <h3>{place.place_name}</h3>
              <p><strong>State:</strong> {place.state}</p>
              </Link>
              <button className="remove-btn" onClick={() => removeFavorite(place.place_name, place.state)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
