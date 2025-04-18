import React, { useState, useEffect } from 'react';
import './Recommend.css';
import { useNavigate } from 'react-router-dom';


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
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/states')
      .then(res => res.json())
      .then(data => setStates(data));
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
  }, [form.city]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    setResults(data);
    setMessage(data.length === 0 ? 'No results found' : '');
    console.log('API Results:', data); // ✅ Check if place_desc exists
  };

  const addToFavorites = async (placeName, state) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login to add to favorites.');
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
      alert(data.msg || 'Added to favorites');
    } catch (error) {
      console.error(error);
      alert('Error adding to favorites');
    }
  };

    const handleSort = (sortBy) => {
    let sorted = [...results];
    if (sortBy === 'rating') {
      sorted.sort((a, b) => b.Ratings - a.Ratings);
    } else if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.Place.localeCompare(b.Place));
    } else if (sortBy === 'state') {
      sorted.sort((a, b) => a.State.localeCompare(b.State));
    }
    setResults(sorted);
  };

  const showRandom = () => {
    const shuffled = [...results].sort(() => 0.5 - Math.random());
    setResults(shuffled.slice(0, 5));
  };

  const resetFilters = () => {
    setForm({ state: '', city: '', type: '' });
    setResults([]);
    setMessage('');
    setSearchQuery('');
  };

  const filteredResults = results.filter(place =>
    place.Place.toLowerCase().includes(searchQuery.toLowerCase())
  );


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
          placeholder="Search place name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select onChange={(e) => handleSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="rating">Rating (High to Low)</option>
          <option value="alphabetical">Alphabetical (A–Z)</option>
          <option value="state">State</option>
        </select>

        <button onClick={showRandom}>Surprise Me!</button>
        <button onClick={() => setViewMode('grid')}>Grid View</button>
        <button onClick={() => setViewMode('list')}>List View</button>
      </div>

      {message && <p className="recommend-message">{message}</p>}

            <div className={`results ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
        {filteredResults.map((place, index) =>  (
          <div key={index} className="result-card">
            <h3>{place.Place}</h3>
            <p><strong>State:</strong> {place.State}</p>
            <p><strong>City:</strong> {place.City}</p>
            <p><strong>Type:</strong> {place.Type}</p>
            <p><strong>Rating:</strong> {place.Ratings}</p>

            <button onClick={() => {
              console.log('Navigating with place data:', place); // ✅ Debug output
              navigate('/place-details', { state: { place } });
            }}>
              View Details
            </button>

            <button onClick={() => addToFavorites(place.Place, place.State)}>Add to Favorites</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommend;
