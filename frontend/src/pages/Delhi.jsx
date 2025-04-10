import React from 'react';
import './CityBlog.css';

const Delhi = () => {
  return (
    <div className="city-blog">
      <h1>Delhi 🕌</h1>
      <img
        src="https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=800"
        alt="Delhi"
        className="city-img"
      />
      <p>
        Welcome to Delhi, the vibrant heart of India. A place where history blends with the modern, and every corner tells a story.
      </p>
      <h2>Top Places to Visit</h2>
      <ul>
        <li>Gurudwara Bangla Sahib</li>
        <li>Chandni Chowk</li>
        <li>Red Fort</li>
      </ul>
    </div>
  );
};

export default Delhi;
