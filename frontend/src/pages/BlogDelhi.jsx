import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const imageUrls = [
    "https://plus.unsplash.com/premium_photo-1661919589683-f11880119fb7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVsaGl8ZW58MHx8MHx8fDA%3D",

"https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVsaGl8ZW58MHx8MHx8fDA%3D",
"https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGVsaGl8ZW58MHx8MHx8fDA%3D",
"https://plus.unsplash.com/premium_photo-1661938135446-9aae7262fed5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRlbGhpfGVufDB8fDB8fHww"

];

const BlogDelhi = () => {
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
      <h1 style={styles.title}>Explore Delhi – The Timeless Capital</h1>

      <div style={styles.imageContainer}>
        <img src={imageUrls[currentImage]} alt="Delhi" style={styles.image} />
        <button onClick={prevSlide} style={{ ...styles.navButton, ...styles.prev }}>⟨</button>
        <button onClick={nextSlide} style={{ ...styles.navButton, ...styles.next }}>⟩</button>
      </div>

      <h2 style={styles.heading}>🏛️ The City of Empires</h2>
      <p style={styles.paragraph}>
        Delhi is where dynasties rose and fell, where emperors built legends in stone, and where modern India now thrives. As the capital of India, Delhi is a historic giant — home to the Mughal marvels of Old Delhi and the colonial charm of Lutyens' Delhi. The city stands as a mosaic of heritage, resilience, and contemporary culture.
      </p>

      <h2 style={styles.heading}>🕌 Monuments That Tell Tales</h2>
      <p style={styles.paragraph}>
        Walk through the regal Red Fort, lose yourself in the alleys of Jama Masjid, and climb the Qutub Minar to touch centuries of history. Visit the awe-inspiring Humayun’s Tomb — the precursor to the Taj Mahal — and end at India Gate, the national memorial. Each site is a chapter in Delhi’s vast historic novel.
      </p>

      <h2 style={styles.heading}>🍢 Streets Overflowing with Flavor</h2>
      <p style={styles.paragraph}>
        Delhi is a foodie's heaven. From piping hot chole bhature in Chandni Chowk to kebabs at Karim’s and parathas at Moolchand, the city feeds your soul with spice and tradition. Try golgappas at Bengali Market or sip buttery masala chai by the roadside. Every street corner holds a delicious surprise.
      </p>

      <h2 style={styles.heading}>🎨 A Modern Heart with a Cultural Soul</h2>
      <p style={styles.paragraph}>
        While history thrives in its monuments, Delhi’s present beats in its art spaces and intellectual hubs. Catch performances at Kamani Auditorium, explore galleries in Hauz Khas and Lodhi Art District, or dive into contemporary vibes at India Habitat Centre. The city is always humming with theatre, music, dance, and discussion.
      </p>

      <h2 style={styles.heading}>🌳 Parks, Palaces & Peace</h2>
      <p style={styles.paragraph}>
        Amid the hustle, Delhi offers serene escapes. Lodhi Gardens is perfect for morning walks among ancient tombs. Stroll through Sunder Nursery with its Mughal landscapes, or find stillness at the Lotus Temple, a Bahá’í House of Worship known for its striking architecture and meditative calm.
      </p>

      <h2 style={styles.heading}>🛍️ Bazaars to Boutiques</h2>
      <p style={styles.paragraph}>
        Delhi shopping is an experience of contrasts. Explore Dilli Haat for handicrafts from every Indian state, wander through Sarojini Nagar for bargains, or find chic labels in Khan Market and Select CITYWALK. From silver jewelry in Janpath to designer couture in Mehrauli, Delhi is a shopper’s dream.
      </p>

      <p style={styles.paragraph}>
        Delhi is not just a capital — it's an emotion. With layers of civilizations coexisting in every corner, the city never stops surprising you. It demands your attention, rewards your curiosity, and stays with you long after you leave.
      </p>
    </div>
  );
};

export default BlogDelhi;
