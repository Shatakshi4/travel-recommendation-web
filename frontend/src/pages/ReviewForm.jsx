import React, { useState } from 'react';
import './ReviewForm.css'; // Create this CSS file

const ReviewForm = ({ placeId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    // Generate photo previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // --- IMPORTANT: Get the JWT token from localStorage ---
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to submit a review.');
      setSubmitting(false);
      return;
    }

    if (rating === 0) {
      setError('Please select a star rating.');
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('place_name', placeId); // Add place_name to formData
    formData.append('rating', rating);
    formData.append('review_text', reviewText);
    photos.forEach((file) => {
      formData.append(`photos`, file); // Append each file with the same key 'photos'
    });

    try {
      // --- CORRECTED: The POST URL to match backend's /reviews endpoint ---
      const response = await fetch(`http://127.0.0.1:5000/reviews`, {
        method: 'POST',
        body: formData,
        headers: {
          // --- IMPORTANT: Add the Authorization header for JWT protection ---
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // If the response is not OK (e.g., 400, 401, 500), throw an error
        throw new Error(data.msg || 'Failed to submit review');
      }

      // Reset form
      setRating(0);
      setReviewText('');
      setPhotos([]);
      setPhotoPreviews([]);

      // Notify parent component to refresh reviews with the new average rating
      if (onReviewSubmitted) {
        onReviewSubmitted(data.new_average_rating);
      }
      // Use a custom message box instead of alert() for better UX
      // alert('Review submitted successfully!');
      // You can implement a simple modal or toast notification here.
      console.log('Review submitted successfully!'); // For debugging
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="star-rating-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? 'filled' : ''}`}
              onClick={() => handleStarClick(star)}
            >
              &#9733;
            </span>
          ))}
        </div>
        <textarea
          placeholder="Share your experience..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="5"
        ></textarea>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          id="review-photos-input"
        />
        <label htmlFor="review-photos-input" className="file-upload-button">
          Choose Photos
        </label>
        <div className="photo-previews">
          {photoPreviews.map((src, index) => (
            <img key={index} src={src} alt={`Preview ${index}`} className="photo-preview-thumbnail" />
          ))}
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
