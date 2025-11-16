import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    triggerReviewFetch,
    fetchProductReviews,
} from "../../services/mockReviewAPI";

export default function ReviewFetcher({ productId, onReviewsFetched }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let id;
        if (message || error) {
            id = setTimeout(() => {
                setMessage(null);
                setError(null);
            }, 3000);
        }
        return () => {
            if (id) clearTimeout(id);
        };
    }, [message, error]);

    const handleFetch = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            // trigger external fetch (simulated)
            await triggerReviewFetch(String(productId));
            // then get the (mock) latest reviews and notify parent
            const reviews = await fetchProductReviews(String(productId));
            setMessage(`Fetched ${reviews.length} reviews!`);
            if (typeof onReviewsFetched === "function")
                onReviewsFetched(reviews);
        } catch (err) {
            setError(err?.message || "Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={handleFetch}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                aria-live="polite"
            >
                {loading ? (
                    <svg
                        className="w-4 h-4 animate-spin text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                    </svg>
                ) : (
                    <svg
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden
                    >
                        <path d="M2 10a8 8 0 1016 0 8 8 0 10-16 0zm8-3v6l4-3-4-3z" />
                    </svg>
                )}
                <span>{loading ? "Fetching…" : "Fetch Reviews"}</span>
            </button>

            <div className="min-w-0">
                {message && (
                    <div className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-red-700 bg-red-50 px-3 py-1 rounded">
                            {error}
                        </div>
                        <button
                            type="button"
                            onClick={handleFetch}
                            disabled={loading}
                            className="text-sm text-indigo-600 hover:underline focus:outline-none"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

ReviewFetcher.propTypes = {
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    onReviewsFetched: PropTypes.func,
};
