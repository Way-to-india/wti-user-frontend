import React, { useState } from 'react';
import { Star, User, ThumbsUp, Calendar } from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
}

interface TourReviewsProps {
  tourId: string;
  reviews?: Review[];
}

const TourReviews: React.FC<TourReviewsProps> = ({ tourId, reviews = [] }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    comment: '',
  });

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0;

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100
        : 0,
  }));

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Review submitted:', { ...formData, rating, tourId });

    setFormData({ title: '', comment: '' });
    setRating(0);
    setShowReviewForm(false);
  };

  // Star rating component
  const StarRating = ({
    rating: r,
    size = 'w-5 h-5',
    interactive = false,
    onRatingChange,
  }: any) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`${size} ${
            star <= (interactive ? hoverRating || r : r)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-bold text-orange-600 mb-2">{averageRating}</div>
            <StarRating rating={Math.round(Number(averageRating))} size="w-6 h-6" />
            <p className="text-gray-600 mt-2 text-sm">Based on {reviews.length} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-12">{star} Star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {showReviewForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Share Your Experience</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <StarRating
                rating={rating}
                size="w-8 h-8"
                interactive={true}
                onRatingChange={setRating}
              />
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Summarize your experience"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.comment}
                onChange={e => setFormData({ ...formData, comment: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                placeholder="Share your experience with this tour..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={rating === 0}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Customer Reviews</h3>

        {reviews.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No reviews yet</p>
            <p className="text-gray-500 text-sm mt-2">Be the first to share your experience!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {review.userAvatar ? (
                    <Image
                      width={48}
                      height={48}
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} size="w-4 h-4" />
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Title */}
                  <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>

                  {/* Review Comment */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{review.comment}</p>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {review.images.map((img, idx) => (
                        <Image
                          key={idx}
                          src={img}
                          alt={`Review ${idx + 1}`}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </div>
                  )}

                  {/* Helpful Button */}
                  <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TourReviews;
