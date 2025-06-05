import React, { useEffect, useState, useMemo } from 'react'; // Added useMemo
import { useNavigate } from 'react-router-dom';
import './Places.css';
import axios from 'axios';

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/places');
        setPlaces(res.data);
      } catch (err) {
        console.error('Error fetching places:', err);
        setError('Failed to load places. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const handlePlaceClick = (place) => {
    navigate('/place-details', { state: { place } });
  };

  // Memoize filtered places to prevent unnecessary re-renders
  const filteredPlaces = useMemo(() => {
    if (!searchQuery) {
      return places; // If no search query, return all places
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return places.filter(place =>
      (place.Place && place.Place.toLowerCase().includes(lowerCaseQuery)) ||
      (place.City && place.City.toLowerCase().includes(lowerCaseQuery)) ||
      (place.State && place.State.toLowerCase().includes(lowerCaseQuery)) ||
      (place.Type && place.Type.toLowerCase().includes(lowerCaseQuery))
    );
  }, [places, searchQuery]); // Re-calculate only when places or searchQuery changes

  if (loading) return <p className="info-message">Loading places...</p>; // Use info-message class
  if (error) return <p className="error-message">{error}</p>; // Use error-message class
  if (!places.length && !loading) return <p className="info-message">No places found at the moment. Check back later!</p>;


  return (
    <div className="places-container">
      <h2>All Travel Places</h2>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by name, city, state, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* View Mode Toggle Buttons */}
      <div className="view-toggle-buttons">
        <button
          className={viewMode === 'grid' ? 'active' : ''}
          onClick={() => setViewMode('grid')}
          aria-label="Switch to Grid View"
        >
          Grid View
        </button>
        <button
          className={viewMode === 'list' ? 'active' : ''}
          onClick={() => setViewMode('list')}
          aria-label="Switch to List View"
        >
          List View
        </button>
      </div>

      <div className={`places-list ${viewMode}-view`}>
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => ( // Use filteredPlaces here
            <div key={place.id || place.Place} className="place-card" onClick={() => handlePlaceClick(place)}>
              <img
                src={place.single_image || place.image || "/default-image.jpg"}
                alt={place.Place || "Travel Place"}
                className="place-image"
                onError={(e) => { e.target.src = "/default-image.jpg"; e.target.alt = "Image not available"; }}
              />

              <div className="place-info">
                <h3>{place.Place || "Unknown Place"}</h3>
                <p>
                  <strong>Location:</strong> {place.City ? `${place.City}, ` : ''}{place.State || 'Unknown State'}
                </p>
                <p>
                  <strong>Type:</strong> {place.Type || 'Not specified'}
                </p>
                <p className="place-rating">
                  <strong>Rating:</strong>{' '}
                  {place.average_rating ? (
                    <span>{place.average_rating.toFixed(1)} / 5</span>
                  ) : place.Ratings ? (
                    <span>{place.Ratings}</span>
                  ) : (
                    'N/A'
                  )}
                </p>
                <p className="place-description-snippet">
                  {place.place_desc ? `${place.place_desc.substring(0, 100)}...` : 'No description available.'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="info-message no-results">No places match your search criteria.</p> // Message for no results
        )}
      </div>
    </div>
  );
};

export default Places;