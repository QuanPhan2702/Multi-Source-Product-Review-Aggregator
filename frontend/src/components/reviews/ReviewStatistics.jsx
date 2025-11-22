import PropTypes from "prop-types";

/**
 * ReviewStatistics - Displays aggregate review statistics for a product
 *
 * Shows:
 * - Overall average rating and total reviews
 * - Source breakdown (Amazon, BestBuy, Walmart)
 * - Rating histogram (distribution of 1-5 star ratings)
 */
export default function ReviewStatistics({ statistics }) {
    if (!statistics || !statistics.overall) {
        return (
            <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                No review statistics available
            </div>
        );
    }

    const {
        overall,
        source_breakdown = [],
        rating_histogram = {},
    } = statistics;
    const totalReviews = overall.total_reviews || 0;

    // Calculate percentage for each rating in histogram
    const getPercentage = (count) => {
        if (totalReviews === 0) return 0;
        return Math.round((count / totalReviews) * 100);
    };

    // Source badge colors
    const sourceColors = {
        Amazon: "bg-orange-100 text-orange-800 border-orange-200",
        BestBuy: "bg-blue-100 text-blue-800 border-blue-200",
        Walmart: "bg-green-100 text-green-800 border-green-200",
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Review Statistics
            </h2>

            {/* Overall Statistics */}
            <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-600">
                            {overall.average_rating}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            out of 5.0
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="text-lg font-medium text-gray-900">
                            Overall Average
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            Based on {totalReviews} review
                            {totalReviews !== 1 ? "s" : ""}
                        </div>
                    </div>
                </div>
            </div>

            {/* Source Breakdown */}
            {source_breakdown.length > 0 && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Source Breakdown
                    </h3>
                    <div className="space-y-2">
                        {source_breakdown.map((source) => (
                            <div
                                key={source.source}
                                className={`flex items-center justify-between p-3 rounded-md border ${
                                    sourceColors[source.source] ||
                                    "bg-gray-100 border-gray-200"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                        {source.source}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold">
                                        {source.average_rating}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        ({source.review_count} review
                                        {source.review_count !== 1 ? "s" : ""})
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating Histogram */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Rating Distribution
                </h3>
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = rating_histogram[rating] || 0;
                        const percentage = getPercentage(count);
                        return (
                            <div
                                key={rating}
                                className="flex items-center gap-3"
                            >
                                <div className="w-12 text-sm font-medium text-gray-700">
                                    {rating}★
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                                    <div
                                        className="bg-yellow-400 h-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                        role="progressbar"
                                        aria-valuenow={percentage}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        aria-label={`${rating} star rating: ${count} reviews`}
                                    />
                                </div>
                                <div className="w-12 text-sm text-gray-600 text-right">
                                    {count}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

ReviewStatistics.propTypes = {
    statistics: PropTypes.shape({
        overall: PropTypes.shape({
            average_rating: PropTypes.string,
            total_reviews: PropTypes.number,
        }),
        source_breakdown: PropTypes.arrayOf(
            PropTypes.shape({
                source: PropTypes.string,
                average_rating: PropTypes.string,
                review_count: PropTypes.number,
            })
        ),
        rating_histogram: PropTypes.shape({
            5: PropTypes.number,
            4: PropTypes.number,
            3: PropTypes.number,
            2: PropTypes.number,
            1: PropTypes.number,
        }),
    }),
};
