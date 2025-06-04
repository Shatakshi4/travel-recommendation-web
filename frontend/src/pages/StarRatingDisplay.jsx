import React from 'react';
import './StarRatingDisplay.css'; // Create this CSS file

const StarRatingDisplay = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating-display">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star filled">&#9733;</span>
      ))}
      {hasHalfStar && <span className="star half-filled">&#9733;</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star empty">&#9733;</span>
      ))}
      {rating > 0 && <span className="rating-value">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRatingDisplay;