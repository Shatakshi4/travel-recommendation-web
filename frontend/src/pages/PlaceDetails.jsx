// src/pages/PlaceDetails.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PlaceDetails.css';
import axios from 'axios';

const PlaceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const place = location.state?.place;
  
  const [reviews, setReviews] = useState([]);
const [newReview, setNewReview] = useState('');

useEffect(() => {
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/reviews?place=${place.Place}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };
  fetchReviews();
}, [place.Place]);

const handleSubmitReview = async () => {
  try {
    await axios.post(
      'http://localhost:5000/reviews',
      { place: place.Place, review: newReview },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewReview('');
    const updated = await axios.get(`http://localhost:5000/reviews?place=${place.Place}`);
    setReviews(updated.data);
  } catch (err) {
    alert('Failed to post review');
  }
};


  if (!place) {
    return <div className="place-details-container">Invalid Place</div>;
  }
  const token = localStorage.getItem('token');

  const handleRemoveFavorite = async () => {
    try {
      // const token = localStorage.getItem('token');
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
  const imageLinks = place.images
    ? place.images.split(',').map((link) => link.trim()).filter(link => link)
    : [];

    const mainImage = place.single_image || place.image || "/default-image.jpg";

  return(
    <div className="place-details-container">
       {/* Sticky Header */}
      <div className="sticky-header">
        <h2>{place.Place}</h2>
        {location.state?.fromFavorites && (
          <button className="remove-btn" onClick={handleRemoveFavorite}>
            Remove from Favorites
          </button>
        )}
      </div>

      {/* ✅ Display Main Image */}
      <div className="image-container">
        <img
          src={mainImage}
          alt={place.Place || 'Place Image'}
          className="place-image"
          onError={(e) => (e.target.src = "/default-image.jpg")}
        />
      </div>
      <div className="details-map-section">
  <div className="text-details">
    <h2>{place.Place || place.name}</h2>
    <p><strong>State:</strong> {place.State || 'N/A'}</p>
    <p><strong>City:</strong> {place.City || place.name}</p>
    <p><strong>Rating:</strong> {place.Ratings || 'Not rated'}</p>
    <p><strong>Type:</strong> {place.Type || place.knownFor}</p>
    <p><strong>Description:</strong> {place.Place_desc || place.description}</p>
  </div>
  <div className="map-container">
    <iframe
      title="Google Map"
      width="100%"
      height="100%"
      frameBorder="0"
      style={{ border: 0 }}
      src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
      allowFullScreen
    />
  </div>
</div>

{/* ✍️ Reviews Section */}
<div className="reviews-section">
  <h3>User Reviews</h3>
  <ul>
    {reviews.map((r, i) => (
      <li key={i}><strong>{r.username}:</strong> {r.review}</li>
    ))}
  </ul>
  {token && (
    <div className="add-review">
      <textarea
        placeholder="Write your review..."
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
      />
      <button onClick={handleSubmitReview}>Submit Review</button>
    </div>
  )}
</div>

      
      {/* ✅ Image Gallery from 'images' column */}
      {imageLinks.length > 1 && (
        <div className="image-gallery">
          <h3>More Photos</h3>
          <div className="gallery-scroll">
            {imageLinks.map((link, index) => (
              <img
                key={index}
                src={link}
                alt={`Place Image ${index + 1}`}
                className="gallery-img"
                onError={(e) => (e.target.src = "/default-image.jpg")}
              />
            ))}
          </div>
        </div>
      )}

      {/* 🔗 Google Image Search */}
      <a
        href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(mapQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="view-more-images-link"
      >
        View more images on Google
      </a>
    </div>
  );
};

      
{/* 

      {location.state?.fromFavorites && (
        <button className="remove-btn" onClick={handleRemoveFavorite}>
          Remove from Favorites
        </button>
      )}
    </div>
  );
}; */}

export default PlaceDetails;
