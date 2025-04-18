import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Acknowledgement from "./Acknowledgement";
import './Home.css';

const cities = [
  {
    name: 'Delhi',
    knownFor: 'Shopping, Historical and Culture',
    description: 'Welcome to New Delhi, the vibrant heart of India, where a rich cultural fabric includes markets, spiritual temples and architecture.',
    reasons: ['Gurudwara Bangla Sahib', 'Chandni Chowk', 'Red Fort'],
    images: ['delhi1', 'delhi2', 'delhi3'],
    img: 'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Chennai',
    knownFor: 'Shopping, Business and Temples',
    description: 'Temples and colonial monuments, food and festivals combine to showcase South India’s artistic and religious heritage.',
    reasons: ['Anna Salai', 'Pondy Bazaar', 'Kapaleeswarar Temple'],
    img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Kolkata',
    knownFor: 'Monuments, Culture and Museums',
    description: 'A friendly city blessed with architectural diversity, festivals and an eclectic cuisine.',
    reasons: ['New Market', 'Nicco Park', 'New Town Eco Park'],
    img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Mumbai',
    knownFor: 'Beaches, Bollywood and Nightlife',
    description: 'The city that never sleeps, known for its iconic Gateway of India, Marine Drive, and fast-paced life.',
    reasons: ['Marine Drive', 'Juhu Beach', 'Film City'],
    img: 'https://media.istockphoto.com/id/539018660/photo/taj-mahal-hotel-and-gateway-of-india.jpg?s=612x612&w=0&k=20&c=L1LJVrYMS8kj2rJKlQMcUR88vYoAZeWbYIGkcTo6QV0=',
  },
  {
    name: 'Jaipur',
    knownFor: 'Forts, Palaces and Culture',
    description: 'The Pink City showcases royal heritage through beautiful palaces, forts, and colorful bazaars.',
    reasons: ['Hawa Mahal', 'Amber Fort', 'City Palace'],
    img: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Goa',
    knownFor: 'Beaches and Nightlife',
    description: 'Popular for its beautiful beaches, party culture and Portuguese heritage.',
    reasons: ['Baga Beach', 'Anjuna Flea Market', 'Fort Aguada'],
    img: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z29hfGVufDB8fDB8fHww',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 350;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="home-main ${darkMode ? 'dark' : ''}`}">
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-right">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>

      {/* Hero Section */}
      <header className="hero">
        <h1>Welcome to TravelMate 🌍</h1>
        <p>Your Smart Travel Recommendation Companion</p>
      </header>

      {/* Popular Cities Section */}
      <section className="popular-destinations">
        <h2>Popular Cities to Visit in India</h2>

        <div className="scroll-container">
          <button className="scroll-btn left" onClick={() => scroll('left')}>&lt;</button>

          <div className="card-row" ref={scrollRef}>
            {cities.map((city, idx) => (
              <div
                className="city-card"
                key={idx}
                onClick={() => navigate(`/blog/${city.name.toLowerCase()}`)}

              >
                <img src={city.img} alt={city.name} />
                <div className="card-info">
                  <h3>{city.name}</h3>
                  <p className="tagline">Known for {city.knownFor}</p>
                  <p className="desc">{city.description}</p>
                  <div className="reasons">
                    <strong>Reasons to visit:</strong>
                    <ul>
                      {city.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="scroll-btn right" onClick={() => scroll('right')}>&gt;</button>
        </div>
      </section>

      {/* Add acknowledgement just above the footer */}
      <Acknowledgement />

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-links">
          <p onClick={() => navigate('/about')}>About Us</p>
          <p onClick={() => navigate('/contact')}>Contact Us</p>
          <p onClick={() => navigate('/privacy')}>Privacy Policy</p>
          <p onClick={() => navigate('/terms')}>Terms & Conditions</p>
        </div>
        <div className="footer-disclaimer">
          © 2025 TravelMate Technologies Pvt. Ltd., a TravelMate Group company. All rights reserved. TravelMate and the TravelMate Logo are trademarks or registered trademarks of TravelMate Technologies Pvt. Ltd.
        </div>
      </footer>
    </div>
  );
};

export default Home;
