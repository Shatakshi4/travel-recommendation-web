import React, { useState, useEffect } from 'react';
import './Recommend.css';
import { useNavigate } from 'react-router-dom';
import StarRatingDisplay from './StarRatingDisplay'; // Assuming you have this for displaying average_rating

const Recommend = () => {
  const [form, setForm] = useState({
    state: '',
    city: '',
    type: ''
  });

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState(''); // This is for client-side filtering
  const navigate = useNavigate();
  const [showFavoriteMsg, setShowFavoriteMsg] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState(""); // 'added' or 'exists'

  useEffect(() => {
    fetch('http://localhost:5000/states')
      .then(res => res.json())
      .then(data => setStates(data))
      .catch(error => console.error('Error loading states:', error));
  }, []);
  
  useEffect(() => {
    fetch('http://localhost:5000/recommend/random')
      .then(res => res.json())
      .then(data => {
        setResults(data);
      })
      .catch(error => {
        console.error('Error loading default recommendations:', error);
      });
  }, []);
  

  useEffect(() => {
    if (form.state) {
      fetch(`http://localhost:5000/cities?state=${form.state}`)
        .then(res => res.json())
        .then(data => setCities(data));

      fetch(`http://localhost:5000/inferred-types?state=${form.state}`)
        .then(res => res.json())
        .then(data => setTypes(data));
    } else {
      setCities([]);
      setTypes([]);
    }
  }, [form.state]);

  useEffect(() => {
    if (form.city && form.state) {
      fetch(`http://localhost:5000/inferred-types?state=${form.state}&city=${form.city}`)
        .then(res => res.json())
        .then(data => setTypes(data));
    }
  }, [form.city, form.state]); // Added form.state to dependency array

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      setResults(data);
      setMessage(data.length === 0 ? 'No results found for your criteria.' : '');
      console.log('API Results:', data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setMessage('Failed to load recommendations.');
    }
  };

  const addToFavorites = async (placeName, state) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.log('Please login to add to favorites.');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5000/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ place_name: placeName, state: state })
      });
  
      const data = await res.json();
  
      if (data.already_added) {
        setFavoriteStatus("exists");
      } else {
        setFavoriteStatus("added");
      }
  
      setShowFavoriteMsg(true);
      setTimeout(() => setShowFavoriteMsg(false), 2500);
    } catch (error) {
      console.error(error);
      console.log('Error adding to favorites');
    }
  };
  

  const handleSort = (sortBy) => {
    let sorted = [...results];
    if (sortBy === 'rating') {
      // Sort by average_rating, handling potential nulls
      sorted.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    } else if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.Place.localeCompare(b.Place));
    } else if (sortBy === 'state') {
      sorted.sort((a, b) => a.State.localeCompare(b.State));
    }
    setResults(sorted);
  };
  const showRandom = () => {
    if (results.length === 0) {
      setMessage("Please search first to enable 'Surprise Me'.");
      return;
    }
    const shuffled = [...results].sort(() => 0.5 - Math.random());
    setResults(shuffled.slice(0, 5));
  };
  
  const resetFilters = () => {
    setForm({ state: '', city: '', type: '' });
    setResults([]); // Clear results when filters are reset
    setMessage('');
    setSearchQuery(''); // Also clear client-side search query
  };

  // --- MODIFIED: Determine which results to display ---
  const displayedResults = searchQuery
    ? results.filter(place =>
        place.Place.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.City.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.State.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (place.place_desc && place.place_desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (place.Type && place.Type.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : results;// If searchQuery is empty, display all fetched results
   
    
    
  return (
    <div className="recommend-container">
      <h2>Find Travel Recommendations</h2>

      <form className="recommend-form" onSubmit={handleSubmit}>
        <select name="state" value={form.state} onChange={handleChange}>
          <option value="">Select State</option>
          {states.map((s, i) => <option key={i} value={s}>{s}</option>)}
        </select>

        <select name="city" value={form.city} onChange={handleChange}>
          <option value="">Select City</option>
          {cities.map((c, i) => <option key={i} value={c}>{c}</option>)}
        </select>

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="">Select Type</option>
          {types.map((t, i) => <option key={i} value={t}>{t}</option>)}
        </select>

        <button type="submit">Search</button>
        <button type="button" onClick={resetFilters}>Reset Filters</button>
      </form>

      <div className="recommend-controls">
        <input
          type="text"
          placeholder="Filter results by city/state/type..." // Changed placeholder for clarity
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select onChange={(e) => handleSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="rating">Rating (High to Low)</option>
          <option value="alphabetical">Alphabetical (A–Z)</option>
          <option value="state">State</option>
        </select>

        <button onClick={showRandom} disabled={results.length === 0}>Surprise Me!</button>

        <button onClick={() => setViewMode('grid')}>Grid View</button>
        <button onClick={() => setViewMode('list')}>List View</button>
      </div>

      {message && <p className="recommend-message">{message}</p>}

      {/* --- MODIFIED: Render displayedResults --- */}
      {displayedResults.length === 0 && !message && (
        <p className="no-results-message">No recommendations found. Try different filters or reset them.</p>
      )}

      <div className={`results ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
        {displayedResults.map((place, index) => (
          <div key={place.id || index} className="result-card"> {/* Use place.id for key if available */}
            <img 
                src={place.single_image || place.Image || "https://placehold.co/400x250/cccccc/333333?text=No+Image"} 
                alt={place.Place} 
                className="place-card-image"
                onError={(e) => e.target.src = "https://placehold.co/400x250/cccccc/333333?text=No+Image"} // Fallback
            />
            <h3>{place.Place}</h3>
            <p><strong>State:</strong> {place.State}</p>
            <p><strong>City:</strong> {place.City}</p>
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


            <button onClick={() => {
              console.log('Navigating with place data:', place);
              navigate('/place-details', { state: { place } });
            }}>
              View Details
            </button>

            <button onClick={() => addToFavorites(place.Place, place.State)}>Add to Favorites</button>
          </div>
        ))}
      </div>
      
      {showFavoriteMsg && (
  <div className="popup-message">
    {favoriteStatus === "added"
      ? "✅ Added to favorites!"
      : "⚠️ Already in favorites!"}
  </div>
)}

    </div>
  );
};

export default Recommend;
