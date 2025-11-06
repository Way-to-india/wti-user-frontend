'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Star,
  User,
  ThumbsUp,
  Calendar,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  Upload,
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/api/axios';

// ============================================
// Types
// ============================================
interface ReviewImage {
  key: string;
  url: string;
  thumbnail?: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  images?: ReviewImage[];
}

interface TourReviewsProps {
  tourId: string;
}

interface ModalState {
  isOpen: boolean;
  type: 'success' | 'error' | 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
}

// ============================================
// Modal Component - Optimized with Portal
// ============================================
const Modal: React.FC<ModalState & { onClose: () => void }> = React.memo(({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className="w-12 h-12 text-green-500" aria-hidden="true" />,
    error: <AlertCircle className="w-12 h-12 text-red-500" aria-hidden="true" />,
    confirm: <AlertCircle className="w-12 h-12 text-orange-500" aria-hidden="true" />,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full p-1"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center -mt-2">
            <div className="mb-4">{icons[type]}</div>
            <h3 id="modal-title" className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="flex gap-3 w-full">
              {type === 'confirm' ? (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onConfirm?.();
                      onClose();
                    }}
                    className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

// ============================================
// Star Rating Component - Memoized
// ============================================
const StarRating: React.FC<{
  rating: number;
  size?: string;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}> = React.memo(({ rating, size = 'w-5 h-5', interactive = false, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`${size} ${star <= (interactive ? hover || rating : rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
            } ${interactive ? 'cursor-pointer transition-all duration-200 hover:scale-110' : ''}`}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          aria-hidden="true"
        />
      ))}
    </div>
  );
});

StarRating.displayName = 'StarRating';

// ============================================
// Image Preview Component - Optimized
// ============================================
const ImagePreview: React.FC<{
  file: File;
  onRemove: () => void;
}> = React.memo(({ file, onRemove }) => {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!preview) return null;

  return (
    <div className="relative group">
      <Image
        src={preview}
        alt={`Preview of ${file.name}`}
        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
        width={96}
        height={96}
      />
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400"
        type="button"
        aria-label={`Remove ${file.name}`}
      >
        <X className="w-4 h-4" />
      </button>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
    </div>
  );
});

ImagePreview.displayName = 'ImagePreview';

// ============================================
// Image Gallery Component - Optimized
// ============================================
const ImageGallery: React.FC<{ images: ReviewImage[] }> = React.memo(({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Handle escape key for closing
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedImage]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="flex gap-2 mt-3 flex-wrap" role="list" aria-label="Review images">
        {images.map((img, idx) => (
          <button
            key={idx}
            className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onClick={() => setSelectedImage(img.url)}
            aria-label={`View review image ${idx + 1}`}
            type="button"
          >
            <Image
              src={img.thumbnail || img.url}
              alt={`Review image ${idx + 1}`}
              fill
              className="object-cover"
              sizes="80px"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Full size image viewer"
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image viewer"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Full size review image"
              className="max-w-full max-h-full object-contain"
              width={1200}
              height={800}
              quality={90}
            />
          </div>
        </div>
      )}
    </>
  );
});

ImageGallery.displayName = 'ImageGallery';

