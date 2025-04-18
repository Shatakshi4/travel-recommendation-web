import React from "react";
import "./Acknowledgement.css";

const Acknowledgement = () => {
  return (
    <section className="acknowledgement-container">
      <div className="ack-icon">🪔</div>
      <div className="ack-text">
        <h3>Respect for Cultural Heritage</h3>
        <p>
          We honour the diverse cultures, traditions, and spiritual heritage of India. From the sacred peaks of the Himalayas to the coastal temples of the South, we recognize the guardianship of our rich history, nature, and communities across every region of this vibrant land.
        </p>
        <a href="#" className="read-more">Explore more →</a>
      </div>
    </section>
  );
};

export default Acknowledgement;
