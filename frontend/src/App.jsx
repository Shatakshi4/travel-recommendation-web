import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Recommend from './pages/Recommend';
import Favorites from './pages/Favorites';
import Places from './pages/Places';
import About from './pages/About'; 
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import BlogDelhi from './pages/BlogDelhi';
import BlogChennai from './pages/BlogChennai';
import BlogKolkata from './pages/BlogKolkata';
import BlogMumbai from './pages/BlogMumbai';
import BlogJaipur from './pages/BlogJaipur';
import BlogGoa from './pages/BlogGoa';
import Dashboard from './pages/Dashboard';
import PlaceDetails from './pages/PlaceDetails';
import PrivateRoute from './components/PrivateRoute';

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
        <Route
  path="/recommend"
  element={
    <PrivateRoute>
      <Recommend onSubmit={handleSubmit} results={results} />
    </PrivateRoute>
  }
/>

        <Route path="/favorites" element={<Favorites />} />
        <Route path="/places" element={<Places />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/place-details" element={<PlaceDetails />} />

<Route path="/blog/delhi" element={<BlogDelhi />} />
<Route path="/blog/chennai" element={<BlogChennai />} />
<Route path="/blog/kolkata" element={<BlogKolkata />} />
<Route path="/blog/mumbai" element={<BlogMumbai />} />
<Route path="/blog/jaipur" element={<BlogJaipur />} />
<Route path="/blog/goa" element={<BlogGoa />} />

        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
<Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
