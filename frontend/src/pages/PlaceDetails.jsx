// src/pages/PlaceDetails.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PlaceDetails.css';
import axios from 'axios';

const PlaceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const place = location.state?.place;

  if (!place) {
    return <div className="place-details-container">Invalid Place</div>;
  }

  const handleRemoveFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          place_name: place.Place,
          state: place.State,
        },
      });
      alert('Removed from favorites');
      navigate('/favorites');
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      alert('Error removing favorite');
    }
  };

  const mapQuery = `${place.Place}, ${place.City}, ${place.State}`;

  return (
    <div className="place-details-container">
      
      <h2>{place.Place || place.name}</h2>
<p><strong>State:</strong> {place.State || 'N/A'}</p>
<p><strong>City:</strong> {place.City || place.name}</p>
<p><strong>Rating:</strong> {place.Ratings || 'Not rated'}</p>
<p><strong>Type:</strong> {place.Type || place.knownFor}</p>
<p><strong>Description:</strong> {place.Place_desc || place.description}</p>

      <div className="map-container">
        <iframe
          title="Google Map"
          width="100%"
          height="300"
          frameBorder="0"
          style={{ border: 0 }}
          src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
          allowFullScreen
        />
      </div>

      {location.state?.fromFavorites && (
        <button className="remove-btn" onClick={handleRemoveFavorite}>
          Remove from Favorites
        </button>
      )}
    </div>
  );
};

export default PlaceDetails;
