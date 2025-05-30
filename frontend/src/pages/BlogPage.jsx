import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const cities = [
  {
    name: 'Delhi',
    knownFor: 'Shopping, Historical and Culture',
    description:
      'Welcome to New Delhi, the vibrant heart of India, where a rich cultural fabric includes markets, spiritual temples and architecture.',
    reasons: ['Gurudwara Bangla Sahib', 'Chandni Chowk', 'Red Fort'],
    images: ['delhi1', 'delhi2', 'delhi3'],
    img: 'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGVsaGl8ZW58MHx8MHx8fDA%3D',
  },
  {
    name: 'Chennai',
    knownFor: 'Shopping, Business and Temples',
    description:
      'Temples and colonial monuments, food and festivals combine to showcase South India’s artistic and religious heritage.',
    reasons: ['Anna Salai', 'Pondy Bazaar', 'Kapaleeswarar Temple'],
    img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlbm5haXxlbnwwfHwwfHx8MA%3D%3Di',
  },
  {
    name: 'Kolkata',
    knownFor: 'Monuments, Culture and Museums',
    description:
      'A friendly city blessed with architectural diversity, festivals and an eclectic cuisine.',
    reasons: ['New Market', 'Nicco Park', 'New Town Eco Park'],
    img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8a29sa2F0YXxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    name: 'Mumbai',
    knownFor: 'Beaches, Bollywood and Nightlife',
    description:
      'The city that never sleeps, known for its iconic Gateway of India, Marine Drive, and fast-paced life.',
    reasons: ['Marine Drive', 'Juhu Beach', 'Film City'],
    img: 'https://media.istockphoto.com/id/1390163309/photo/beautiful-gateway-of-india-near-taj-palace-hotel-on-the-mumbai-harbour-with-many-jetties-on.webp?a=1&b=1&s=612x612&w=0&k=20&c=bEMo0pOTW9Ksg5ybFwQQmL6GhR3CQsBXty_nei4yImY=',
  },
  {
    name: 'Jaipur',
    knownFor: 'Forts, Palaces and Culture',
    description:
      'The Pink City showcases royal heritage through beautiful palaces, forts, and colorful bazaars.',
    reasons: ['Hawa Mahal', 'Amber Fort', 'City Palace'],
    img: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFpcHVyfGVufDB8fDB8fHww',
  },
  {
    name: 'Goa',
    knownFor: 'Beaches and Nightlife',
    description:
      'Popular for its beautiful beaches, party culture and Portuguese heritage.',
    reasons: ['Baga Beach', 'Anjuna Flea Market', 'Fort Aguada'],
    img: 'https://media.istockphoto.com/id/157579910/photo/the-beach.webp?a=1&b=1&s=612x612&w=0&k=20&c=knG0gBV2spG4MOW0I6IY-gRV0aBKKeyyOmVSSeZixGo=',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 350;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="home-main">
      <div className="topbar">
        <div className="topbar-right">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>

      <header className="hero">
        <h1>Welcome to TravelMate 🌍</h1>
        <p>Your Smart Travel Recommendation Companion</p>
      </header>

      <section className="popular-destinations">
        <h2>Popular cities to visit in India</h2>
        <div className="scroll-container">
          <button className="scroll-btn left" onClick={() => scroll('left')}>
            &lt;
          </button>

          <div className="card-row" ref={scrollRef}>
            {cities.map((city, idx) => (
              <div
                className="city-card"
                key={idx}
                onClick={() =>
                  navigate('/place-details', {
                    state: { place: city, fromFavorites: false },
                  })
                }
              >
                <img src={city.img} alt={city.name} />
                <div className="card-info">
                  <h3>{city.name}</h3>
                  <p className="tagline">Known for {city.knownFor}</p>
                  <p className="desc">{city.description}</p>
                  <div className="reasons">
                    <strong>Reasons to visit</strong>
                    <ul>
                      {city.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    className="read-blog-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/blog/${city.name.toLowerCase()}`);
                    }}
                  >
                    Read Blog
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="scroll-btn right" onClick={() => scroll('right')}>
            &gt;
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-links">
          <p onClick={() => navigate('/about')}>About Us</p>
          <p onClick={() => navigate('/contact')}>Contact Us</p>
          <p onClick={() => navigate('/privacy')}>Privacy Policy</p>
          <p onClick={() => navigate('/terms')}>Terms & Conditions</p>
        </div>
        <div className="footer-disclaimer">
          © 2025 TravelMate Technologies Pvt. Ltd., a TravelMate Group company.
          All rights reserved. TravelMate and the TravelMate Logo are
          trademarks or registered trademarks of TravelMate Technologies Pvt.
          Ltd.
        </div>
      </footer>
    </div>
  );
};

export default Home;
