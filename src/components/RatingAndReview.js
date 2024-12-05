import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RatingAndReview.css";

const RatingAndReview = ({
  mangaId,
  existingRating,
  existingReview,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(existingRating || 0);
  const [review, setReview] = useState(existingReview || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setRating(existingRating || 0);
    setReview(existingReview || "");
  }, [existingRating, existingReview]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/users/review`,
        { mangaId, rating, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Review submitted successfully!");
      if (onReviewSubmitted) onReviewSubmitted({ rating, review });
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rating-and-review">
      <h3>Rate and Review</h3>
      <div className="rating">
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="0">Select Rating</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </label>
      </div>
      <div className="review">
        <label>
          Review:
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here..."
          ></textarea>
        </label>
      </div>
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
};

export default RatingAndReview;
