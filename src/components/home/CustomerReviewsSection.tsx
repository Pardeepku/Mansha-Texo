import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, CheckCircle, MessageSquareQuote } from 'lucide-react';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews } = useStore();
  const featuredReviews = reviews.filter((r) => r.isApproved).slice(0, 6);

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Verified Customer Stories</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Loved By Over 25,000+ Homes
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Read authentic feedback from homeowners, interior designers, and decor enthusiasts across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredReviews.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-3xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Verified tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {review.isVerifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#257335] bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Verified Buyer
                    </span>
                  )}
                </div>

                {/* Review Title */}
                <h4 className="text-sm font-bold text-gray-900 mb-1.5">
                  "{review.title}"
                </h4>

                {/* Comment */}
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-gray-900">{review.userName}</h5>
                  <p className="text-[10px] text-gray-400">{review.userLocation || 'India'}</p>
                </div>
                <span className="text-[10px] font-semibold text-gray-500 max-w-[120px] truncate text-right">
                  {review.productName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
