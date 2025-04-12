// src/pages/Places.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Places.css';
import axios from 'axios';

const Places = () => {
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    axios.get('http://localhost:5000/places')
      .then(res => setPlaces(res.data))
      .catch(err => console.error('Error fetching places:', err));
  }, []);

  const handlePlaceClick = (place) => {
    navigate('/place-details', { state: { place } }); // Navigate to details page with place data
  };

  return (
    <div className="places-container">
      <h2>All Travel Places</h2>
      <div className="places-list">
        {places.map((place, index) => (
           <div key={index} className="place-card" onClick={() => handlePlaceClick(place)}>
            {/* ✅ Display Image URL from Database */}
            {place.image ? (
              <img
                src={place.image} // Directly use image URL from the database
                alt={place.Place_Name}
                className="place-image"
                onError={(e) => (e.target.src = "/default-image.jpg")} // Fallback for broken images
              />
            ) : (
              <img
                src="/default-image.jpg" // Default image if no image is available
                alt="No Image Available"
                className="place-image"
              />
            )}
            <h3>{place.Place_Name}</h3>
            <h3>{place.Place || "Unknown Place"}</h3> {/* ⬅️ Place Name Below State */}
            <p><strong>State:</strong> {place.State}</p>
            {/* <h3>{place.Place || "Unknown Place"}</h3> ⬅️ Place Name Below State */}
            <p><strong>Type:</strong> {place.Type}</p>
            <p><strong>Rating:</strong> {place.Ratings}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Places;