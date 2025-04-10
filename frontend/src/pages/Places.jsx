// src/pages/Places.jsx
import React, { useEffect, useState } from 'react';
import './Places.css';
import axios from 'axios';

const Places = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/places')
      .then(res => setPlaces(res.data))
      .catch(err => console.error('Error fetching places:', err));
  }, []);

  return (
    <div className="places-container">
      <h2>All Travel Places</h2>
      <div className="places-list">
        {places.map((place, index) => (
          <div key={index} className="place-card">
            {/* 🔹 Added Image Section */}
            <img 
              src={`http://localhost:5000/images/${place.Place_Name}`} 
              alt={place.Place_Name} 
              className="place-image" 
              onError={(e) => e.target.src = "/default-image.jpg"} // 🔹 Fallback Image
            />
            <h3>{place.Place_Name}</h3>
            <h3>{place.Place_Name}</h3>
            <p><strong>State:</strong> {place.State}</p>
            <p><strong>Type:</strong> {place.Type}</p>
            <p><strong>Rating:</strong> {place.Ratings}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Places;