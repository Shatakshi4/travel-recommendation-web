import React, { useRef, useState} from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');

  
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 350;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

   const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.knownFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.reasons.some(reason => reason.toLowerCase().includes(searchTerm.toLowerCase()))
  );

   return (
    <div className="home-main">
      {/* Topbar */}
      <div className="topbar">
          <div className="topbar-left" />
        
        <div className="topbar-center">
        <input
          type="text"
          placeholder="Search places or cities..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
        <div className="topbar-right">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>

      {/* Hero Section */}
      <header className="hero">
        <h1>WanderGo✈️  </h1>
        <p>Go where your heart wanders.</p>
      </header>

      {/* Popular Cities Section */}
      <section className="popular-destinations">
        <h2>Popular Cities to Visit in India</h2>

        <div className="scroll-container">
          <button className="scroll-btn left" onClick={() => scroll('left')}>&lt;</button>

          <div className="card-row" ref={scrollRef}>
            {filteredCities.length === 0 ? (
              <p style={{ padding: '1rem', color: 'gray' }}>No matching cities or places found.</p>
            ) : (
              filteredCities.map((city, idx) => (
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
              ))
            )}
          </div>

          <button className="scroll-btn right" onClick={() => scroll('right')}>&gt;</button>
        </div>
      </section>
      
      
       {/* About WanderGo */}
      <section className="about-section">
        <h2>What is WanderGo?</h2>
        <p>WanderGo is your personalized travel companion designed to help you discover the best destinations across India. Whether you're planning a weekend getaway or a cultural expedition, we provide AI-powered recommendations tailored to your preferences.</p>
      </section>
      
      {/* How it works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Sign Up or Log In</h3>
            <p>Create an account to access personalized features.</p>
          </div>
          <div className="step">
            <h3>2. Get Recommendations</h3>
            <p>Receive suggestions based on your interests, budget, and travel style.</p>
          </div>
          <div className="step">
            <h3>3. Explore & Favorite</h3>
            <p>Save your favorite places, plan trips, and discover hidden gems.</p>
          </div>
        </div>
      </section>

       {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Wander?</h2>
        <p>Sign up today to get curated recommendations and start your next adventure!</p>
        <button className="get-started-btn" onClick={() => navigate('/register')}>Get Started</button>
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
