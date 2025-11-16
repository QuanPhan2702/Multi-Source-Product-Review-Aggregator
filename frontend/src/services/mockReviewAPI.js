/**
 * Mock data and API functions for product reviews
 * Simulates backend API calls with realistic delays and error handling
 */

// Mock review data for wireless headphones
const mockReviews = [
  {
    id: "rev_001",
    productId: "1",
    source: "Amazon",
    author: "Michael Chen",
    rating: 5,
    title: "Best noise cancellation I've experienced",
    content: "These headphones are absolutely incredible. The noise cancellation is top-notch and battery life exceeds expectations. Sound quality is crystal clear and the companion app offers great customization options.",
    date: "2025-10-15T08:30:00Z"
  },
  {
    id: "rev_002",
    productId: "1",
    source: "BestBuy",
    author: "Sarah Johnson",
    rating: 4,
    title: "Great sound, slightly uncomfortable after long use",
    content: "The sound quality is amazing and I love the quick pairing feature. Only downside is that they get a bit uncomfortable after wearing them for 3+ hours. Still, definitely worth the investment.",
    date: "2025-10-14T15:45:00Z"
  }
  ,
  {
    id: "rev_003",
    productId: "1",
    source: "Walmart",
    author: "Carlos Rivera",
    rating: 3,
    title: "Decent performance for the price",
    content: "Good overall sound and battery life for the price point. The ANC is okay but not best-in-class. Build quality feels a little plasticky, but they're lightweight and comfortable for short sessions.",
    date: "2025-10-13T10:20:00Z"
  },
  {
    id: "rev_004",
    productId: "1",
    source: "Amazon",
    author: "Priya Kumar",
    rating: 5,
    title: "Exceptional audio and great features",
    content: "Love the soundstage and clarity. Multipoint pairing is flawless and the touch controls are responsive. Battery easily lasts all day with casual listening. Highly recommend.",
    date: "2025-10-16T12:05:00Z"
  },
  {
    id: "rev_005",
    productId: "1",
    source: "BestBuy",
    author: "Oliver Smith",
    rating: 2,
    title: "Not what I expected",
    content: "While the bass is punchy, I experienced intermittent connection drops with my phone. Customer support was helpful but the issue persisted until a firmware update. Returned after two weeks.",
    date: "2025-10-12T09:10:00Z"
  }
];

/**
 * Simulates a network delay between min and max milliseconds
 * @param {number} min - Minimum delay in milliseconds
 * @param {number} max - Maximum delay in milliseconds
 * @returns {Promise<void>}
 */
const simulateDelay = (min = 500, max = 2000) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Simulates a network error with 10% probability
 * @throws {Error} Network error simulation
 */
const simulateError = () => {
  if (Math.random() < 0.1) {
    throw new Error("Network error: Failed to fetch review data");
  }
};

/**
 * Fetches existing reviews for a product
 * @param {string} productId - The ID of the product
 * @returns {Promise<Array>} Array of review objects
 * @throws {Error} If the network request fails
 */
export const fetchProductReviews = async (productId) => {
  await simulateDelay();
  simulateError();
  
  return mockReviews.filter(review => review.productId === productId);
};

/**
 * Simulates fetching new reviews from external sources
 * @param {string} productId - The ID of the product
 * @returns {Promise<Object>} Object containing status and message
 * @throws {Error} If the network request fails
 */
export const triggerReviewFetch = async (productId) => {
  await simulateDelay(1000, 3000);
  simulateError();
  
  return {
    status: "success",
    message: "Review fetch initiated for product " + productId,
    estimatedTime: "5-10 minutes"
  };
};

/**
 * Calculates and returns aggregate statistics for product reviews
 * @param {string} productId - The ID of the product
 * @returns {Promise<Object>} Review statistics object
 * @throws {Error} If the network request fails
 */
export const getReviewStats = async (productId) => {
  await simulateDelay();
  simulateError();
  
  const productReviews = mockReviews.filter(review => review.productId === productId);
  
  if (productReviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
      sourcesDistribution: {}
    };
  }

  const ratingDistribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
  const sourcesDistribution = {};
  let ratingSum = 0;

  productReviews.forEach(review => {
    ratingSum += review.rating;
    ratingDistribution[review.rating]++;
    sourcesDistribution[review.source] = (sourcesDistribution[review.source] || 0) + 1;
  });

  return {
    averageRating: ratingSum / productReviews.length,
    totalReviews: productReviews.length,
    ratingDistribution,
    sourcesDistribution
  };
};
