import React, { useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReviewCard from './ReviewCard'

const SOURCES = ['All', 'Amazon', 'BestBuy', 'Walmart']
const RATINGS = ['All', '5', '4+', '3+', '2+', '1+']

function SkeletonCard() {
  return (
    <div className="p-4 bg-white rounded shadow animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-40 mb-3" />
      <div className="h-12 bg-gray-200 rounded" />
    </div>
  )
}

export default function ReviewList({ reviews = [], loading = false, onFilterChange = () => {} }) {
  const [sourceFilter, setSourceFilter] = useState('All')
  const [ratingFilter, setRatingFilter] = useState('All')

  useEffect(() => {
    onFilterChange({ source: sourceFilter, rating: ratingFilter })
  }, [sourceFilter, ratingFilter])

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (sourceFilter !== 'All' && r.source !== sourceFilter) return false
      if (ratingFilter !== 'All') {
        if (ratingFilter.endsWith('+')) {
          const min = parseInt(ratingFilter[0], 10)
          if (isNaN(min) || r.rating < min) return false
        } else {
          // exact match like '5'
          const val = parseInt(ratingFilter, 10)
          if (isNaN(val) || r.rating !== val) return false
        }
      }
      return true
    })
  }, [reviews, sourceFilter, ratingFilter])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Source:</label>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            aria-label="Filter reviews by source"
          >
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <label className="text-sm text-gray-600 ml-4">Rating:</label>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            aria-label="Filter reviews by rating"
          >
            {RATINGS.map(r => <option key={r} value={r}>{r === 'All' ? 'All' : (r.endsWith('+') ? `${r} stars` : `${r} stars`)}</option>)}
          </select>
        </div>

        <div className="text-sm text-gray-600">Showing {filtered.length} of {reviews.length} reviews</div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="p-4 bg-white rounded shadow text-sm text-gray-500">No reviews match your filters.</div>
          ) : (
            filtered.map(r => <ReviewCard key={r.id} review={r} />)
          )}
        </div>
      )}
    </div>
  )
}

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    source: PropTypes.oneOf(['Amazon', 'BestBuy', 'Walmart']).isRequired,
    author: PropTypes.string,
    rating: PropTypes.number,
    title: PropTypes.string,
    content: PropTypes.string,
    date: PropTypes.string,
  })),
  loading: PropTypes.bool,
  onFilterChange: PropTypes.func,
}
