import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const imageUrls = [
  "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFpcHVyfGVufDB8fDB8fHww",
  "https://plus.unsplash.com/premium_photo-1661962404003-e0ca40da40ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFpcHVyfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1602339752474-f77aa7bcaecd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGphaXB1cnxlbnwwfHwwfHx8MA%3D%3D"
];

const BlogJaipur = () => {
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
      <h1 style={styles.title}>Wander Through Jaipur – The Pink City</h1>

      <div style={styles.imageContainer}>
        <img src={imageUrls[currentImage]} alt="Jaipur" style={styles.image} />
        <button onClick={prevSlide} style={{ ...styles.navButton, ...styles.prev }}>⟨</button>
        <button onClick={nextSlide} style={{ ...styles.navButton, ...styles.next }}>⟩</button>
      </div>

      <h2 style={styles.heading}>🏰 Royal Splendor in Every Corner</h2>
      <p style={styles.paragraph}>
        Jaipur is where grandeur meets grit — a city of majestic forts, opulent palaces, and ancient havelis. Explore the regal Amber Fort, marvel at the Hawa Mahal’s lattice windows, and feel the echoes of history in the City Palace. It’s a living tapestry of Rajasthani pride and Mughal elegance.
      </p>

      <h2 style={styles.heading}>🌸 The City Blushed in Pink</h2>
      <p style={styles.paragraph}>
        Painted pink to welcome the Prince of Wales in 1876, Jaipur’s old city is a visual delight. The rosy hues of its buildings against the desert sky make for stunning views — especially at dawn and dusk. Every street seems dipped in nostalgia, warmth, and tradition.
      </p>

      <h2 style={styles.heading}>🍛 Rajasthani Richness on a Plate</h2>
      <p style={styles.paragraph}>
        Savor dal baati churma, laal maas, kachoris, and ghewar — a feast that’s as colorful as the city itself. From spicy street snacks in Johari Bazaar to traditional thalis at heritage hotels, Jaipur’s culinary culture is both bold and hearty.
      </p>

      <h2 style={styles.heading}>🎨 Art, Craft, and Handwoven Dreams</h2>
      <p style={styles.paragraph}>
        Jaipur is a shopper’s paradise. Handblock-printed fabrics, blue pottery, gemstones, and leather jootis — every bazaar is a celebration of craftsmanship. Don’t miss Bapu Bazaar, Tripolia, and the bustling streets near Hawa Mahal.
      </p>

      <h2 style={styles.heading}>🎭 Festivals & Folk Tales</h2>
      <p style={styles.paragraph}>
        Witness the vibrancy of Jaipur during festivals — the kite-flying frenzy of Makar Sankranti, the twinkling lights of Diwali, and the camels and colors of the Desert Festival. Folk dancers twirl, puppets come alive, and music flows like desert wind.
      </p>

      <h2 style={styles.heading}>🏜️ Romance of the Desert</h2>
      <p style={styles.paragraph}>
        Beyond the pink walls lie the sands of the Thar — calling for camel rides, desert stays, and starry nights. Jaipur bridges the urban and the timeless, offering both royal comforts and rustic adventure.
      </p>

      <p style={styles.paragraph}>
        Jaipur doesn’t just impress — it enchants. It’s a place where the past lives on in every color, every echoing step, every story waiting to be told.
      </p>
    </div>
  );
};

export default BlogJaipur;
