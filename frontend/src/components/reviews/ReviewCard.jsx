import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { formatDistanceToNow, parseISO, isValid } from 'date-fns'

const SOURCE_STYLES = {
  Amazon: 'bg-orange-100 text-orange-800',
  BestBuy: 'bg-blue-100 text-blue-800',
  Walmart: 'bg-green-100 text-green-800',
}

function Stars({ rating }) {
  const full = useMemo(() => Math.max(0, Math.min(5, Math.round(rating))), [rating])

  return (
    <span className="inline-flex items-center" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < full ? 'text-yellow-400' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.372 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.387 2.678c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.626 9.384c-.784-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </span>
  )
}

Stars.propTypes = {
  rating: PropTypes.number.isRequired,
}

export default function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false)

  const {
    id,
    source = 'Amazon',
    author = 'Anonymous',
    rating = 0,
    title = '',
    content = '',
    date,
  } = review || {}

  const relativeDate = useMemo(() => {
    try {
      const parsed = parseISO(date)
      if (!isValid(parsed)) return date || ''
      return formatDistanceToNow(parsed, { addSuffix: true })
    } catch (e) {
      return date || ''
    }
  }, [date])

  const badgeClass = SOURCE_STYLES[source] || 'bg-gray-100 text-gray-800'

  const shouldTruncate = content && content.length > 250
  const preview = shouldTruncate && !expanded ? `${content.slice(0, 250).trim()}…` : content

  return (
    <article
      key={id}
      className="p-4 md:p-6 bg-white rounded-lg shadow-sm border border-gray-100 max-w-3xl w-full mx-auto"
      aria-labelledby={`review-title-${id}`}
      aria-describedby={`review-content-${id}`}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Stars rating={rating} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 truncate">{author}</span>
              <span className="text-sm text-gray-400">•</span>
              <time dateTime={date} className="text-sm text-gray-500">{relativeDate}</time>
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

      <h3 id={`review-title-${id}`} className="mt-4 text-sm md:text-base font-semibold text-gray-900">
        {title}
      </h3>

      <div id={`review-content-${id}`} className="mt-2 text-sm text-gray-700">
        <p className="whitespace-pre-wrap">{preview}</p>

        {shouldTruncate && (
          <button
            type="button"
            onClick={() => setExpanded((s) => !s)}
            className="mt-2 text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
            aria-expanded={expanded}
            aria-controls={`review-content-${id}`}
          >
            {expanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>
    </article>
  )
}

ReviewCard.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    source: PropTypes.oneOf(['Amazon', 'BestBuy', 'Walmart']).isRequired,
    author: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
}
