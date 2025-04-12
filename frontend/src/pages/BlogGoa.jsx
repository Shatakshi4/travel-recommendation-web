import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const imageUrls = [
  "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z29hfGVufDB8fDB8fHww",
  "https://plus.unsplash.com/premium_photo-1664304458186-9a67c1330d02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z29hfGVufDB8fDB8fHww",
  "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/5c/e9/c6/goa.jpg?w=1100&h=400&s=1"
];

const BlogGoa = () => {
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
      <h1 style={styles.title}>Drift into Goa – Sun, Sand & Soul</h1>

      <div style={styles.imageContainer}>
        <img src={imageUrls[currentImage]} alt="Goa" style={styles.image} />
        <button onClick={prevSlide} style={{ ...styles.navButton, ...styles.prev }}>⟨</button>
        <button onClick={nextSlide} style={{ ...styles.navButton, ...styles.next }}>⟩</button>
      </div>

      <h2 style={styles.heading}>🌊 Beaches that Breathe Freedom</h2>
      <p style={styles.paragraph}>
        Goa is where time slows, music flows, and the horizon never ends. From the bohemian vibes of Anjuna to the serene shores of Palolem, every beach has its own rhythm. Surfers, sunseekers, and wanderers find their place here — no judgment, just freedom.
      </p>

      <h2 style={styles.heading}>🌴 Nature’s Playground</h2>
      <p style={styles.paragraph}>
        Beyond the coast lies green magic — spice plantations, waterfalls like Dudhsagar, and sleepy villages wrapped in coconut palms. Rent a scooter, get lost on purpose, and you’ll find Goa’s soul in its quiet corners.
      </p>

      <h2 style={styles.heading}>🍹 Sips, Sounds & Sundowners</h2>
      <p style={styles.paragraph}>
        Goa’s nightlife is legendary — beach bars, psychedelic raves, sunset shacks, and hidden jam sessions. But it’s not all parties; it’s about connection, laughter, and dancing barefoot in the sand under a full moon.
      </p>

      <h2 style={styles.heading}>⛪ Colonial Echoes & Portuguese Soul</h2>
      <p style={styles.paragraph}>
        Goa’s heritage whispers through whitewashed churches, Latin quarters in Panjim, and forts like Aguada and Chapora. It’s a place where history wears flip-flops and culture is casually cool.
      </p>

      <h2 style={styles.heading}>🍤 A Taste of the Tropics</h2>
      <p style={styles.paragraph}>
        Fresh seafood, tangy vindaloo, bebinca, and feni — Goan cuisine is a dance of spice and sunshine. Eat with your hands, share with strangers, and chase every meal with a splash of sea breeze.
      </p>

      <p style={styles.paragraph}>
        Goa is not just a destination — it’s a feeling. Once it gets into your heart, it never quite leaves. It’s freedom, joy, and salt in your hair. Come for the sunsets, stay for the soul.
      </p>
    </div>
  );
};

export default BlogGoa;
