import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const imageUrls = [
  "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  "https://th.bing.com/th/id/OIP.7ErgBvHdeWk8kOuPZ3cvjAHaEH?w=273&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" ,
  "data:image/jpeg;base64,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",
  "https://images.unsplash.com/photo-1561784493-88b0a3ce0c76?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNoZW5uYWl8ZW58MHx8MHx8fDA%3D"
];

const BlogChennai = () => {
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
      <h1 style={styles.title}>Discover Chennai – Soul of the South</h1>

      <div style={styles.imageContainer}>
        <img src={imageUrls[currentImage]} alt="Chennai" style={styles.image} />
        <button onClick={prevSlide} style={{ ...styles.navButton, ...styles.prev }}>⟨</button>
        <button onClick={nextSlide} style={{ ...styles.navButton, ...styles.next }}>⟩</button>
      </div>

      <h2 style={styles.heading}>🏖️ Coastal Heritage Meets Cultural Pride</h2>
      <p style={styles.paragraph}>
        Chennai, formerly Madras, is a city where centuries of Tamil culture embrace the rhythms of modern life. Located on the southeastern coast of India, it’s a metropolis known for its sandy beaches, classical music, temple architecture, and spicy Chettinad cuisine. It's not just a city — it's a storyteller of Dravidian heritage and resilience.
      </p>

      <h2 style={styles.heading}>🛕 Timeless Temples & Colonial Echoes</h2>
      <p style={styles.paragraph}>
        Chennai’s iconic Kapaleeshwarar Temple in Mylapore is a vibrant mosaic of ancient traditions, sculptures, and festivals. Just a few kilometers away, Fort St. George — built in 1644 — narrates the city’s colonial past. The juxtaposition of temple gopurams and British-era churches makes Chennai a unique timeline of India's layered history.
      </p>

      <h2 style={styles.heading}>🍛 A Culinary Journey Through Tamil Nadu</h2>
      <p style={styles.paragraph}>
        Chennai’s food is as passionate as its people. From crispy dosas and idlis with a rainbow of chutneys to spicy biryanis and filter coffee served in metal tumblers, every bite is steeped in tradition. Don’t miss Murugan Idli Shop or Ratna Café for a true taste of Chennai's love for its native flavors.
      </p>

      <h2 style={styles.heading}>🎭 A Cultural Powerhouse</h2>
      <p style={styles.paragraph}>
        Every December, Chennai comes alive with the Margazhi Music and Dance Festival — the world’s largest celebration of Carnatic music and Bharatanatyam. Institutions like Kalakshetra keep classical traditions alive, while venues like Music Academy host maestros across generations. It’s not just art here — it’s spiritual expression.
      </p>

      <h2 style={styles.heading}>🌅 Beaches, Breezes & Bay Views</h2>
      <p style={styles.paragraph}>
        Marina Beach, one of the world’s longest urban beaches, is Chennai’s beating heart at dawn and dusk. Walk barefoot on soft sands, savor sundal (spiced chickpeas), or fly a kite under the golden horizon. Elliot’s Beach in Besant Nagar offers a quieter charm with chic cafés and peaceful promenades.
      </p>

      <h2 style={styles.heading}>🛍️ Sarees, Silver, and Street Vibes</h2>
      <p style={styles.paragraph}>
        T. Nagar is a shopper’s paradise — especially for silk sarees at Nalli or Kumaran Silks. From Kanchipuram weaves to temple jewelry, the craftsmanship here is exquisite. Head to Pondy Bazaar for bargains or Besant Nagar for artsy boutiques and beachside shopping.
      </p>

      <p style={styles.paragraph}>
        Chennai isn't just a destination; it’s a deeply rooted experience. It celebrates identity without apology — a warm embrace of heritage, hospitality, and harmony. Whether you come for the temples, the thalis, or the sea breeze, Chennai leaves you with more than just memories — it leaves you transformed.
      </p>
    </div>
  );
};

export default BlogChennai;
