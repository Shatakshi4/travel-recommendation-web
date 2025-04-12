import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const imageUrls = [
    "https://plus.unsplash.com/premium_photo-1697730414399-3d4d9ada98bd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a29sa2F0YXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1603813507806-0d311a6eecd1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGtvbGthdGF8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1606821306227-9b7c2ff7743f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGtvbGthdGF8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1630494378404-097499a0fea1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGtvbGthdGF8ZW58MHx8MHx8fDA%3D"
];

const BlogKolkata = () => {
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
      <h1 style={styles.title}>Explore Kolkata – The Cultural Capital</h1>

      <div style={styles.imageContainer}>
        <img src={imageUrls[currentImage]} alt="Kolkata" style={styles.image} />
        <button onClick={prevSlide} style={{ ...styles.navButton, ...styles.prev }}>⟨</button>
        <button onClick={nextSlide} style={{ ...styles.navButton, ...styles.next }}>⟩</button>
      </div>

      <h2 style={styles.heading}>🏛️ Where History Meets the Howrah</h2>
      <p style={styles.paragraph}>
        Kolkata, once the capital of British India, is a city steeped in history and grandeur. From the architectural marvels of the Victoria Memorial to the bustling banks of the Hooghly River, every corner echoes stories of colonial charm and cultural richness. It’s a city where trams still run, and old-world charisma thrives.
      </p>

      <h2 style={styles.heading}>📚 The Intellectual Heart of India</h2>
      <p style={styles.paragraph}>
        Known as the cradle of modern Indian thought, Kolkata has given rise to legends like Rabindranath Tagore, Satyajit Ray, and Swami Vivekananda. The coffee houses of College Street and the halls of Presidency University pulse with debate, literature, and revolutionary ideas — a haven for the thoughtful and the curious.
      </p>

      <h2 style={styles.heading}>🍛 Feast of Flavors</h2>
      <p style={styles.paragraph}>
        Bengali cuisine is both comforting and bold. Relish the creamy shorshe ilish (hilsa in mustard), dig into kosha mangsho with luchi, or indulge in street-side rolls and phuchkas. And no visit is complete without rosogolla, sandesh, or a warm mishti doi straight from a clay pot.
      </p>

      <h2 style={styles.heading}>🎭 Festivals, Art, and Drama</h2>
      <p style={styles.paragraph}>
        Kolkata lives and breathes culture. Experience the grandeur of Durga Puja — an explosion of color, creativity, and celebration. Visit Nandan for indie films, explore art at Academy of Fine Arts, or catch a play at Rabindra Sadan. The city is an open stage, where every season brings its own rhythm.
      </p>

      <h2 style={styles.heading}>🛍️ Streets with Soul</h2>
      <p style={styles.paragraph}>
        Browse books at College Street, haggle at New Market, or pick up handcrafted curios in Kumartuli. Kolkata's markets are a delightful maze of discovery — from fabrics and antiques to fresh flowers and secondhand treasures.
      </p>

      <h2 style={styles.heading}>🚉 A City of Layers</h2>
      <p style={styles.paragraph}>
        Walk the chaotic alleys of North Kolkata, admire the Art Deco homes of South, cross the iconic Howrah Bridge, and drift down the Hooghly on a ferry. Kolkata is poetic, gritty, nostalgic, and alive — all at once.
      </p>

      <p style={styles.paragraph}>
        Kolkata doesn’t dazzle — it lingers. In its slow trams, in the songs of the street, in the warmth of its people. It welcomes you with open arms and invites you to pause, reflect, and fall in love.
      </p>
    </div>
  );
};

export default BlogKolkata;
