import React from 'react'
import PropTypes from 'prop-types'

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-12 w-40 bg-gray-200 rounded" />
      <div className="h-6 w-24 bg-gray-200 rounded" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full" />
        ))}
      </div>
    </div>
  )
}

export default function ReviewStats({ stats, loading = false }) {
  if (loading) return <LoadingSkeleton />

  const { overallAverage = 0, totalReviews = 0, sourceBreakdown = [], ratingHistogram = {} } = stats || {}

  const maxHistogram = Math.max(...[1, ...(Object.values(ratingHistogram) || [])])

  return (
    <section aria-label="Review statistics" className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-6 md:gap-12">
        <div className="flex flex-col items-start">
          <div className="text-4xl font-extrabold text-gray-900 flex items-baseline gap-2">
            <span>{overallAverage.toFixed(1)}</span>
            <span className="text-yellow-500 text-2xl">★</span>
          </div>
          <div className="text-sm text-gray-500">Overall average</div>
        </div>

        <div className="flex flex-col">
          <div className="text-lg font-medium text-gray-800">{totalReviews}</div>
          <div className="text-sm text-gray-500">Total reviews</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">By source</h4>
          <ul className="space-y-2">
            {sourceBreakdown.map((s) => (
              <li key={s.source} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-800">{s.source}</div>
                  <div className="text-xs text-gray-500">{s.count} reviews • {s.average.toFixed(1)}★</div>
                </div>
                <div className="text-sm text-gray-500">{((s.count / (totalReviews || 1)) * 100).toFixed(0)}%</div>
              </li>
            ))}
            {sourceBreakdown.length === 0 && <li className="text-sm text-gray-500">No source data</li>}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Rating distribution</h4>
          <div className="space-y-2">
            {[5,4,3,2,1].map((n) => {
              const count = ratingHistogram[n] || 0
              const pct = maxHistogram ? (count / maxHistogram) * 100 : 0
              return (
                <div key={n} className="flex items-center gap-3">
                  <div className="w-8 text-sm text-gray-600">{n}★</div>
                  <div className="flex-1 bg-gray-100 rounded overflow-hidden h-4">
                    <div
                      className="h-4 bg-yellow-400"
                      style={{ width: `${pct}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="w-10 text-right text-sm text-gray-600">{count}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

ReviewStats.propTypes = {
  loading: PropTypes.bool,
  stats: PropTypes.shape({
    overallAverage: PropTypes.number,
    totalReviews: PropTypes.number,
    sourceBreakdown: PropTypes.arrayOf(PropTypes.shape({
      source: PropTypes.string.isRequired,
      average: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    })),
    ratingHistogram: PropTypes.objectOf(PropTypes.number),
  }),
}
