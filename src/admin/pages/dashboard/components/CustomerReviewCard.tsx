import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaUserCircle } from 'react-icons/fa';
import { DashboardStats } from '../../../types/dashboard';

interface CustomerReviewCardProps {
  stats: DashboardStats | null;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  timeAgo: string;
}

// Generate sample reviews from recent order data
const generateReviews = (stats: DashboardStats | null): Review[] => {
  const recentOrders = stats?.recentOrders || [];
  
  if (recentOrders.length === 0) {
    return [
      {
        id: 1,
        name: 'Customer',
        rating: 5,
        text: 'Great coffee and fast service! Will definitely come back.',
        timeAgo: 'Recently',
      },
    ];
  }

  return recentOrders.slice(0, 3).map((order, idx) => ({
    id: order.id,
    name: order.user?.name || 'Customer',
    rating: 4 + (idx === 0 ? 1 : 0), // First one gets 5 stars
    text: idx === 0
      ? 'Super fast service and the coffee was perfect. Love it!'
      : idx === 1
      ? 'Great taste, will order again soon. Packaging was excellent.'
      : 'Good quality coffee at reasonable prices. Recommended!',
    timeAgo: idx === 0 ? '3 minutes ago' : idx === 1 ? '15 minutes ago' : '1 hour ago',
  }));
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} className="w-3 h-3 text-amber-400" />);
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(<FaStarHalfAlt key={i} className="w-3 h-3 text-amber-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="w-3 h-3 text-amber-400" />);
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const CustomerReviewCard: React.FC<CustomerReviewCardProps> = ({ stats }) => {
  const reviews = generateReviews(stats);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-900">Customer Review</h3>
        <select className="text-xs text-gray-400 bg-transparent border-none focus:outline-none cursor-pointer">
          <option>Latest</option>
          <option>Highest</option>
          <option>Lowest</option>
        </select>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaUserCircle className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900">{review.name}</span>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-1">
                "{review.text}"
              </p>
              <p className="text-[10px] text-gray-300">{review.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviewCard;