// ============================================
// Review Card Component - Memoized
// ============================================
const ReviewCard: React.FC<{
  review: Review;
  onHelpful: (id: string) => void;
  canDelete: boolean;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}> = React.memo(({ review, onHelpful, canDelete, onDelete, isDeleting }) => {
  return (
    <article
      className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-200"
      aria-label={`Review by ${review.userName}`}
    >
      <div className="flex items-start gap-4">
        {review.userAvatar ? (
          <Image
            width={48}
            height={48}
            src={review.userAvatar}
            alt={`${review.userName}'s avatar`}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
          />
        ) : (
          <div
            className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center"
            aria-hidden="true"
          >
            <User className="w-6 h-6 text-orange-600" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-lg">{review.userName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={review.rating} size="w-4 h-4" />
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" aria-hidden="true" />
                  <time dateTime={review.date}>{review.date}</time>
                </span>
              </div>
            </div>
          </div>

          <h5 className="font-semibold text-gray-900 mb-2 text-base">{review.title}</h5>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment}</p>

          <ImageGallery images={review.images || []} />

          <button
            onClick={() => onHelpful(review.id)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-all duration-200 mt-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label={`Mark this review as helpful (currently ${review.helpful} helpful votes)`}
          >
            <ThumbsUp className="w-4 h-4" aria-hidden="true" />
            <span>Helpful ({review.helpful})</span>
          </button>
        </div>
      </div>
    </article>
  );
});

ReviewCard.displayName = 'ReviewCard';

// ============================================
// Main TourReviews Component
// ============================================
const TourReviews: React.FC<TourReviewsProps> = ({ tourId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [form, setForm] = useState({ title: '', comment: '' });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const { user } = useAuth();
  const router = useRouter();

  // Fetch reviews with error handling
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axiosInstance.get(`/api/user/review/tours/${tourId}/reviews`);

      if (data.status) {
        setReviews(data.payload || []);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load reviews';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [tourId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Modal handlers
  const showModal = useCallback(
    (
      type: 'success' | 'error' | 'confirm',
      title: string,
      message: string,
      onConfirm?: () => void
    ) => {
      setModal({ isOpen: true, type, title, message, onConfirm });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  // File handling with validation
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (selectedFiles.length + files.length > 5) {
      setError('Maximum 5 images allowed per review');
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(
        file.type
      );
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValidType) {
        setError(`${file.name} is not a valid image type`);
        return false;
      }
      if (!isValidSize) {
        setError(`${file.name} exceeds 10MB size limit`);
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
    e.target.value = '';
  }, [selectedFiles.length]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    const trimmedTitle = form.title.trim();
    const trimmedComment = form.comment.trim();

    if (trimmedTitle.length < 5) {
      setError('Title must be at least 5 characters long');
      return;
    }

    if (trimmedComment.length < 20) {
      setError('Comment must be at least 20 characters long');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('rating', rating.toString());
      formData.append('title', trimmedTitle);
      formData.append('comment', trimmedComment);

      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      await axiosInstance.post(`/api/user/review/tours/${tourId}/reviews`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset form
      setForm({ title: '', comment: '' });
      setRating(0);
      setSelectedFiles([]);

      await fetchReviews();
      showModal('success', 'Review Submitted!', 'Thank you for sharing your experience with us.');
      setShowForm(false);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to submit review. Please try again.';
      showModal('error', 'Submission Failed', errorMsg);
    } finally {
      setSubmitting(false);
    }
  }, [user, router, rating, form, selectedFiles, tourId, fetchReviews, showModal]);

  // Mark review as helpful
  const handleHelpful = useCallback(async (id: string) => {
    try {
      const { data } = await axiosInstance.post(`/api/user/review/reviews/${id}/helpful`);
      if (data.success) {
        setReviews(prev => prev.map(r => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r)));
      }
    } catch (err) {
      // Silently fail for better UX
      console.error('Error marking review helpful:', err);
    }
  }, []);

  // Calculate review statistics - Memoized
  const statistics = useMemo(() => {
    const average =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0';

    const distribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length,
      percentage:
        reviews.length > 0
          ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100
          : 0,
    }));

    return { average, distribution };
  }, [reviews]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12" role="status" aria-live="polite">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" aria-hidden="true" />
        <span className="sr-only">Loading reviews...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Modal {...modal} onClose={closeModal} />

      {/* Error Alert */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top duration-300"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 rounded p-1"
            aria-label="Dismiss error message"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Review Statistics */}
      <section
        className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 shadow-sm"
        aria-labelledby="review-statistics"
      >
        <h2 id="review-statistics" className="sr-only">Review Statistics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-6xl font-bold text-orange-600 mb-2" aria-label={`Average rating: ${statistics.average} out of 5`}>
              {statistics.average}
            </div>
            <StarRating rating={Math.round(Number(statistics.average))} size="w-6 h-6" />
            <p className="text-gray-600 mt-2 text-sm">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          <div className="space-y-2" aria-label="Rating distribution">
            {statistics.distribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-12">{star} Star</span>
                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${star} star: ${count} reviews`}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            if (!user) {
              router.push('/auth');
              return;
            }
            setShowForm(!showForm);
            setError(null);
          }}
          className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </section>

      {/* Review Form */}
      {showForm && (
        <section
          className="bg-white rounded-2xl p-6 border shadow-lg animate-in slide-in-from-top duration-300"
          aria-labelledby="review-form-title"
        >
          <h3 id="review-form-title" className="text-2xl font-bold text-gray-800 mb-6">
            Share Your Experience
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Rating <span className="text-red-500" aria-label="required">*</span>
              </label>
              <StarRating rating={rating} size="w-9 h-9" interactive onChange={setRating} />
            </div>

            <div>
              <label htmlFor="review-title" className="block text-sm font-semibold text-gray-700 mb-2">
                Review Title <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="review-title"
                type="text"
                required
                minLength={5}
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                placeholder="Summarize your experience"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="review-comment" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Review <span className="text-red-500" aria-label="required">*</span>
              </label>
              <textarea
                id="review-comment"
                required
                minLength={20}
                value={form.comment}
                onChange={e => setForm({ ...form, comment: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none resize-none"
                placeholder="Tell us about your experience..."
                aria-required="true"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Add Photos{' '}
                <span className="text-gray-500 text-xs font-normal">(Optional, max 5)</span>
              </label>

              <div className="space-y-3">
                <label
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer focus-within:ring-2 focus-within:ring-orange-500"
                  aria-label="Upload review images"
                >
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" aria-hidden="true" />
                    <span className="text-sm text-gray-600 font-medium">
                      Click to upload images
                    </span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 10MB</span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={selectedFiles.length >= 5}
                    aria-label="Select image files"
                  />
                </label>

                {selectedFiles.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {selectedFiles.map((file, idx) => (
                      <ImagePreview key={idx} file={file} onRemove={() => removeFile(idx)} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={rating === 0 || submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              aria-busy={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Submitting...</span>
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </form>
        </section>
      )}

      {/* Reviews List */}
      <section aria-labelledby="customer-reviews-title">
        <h3 id="customer-reviews-title" className="text-2xl font-bold text-gray-800 mb-4">
          Customer Reviews
        </h3>

        {reviews.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" aria-hidden="true" />
            </div>
            <p className="text-gray-600 font-medium text-lg">No reviews yet</p>
            <p className="text-gray-500 text-sm mt-1">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpful={handleHelpful}
                canDelete={false}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TourReviews;