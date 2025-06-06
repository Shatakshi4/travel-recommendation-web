// About.jsx
import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
       <section className="about-section">
        <h2 className="about-heading">🌐 Why Choose WanderGo?</h2>
        <p>
          At <strong>WanderGo</strong>, we’re more than just a travel recommendation platform — we’re your companion on every step of the journey.
          Our goal is to empower travelers with <em>smart, data-driven recommendations</em> tailored to your interests, preferences, and travel history.
          With a hybrid recommendation engine combining collaborative filtering, content-based techniques, and user reviews, WanderGo ensures
          <strong> every suggestion feels handpicked just for you</strong>.
        </p>
        <p>
          Whether you're discovering places nearby or planning a cross-country escape, we help you <strong>find, save, and organize</strong>
          your ideal destinations with ease.
        </p>
      </section>

      <section className="about-section alternate">
        <h2 className="about-heading">🤝 Community-Driven Travel</h2>
        <p>
          WanderGo believes in the power of the community. Our platform thrives on traveler reviews, shared experiences, and user-generated favorites.
          You can rate, review, and recommend locations — helping fellow explorers make the most of their adventures.
        </p>
        <p>
          <strong>Join the WanderGo community</strong> and turn your travel stories into inspiration for others!
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-heading">🌱 Responsible Travel</h2>
        <p>
          We promote <em>eco-conscious tourism</em> and encourage travelers to respect local cultures, traditions, and environments.
          Many of our listed destinations include sustainability scores and tips on how to travel responsibly.
        </p>
        <p>
          Because exploring the world should never come at the cost of damaging it.
        </p>
      </section>

      <section className="about-section alternate">
        <h2 className="about-heading">💡 Powered by Innovation</h2>
        <p>
          Our platform uses the latest in <strong>machine learning and cloud technologies</strong> to constantly improve your travel experience.
          From real-time data to smart itinerary planning, WanderGo is built to adapt, learn, and grow with you.
        </p>
        <p>
          Your travel journey is unique — and our tech makes sure your experience is too.
        </p>
      </section>
    </div>
  );
};

export default About;