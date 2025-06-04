import React, { useState, useEffect, useCallback } from 'react';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import StarRatingDisplay from './StarRatingDisplay'; // To display overall average
import './ReviewsSection.css'; // Create this CSS file

const ReviewsSection = ({ placeId, initialAverageRating }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(initialAverageRating || 0);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:5000/reviews?place_name=${encodeURIComponent(placeId)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    if (placeId) {
      fetchReviews();
    }
  }, [placeId, fetchReviews]);

  const handleReviewSubmitted = (newAvgRating) => {
    fetchReviews(); // Refresh the list of reviews
    setAverageRating(newAvgRating); // Update the average rating display
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="reviews-section-container">
      <h2>Reviews</h2>

      <div className="overall-rating-summary">
        {averageRating > 0 ? (
          <>
            <StarRatingDisplay rating={averageRating} />
            <span className="overall-rating-text">{averageRating.toFixed(1)} out of 5 stars</span>
          </>
        ) : (
          <p>No ratings yet.</p>
        )}
      </div>

      <ReviewForm placeId={placeId} onReviewSubmitted={handleReviewSubmitted} />

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>Be the first to review this place!</p>
        ) : (
          reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;