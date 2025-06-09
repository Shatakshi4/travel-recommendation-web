import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './PlaceDetails.css';
import axios from 'axios';
import ReviewsSection from './ReviewsSection';
import StarRatingDisplay from './StarRatingDisplay';
import { jwtDecode } from 'jwt-decode';

const PlaceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialPlace = location.state?.place;
  const token = localStorage.getItem('token');
  const { placeName: placeNameFromParams } = useParams();

  // const { placeName } = useParams();

  const [placeDetails, setPlaceDetails] = useState(null);
  const [loadingPlace, setLoadingPlace] = useState(true);
  const [placeError, setPlaceError] = useState(null);
  const [favoriteStatus, setFavoriteStatus] = useState(""); // 'added' or 'exists'
  const [showFavoriteMsg, setShowFavoriteMsg] = useState(false);

  const placeName = initialPlace?.Place || placeNameFromParams;

  const logActivity = useCallback(async (placeId, activityType) => {
    if (!token) return;
    try {
      const username = jwtDecode(token).sub;
      await axios.post('http://127.0.0.1:5000/api/log_activity', {
        user_username: username,
        place_id: placeId,
        activity_type: activityType,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`Activity logged: ${activityType} for place ID ${placeId}`);
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  }, [token]);

   
const handleAddToFavorites = async () => {
  if (!token || !placeDetails?.Place || !placeDetails?.State) return;

  try {
    const response = await axios.post('http://127.0.0.1:5000/favorite', {
      place_name: placeDetails.Place,
      state: placeDetails.State,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data?.already_added) {
      setFavoriteStatus("exists");
    } else {
      setFavoriteStatus("added");
    }

    setShowFavoriteMsg(true);
    setTimeout(() => setShowFavoriteMsg(false), 2500);
  } catch (err) {
    console.error('Error adding to favorites:', err);
  }
};


  useEffect(() => {
    const fetchFullPlaceDetails = async () => {
      if (!placeName) {
        setPlaceError("No place name provided.");
        setLoadingPlace(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/places/${encodeURIComponent(placeName)}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        });
        setPlaceDetails(response.data);
        if (response.data && response.data.id) {
          logActivity(response.data.id, 'view');
        }
      } catch (err) {
        console.error("Error fetching full place details:", err);
        setPlaceError("Failed to load place details.");
      } finally {
        setLoadingPlace(false);
      }
    };

    fetchFullPlaceDetails();
  }, [placeName, logActivity, token]);

  const imageLinks = placeDetails?.Image ? placeDetails.Image.split(',') : [];
  const mapQuery = `${placeDetails?.Place}, ${placeDetails?.City}, ${placeDetails?.State}`;

  if (loadingPlace) return <p className="loading-message">Loading place details...</p>;
  if (placeError) return <p className="error-message">{placeError}</p>;
  if (!placeDetails) return <p className="info-message">Place details not found.</p>;

  return (
    <div className="place-details-container">
      <div className="sticky-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h2>{placeDetails.Place}</h2>
        {token && (
  <button onClick={handleAddToFavorites} className="favorite-button">
    ❤️ Favorite
  </button>
)}

      </div>
      {showFavoriteMsg && (
  <div className="popup-message">
    {favoriteStatus === "added"
      ? "✅ Added to favorites!"
      : "⚠️ Already in favorites!"}
  </div>
)}

      <div className="image-container">
        <img
          src={placeDetails.single_image || placeDetails.Image?.split(',')[0] || "https://placehold.co/600x400/cccccc/333333?text=No+Image"}
          alt={placeDetails.Place}
          className="place-main-image"
          onError={(e) => (e.target.src = "https://placehold.co/600x400/cccccc/333333?text=No+Image")}
        />
      </div>

      <div className="details-grid">
        <div className="info-card">
          <h3>Information</h3>
          <p><strong>City:</strong> {placeDetails.City}</p>
          <p><strong>State:</strong> {placeDetails.State}</p>
          <p><strong>Type:</strong> {placeDetails.Type}</p>
          <p>
            <strong>Average Rating:</strong>
            {placeDetails.average_rating > 0 ? (
              <StarRatingDisplay rating={placeDetails.average_rating} />
            ) : (
              ' Not yet rated'
            )}
          </p>
          <p><strong>Description:</strong> {placeDetails.place_desc || 'No description available.'}</p>
        </div>

        <div className="map-container">
          <iframe
            title="Google Map"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
            allowFullScreen
          />
        </div>
      </div>

      <ReviewsSection
        placeId={placeDetails.Place}
        initialAverageRating={placeDetails.average_rating}
      />

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
                onError={(e) => (e.target.src = "https://placehold.co/400x250/cccccc/333333?text=No+Image")}
              />
            ))}
          </div>
        </div>
      )}

      <a
        href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(mapQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="view-more-photos-link"
      >
        View more photos on Google Images
      </a>
    </div>
  );
};

export default PlaceDetails;
