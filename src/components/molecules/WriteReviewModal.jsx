import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";

const WriteReviewModal = ({ isOpen, onClose, onSubmit, productTitle }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState([]);
  const [reviewerName, setReviewerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setPhotos(prev => [...prev, ...newPhotos].slice(0, 5)); // Max 5 photos
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        rating,
        title: title.trim() || `${rating} star review`,
        text: text.trim(),
        photos,
        reviewerName: reviewerName.trim() || "Anonymous Customer",
        verifiedPurchase: true
      });

      // Reset form
      setRating(0);
      setTitle("");
      setText("");
      setPhotos([]);
      setReviewerName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarButton = (starValue) => {
    const filled = starValue <= (hoverRating || rating);
    return (
      <button
        key={starValue}
        type="button"
        onMouseEnter={() => setHoverRating(starValue)}
        onMouseLeave={() => setHoverRating(0)}
        onClick={() => setRating(starValue)}
        className="focus:outline-none transition-all duration-200 hover:scale-110"
      >
        <ApperIcon
          name="Star"
          size={48}
          className={filled ? "star-filled fill-current" : "star-empty"}
        />
      </button>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 modal-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">{productTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Overall Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(renderStarButton)}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Reviewer Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Anonymous Customer"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
              maxLength={50}
            />
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
              maxLength={100}
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your Review (Optional)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent resize-none"
              maxLength={5000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {text.length}/5000 characters
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Add Photos (Optional)
            </label>
            
            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Preview ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ApperIcon name="X" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < 5 && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ApperIcon name="Upload" size={32} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 10MB (max {5 - photos.length} more)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="flex-1 bg-amazon-orange hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner border-white w-5 h-5"></div>
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewModal;