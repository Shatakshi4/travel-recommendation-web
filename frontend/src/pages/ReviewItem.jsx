import React from 'react';
import StarRatingDisplay from './StarRatingDisplay';
import './ReviewItem.css'; // Create this CSS file

const ReviewItem = ({ review }) => {
    console.log("Review photos received:", review.photos);
  const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="review-item-card">
      <div className="review-header">
        <span className="review-username">{review.username}</span>
        <StarRatingDisplay rating={review.rating} />
        <span className="review-date">{formattedDate}</span>
      </div>
      <p className="review-text">{review.review_text}</p>
      {review.photos && review.photos.length > 0 && (
        <div className="review-photos-grid">
          {review.photos.map((photoUrl, index) => (
            <img
              key={index}
              src={`http://127.0.0.1:5000${photoUrl}`} 
              alt={`Review photo ${index}`}
              className="review-photo-thumbnail"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;