import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const imageUrls = [
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/4e/55/e6/chhatrapati-shivaji-terminus.jpg?w=2400&h=1000&s=1",
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/b1/89/43/bombay-museum-chhatrapati.jpg?w=2400&h=1000&s=1",
    "https://images.unsplash.com/photo-1660145416818-b9a2b1a1f193?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bXVtYmFpfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1557846920-5efd5c916286?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG11bWJhaXxlbnwwfHwwfHx8MA%3D%3D",
    "https://media.istockphoto.com/id/2181855711/photo/mumbai-gateway-to-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZxrKZBceZOrxphWq_UZfSPPba4Sw09R6qv_MwgqUL14=",
    "https://images.unsplash.com/photo-1563257076-8265731f709d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fG11bWJhaXxlbnwwfHwwfHx8MA%3D%3D"
  ];

const BlogMumbai = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  const nextSlide = () => setCurrentImage((currentImage + 1) % imageUrls.length);
  const prevSlide = () => setCurrentImage((currentImage - 1 + imageUrls.length) % imageUrls.length);

  const styles = {
    container: {
      maxWidth: '900px',
      margin: 'auto',
      padding: '2rem',
      fontFamily: "'Poppins', 'Segoe UI', 'Lato', sans-serif",
      lineHeight: '1.8',
      color: '#2d2d2d',
      fontSize: '18px',
    },
    backButton: {
      background: '#f0f0f0',
      border: '1px solid #ccc',
      padding: '0.6rem 1.2rem',
      cursor: 'pointer',
      borderRadius: '8px',
      marginBottom: '2rem',
      fontSize: '18px',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
    },
    imageContainer: {
      position: 'relative',
      textAlign: 'center',
      marginBottom: '1.5rem',
    },
    image: {
      width: '100%',
      borderRadius: '16px',
      objectFit: 'cover',
      maxHeight: '500px',
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(0, 0, 0, 0.6)',
      color: '#fff',
      border: 'none',
      padding: '0.6rem 1.2rem',
      cursor: 'pointer',
      fontSize: '1.5rem',
      borderRadius: '50%',
    },
    prev: { left: '15px' },
    next: { right: '15px' },
    heading: {
      fontSize: '1.7rem',
      fontWeight: '600',
      marginTop: '2rem',
      marginBottom: '0.6rem',
      color: '#1a1a1a',
    },
    paragraph: {
      marginBottom: '1.2rem',
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>← Back</button>
      <h1 style={styles.title}>Experience the City of Dreams - Mumbai</h1>

      <div style={styles.imageContainer}>
        <img src={imageUrls[currentImage]} alt="Mumbai" style={styles.image} />
        <button onClick={prevSlide} style={{ ...styles.navButton, ...styles.prev }}>⟨</button>
        <button onClick={nextSlide} style={{ ...styles.navButton, ...styles.next }}>⟩</button>
      </div>

      <h2 style={styles.heading}>🌆 A Metropolis Like No Other</h2>
      <p style={styles.paragraph}>
        Mumbai, India's bustling western coastal city, is more than just a metropolis — it’s a living, breathing ecosystem where tradition meets technology, where dreams are born and built. Known as the "City of Dreams," Mumbai is the financial heart of India and home to over 20 million people. Its skyline is dotted with skyscrapers and colonial-era architecture alike, reflecting its deep historical roots and relentless forward momentum. From glamorous film sets to humble fishing villages, Mumbai offers a vivid snapshot of modern India.
      </p>

      <h2 style={styles.heading}>🏛️ Historical Highlights</h2>
      <p style={styles.paragraph}>
        Explore centuries of history at the Gateway of India, a grand arch that once welcomed British royalty. Take a boat ride to Elephanta Caves to discover intricate sculptures and cave temples dating back over a thousand years. Marvel at the gothic architecture of Chhatrapati Shivaji Maharaj Terminus, a train station so ornate it feels like a palace. Mumbai’s history is interwoven with colonial legacies, ancient dynasties, and freedom fighters who shaped India’s identity.
      </p>

      <h2 style={styles.heading}>🍲 Flavors of the City</h2>
      <p style={styles.paragraph}>
        Mumbai’s food is a celebration of its diversity. On one street, you’ll find spicy street-side vada pav being served with fiery chutneys; on another, five-star restaurants offering global cuisines with panoramic sea views. Dive into dishes like misal pav, Bombay sandwich, keema pav, and seafood thalis rich with Konkani flavors. Don’t miss the bustling Irani cafés like Kyani & Co. or Leopold, which are not just eateries but living legacies of Parsi culture.
      </p>

      <h2 style={styles.heading}>🎬 Bollywood & Beyond</h2>
      <p style={styles.paragraph}>
        The beating heart of the Indian film industry, Bollywood, resides here. Studios like Mehboob and Film City are where movie magic happens daily. Join a Bollywood tour or even witness a film shoot on the streets. But art in Mumbai goes beyond cinema — from the National Centre for Performing Arts (NCPA) to the bustling Kala Ghoda art district, the city pulses with creativity through festivals, galleries, theatres, and live music.
      </p>

      <h2 style={styles.heading}>🌊 Coastal Charms</h2>
      <p style={styles.paragraph}>
        Mumbai's long coastline provides both a refreshing escape and a romantic backdrop. Walk the 3.6-kilometer arc of Marine Drive at sunset, often called the “Queen’s Necklace” when city lights reflect off the curve of the bay. Relax at Juhu Beach with street food and laughter in the air, or watch waves crash dramatically at Worli Sea Face during monsoon. For tranquility, visit lesser-known gems like Aksa Beach or Madh Island.
      </p>

      <h2 style={styles.heading}>🛍️ Shopping, Culture & Nightlife</h2>
      <p style={styles.paragraph}>
        Colaba Causeway is a treasure trove for shoppers — from boho jewelry to vintage Bollywood posters. Hill Road and Linking Road in Bandra are hubs for bargain hunting. For luxury, visit Phoenix Palladium or High Street Phoenix. When the sun sets, Mumbai transforms into a city of lights and laughter: rooftop lounges, sea-facing cafés, craft breweries, and iconic nightclubs await. Whether you're dancing at Soho or sipping cocktails in Lower Parel, the city's nightlife is as diverse as its people.
      </p>

      <p style={styles.paragraph}>
        Mumbai is a city that embraces contradictions — lavish and modest, chaotic and calm, traditional and futuristic — all at once. To truly experience Mumbai is to embrace its unpredictability, its resilience, and its soul. Come for the sights, stay for the stories.
      </p>
    </div>
  );
};

export default BlogMumbai;

