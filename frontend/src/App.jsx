import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Recommend from './pages/Recommend';
import Favorites from './pages/Favorites';
import Places from './pages/Places';
// import Dashboard from './pages/Dashboard';
import PlaceDetails from './pages/PlaceDetails';
// import Profile from './pages/Profile';
// import EditProfile from './pages/EditProfile';


function App() {
  const [results, setResults] = useState([]);

  const handleSubmit = async (formData) => {
    console.log('Form submitted:', formData);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.recommendations || []);
      } else {
        console.error('Error fetching recommendations');
        setResults([]);
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      setResults([]);
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/edit-profile" component={EditProfile} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/recommend" element={<Recommend onSubmit={handleSubmit} results={results} />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/places" element={<Places />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/place-details" element={<PlaceDetails />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
