import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";

const SOURCE_STYLES = {
    Amazon: "bg-orange-100 text-orange-800",
    BestBuy: "bg-blue-100 text-blue-800",
    Walmart: "bg-green-100 text-green-800",
};

function Stars({ rating }) {
    const full = useMemo(
        () => Math.max(0, Math.min(5, Math.round(rating))),
        [rating]
    );

    return (
        <span className="inline-flex items-center" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
                <svg
                    key={i}
                    className={`w-4 h-4 ${
                        i < full ? "text-yellow-400" : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.372 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.387 2.678c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.626 9.384c-.784-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
            ))}
        </span>
    );
}

Stars.propTypes = {
    rating: PropTypes.number.isRequired,
};

/**
 * Avatar component - generates initials-based profile picture
 */
function Avatar({ name }) {
    // Generate initials from name
    const getInitials = (fullName) => {
        if (!fullName || fullName === "Anonymous") return "?";
        const parts = fullName.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return fullName.substring(0, 2).toUpperCase();
    };

    // Generate consistent color based on name
    const getColor = (name) => {
        if (!name || name === "Anonymous") return "bg-gray-400";

        // Simple hash function to get consistent color
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Color palette - warm, friendly colors
        const colors = [
            "bg-blue-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-teal-500",
            "bg-emerald-500",
            "bg-amber-500",
            "bg-orange-500",
            "bg-red-500",
            "bg-cyan-500",
        ];

        return colors[Math.abs(hash) % colors.length];
    };

    const initials = getInitials(name);
    const bgColor = getColor(name);

    return (
        <div
            className={`${bgColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
            aria-hidden="true"
            role="img"
            aria-label={`${name}'s profile picture`}
        >
            {initials}
        </div>
    );
}

Avatar.propTypes = {
    name: PropTypes.string.isRequired,
};

export default function ReviewCard({ review }) {
    const [expanded, setExpanded] = useState(false);

    const {
        id,
        source = "Amazon",
        author,
        reviewer_name,
        rating = 0,
        title = "",
        content,
        body,
        date,
        review_date,
        helpful_votes = 0,
    } = review || {};

    // Handle different field name variations
    const displayAuthor = author || reviewer_name || "Anonymous";
    const displayContent = content || body || "";
    const displayDate = date || review_date || "";

    const relativeDate = useMemo(() => {
        try {
            const dateToParse = displayDate;
            if (!dateToParse) return "";
            const parsed = parseISO(dateToParse);
            if (!isValid(parsed)) {
                // Try parsing as date string if ISO fails
                const dateObj = new Date(dateToParse);
                if (isValid(dateObj)) {
                    return formatDistanceToNow(dateObj, { addSuffix: true });
                }
                return dateToParse;
            }
            return formatDistanceToNow(parsed, { addSuffix: true });
        } catch (e) {
            return displayDate || "";
        }
    }, [displayDate]);

    const badgeClass = SOURCE_STYLES[source] || "bg-gray-100 text-gray-800";

    const shouldTruncate = displayContent && displayContent.length > 250;
    const preview =
        shouldTruncate && !expanded
            ? `${displayContent.slice(0, 250).trim()}…`
            : displayContent;

    return (
        <article
            key={id}
            className="p-4 md:p-6 bg-white rounded-lg shadow-sm border border-gray-100 max-w-3xl w-full mx-auto"
            aria-labelledby={`review-title-${id}`}
            aria-describedby={`review-content-${id}`}
        >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="flex items-start gap-3">
                    {/* Profile Picture Avatar */}
                    <Avatar name={displayAuthor} />

                    <div className="min-w-0 flex-1">
                        {/* Reviewer name and date */}
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900 truncate">
                                {displayAuthor}
                            </span>
                            {displayDate && (
                                <>
                                    <span className="text-sm text-gray-400">
                                        •
                                    </span>
                                    <time
                                        dateTime={displayDate}
                                        className="text-sm text-gray-500"
                                    >
                                        {relativeDate}
                                    </time>
                                </>
                            )}
                        </div>
                        {/* Star rating */}
                        <div className="flex items-center">
                            <Stars rating={rating} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center md:ml-4 md:self-start">
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${badgeClass}`}
                        aria-label={`${source} review source`}
                    >
                        {source}
                    </span>
                </div>
            </div>

            <h3
                id={`review-title-${id}`}
                className="mt-4 text-sm md:text-base font-semibold text-gray-900"
            >
                {title}
            </h3>

            <div
                id={`review-content-${id}`}
                className="mt-2 text-sm text-gray-700"
            >
                <p className="whitespace-pre-wrap">{preview}</p>

                {shouldTruncate && (
                    <button
                        type="button"
                        onClick={() => setExpanded((s) => !s)}
                        className="mt-2 text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                        aria-expanded={expanded}
                        aria-controls={`review-content-${id}`}
                    >
                        {expanded ? "Read less" : "Read more"}
                    </button>
                )}
            </div>

            {/* Helpful votes section */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">
                        Was this review helpful?
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            aria-label="Mark review as helpful"
                        >
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                />
                            </svg>
                            Yes
                            {helpful_votes > 0 && (
                                <span className="ml-1">({helpful_votes})</span>
                            )}
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            aria-label="Mark review as not helpful"
                        >
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                                />
                            </svg>
                            No
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}

ReviewCard.propTypes = {
    review: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        source: PropTypes.oneOf(["Amazon", "BestBuy", "Walmart"]).isRequired,
        author: PropTypes.string,
        reviewer_name: PropTypes.string,
        rating: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string,
        body: PropTypes.string,
        date: PropTypes.string,
        review_date: PropTypes.string,
        helpful_votes: PropTypes.number,
    }).isRequired,
};
