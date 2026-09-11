import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare, CheckCircle2, AlertCircle, ThumbsUp, Send } from 'lucide-react';
import { FarmerReview } from '../types';
import { fetchReviews, submitReview, getSafeErrorMessage } from '../services/api';

interface FarmerReviewModalProps {
  farmerName: string;
  farmerPhone: string;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: (review: FarmerReview) => void;
}

export const FarmerReviewModal: React.FC<FarmerReviewModalProps> = ({
  farmerName,
  farmerPhone,
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const [reviews, setReviews] = useState<FarmerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState('');
  const [comment, setComment] = useState('');
  const [formErrors, setFormErrors] = useState<{ reviewerName?: string; comment?: string }>({});

  useEffect(() => {
    if (isOpen && farmerPhone) {
      loadReviews();
    }
  }, [isOpen, farmerPhone]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await fetchReviews(farmerPhone);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return 'Excellent — High Quality Produce & Honest Deal';
      case 4:
        return 'Very Good — Fresh Produce & Fair Price';
      case 3:
        return 'Average — Standard Quality';
      case 2:
        return 'Below Average — Minor Issues';
      case 1:
        return 'Poor — Not Recommended';
      default:
        return '';
    }
  };

  const validate = () => {
    const errors: { reviewerName?: string; comment?: string } = {};
    if (!reviewerName.trim()) {
      errors.reviewerName = 'Your name is required';
    }
    if (!comment.trim()) {
      errors.comment = 'Please provide a comment about your experience';
    } else if (comment.trim().length < 5) {
      errors.comment = 'Comment must be at least 5 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await submitReview({
        farmerPhone,
        farmerName,
        rating,
        reviewerName: reviewerName.trim(),
        comment: comment.trim(),
      });

      if (res.success && res.review) {
        setReviews([res.review, ...reviews]);
        setSubmitSuccess(true);
        setComment('');
        setReviewerName('');
        setRating(5);
        if (onReviewSubmitted) onReviewSubmitted(res.review);
        setTimeout(() => setSubmitSuccess(false), 4000);
      } else {
        throw new Error(res.message || 'Failed to submit review');
      }
    } catch (err) {
      const msg = getSafeErrorMessage(err, 'Failed to submit review. Please try again.');
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="farmer-review-modal-backdrop"
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="farmer-review-modal"
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Farmer Reviews & Ratings</h3>
              <p className="text-xs text-emerald-100 truncate max-w-xs">{farmerName} • {farmerPhone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Rating Summary Bar */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-extrabold text-emerald-900">
                {averageRating ? averageRating : '—'}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        averageRating && Number(averageRating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : averageRating && Number(averageRating) >= star - 0.5
                          ? 'fill-amber-300 text-amber-300'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-slate-600 mt-0.5 font-medium">
                  {reviews.length} {reviews.length === 1 ? 'buyer review' : 'buyer reviews'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-200/60 text-emerald-900 border border-emerald-300/60">
                Verified Direct Deals
              </span>
            </div>
          </div>

          {/* Write a Review Section */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              <span>Leave a Review for {farmerName}</span>
            </h4>

            {submitSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your rating and comment have been posted.</span>
              </div>
            )}

            {submitError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Rating <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 rounded hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-medium text-slate-600 ml-2">
                    {getRatingLabel(hoverRating || rating)}
                  </span>
                </div>
              </div>

              {/* Reviewer Name */}
              <div>
                <label htmlFor="reviewerName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reviewerName"
                  type="text"
                  value={reviewerName}
                  onChange={(e) => {
                    setReviewerName(e.target.value);
                    if (formErrors.reviewerName) setFormErrors({ ...formErrors, reviewerName: '' });
                  }}
                  placeholder="e.g. Ramesh Kumar, Retail Buyer"
                  className={`w-full px-3 py-2 rounded-xl border ${
                    formErrors.reviewerName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 bg-white'
                  } text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
                {formErrors.reviewerName && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.reviewerName}</p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="reviewComment" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Review & Comment <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="reviewComment"
                  rows={2}
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    if (formErrors.comment) setFormErrors({ ...formErrors, comment: '' });
                  }}
                  placeholder="Share details about harvest freshness, pricing agreement, promptness on call..."
                  className={`w-full px-3 py-2 rounded-xl border ${
                    formErrors.comment ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 bg-white'
                  } text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed`}
                />
                {formErrors.comment && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.comment}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                {isSubmitting ? (
                  <span>Posting Review...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Farmer Review</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List of Reviews */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recent Comments & Feedback ({reviews.length})
            </h4>

            {isLoading ? (
              <div className="py-6 text-center text-xs text-slate-400">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="py-6 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-slate-600">No reviews yet for this farmer</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Be the first buyer to rate and review their produce quality!</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-2xs font-bold flex items-center justify-center">
                          {rev.reviewerName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{rev.reviewerName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            rev.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="text-[11px] text-slate-500 font-medium ml-1">
                        {rev.rating} / 5
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
