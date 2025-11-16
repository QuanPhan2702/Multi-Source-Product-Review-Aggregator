import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import ProductHeader from '../ProductHeader'
import ReviewFetcher from './ReviewFetcher'
import ReviewStats from './ReviewStats'
import ReviewList from './ReviewList'
import { fetchProductReviews, getReviewStats } from '../../services/mockReviewAPI'

export default function ReviewAggregatorPage({ productId = '1' }) {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchingNew, setFetchingNew] = useState(false)
  const [error, setError] = useState(null)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await fetchProductReviews(String(productId))
      const s = await getReviewStats(String(productId))
      setReviews(r)
      setStats({
        overallAverage: +(s.averageRating || 0).toFixed(1),
        totalReviews: s.totalReviews || 0,
        sourceBreakdown: Object.entries(s.sourcesDistribution || {}).map(([source, count]) => ({ source, count, average: 0 })),
        ratingHistogram: s.ratingDistribution || {},
      })
    } catch (err) {
      setError(err?.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => { loadAll() }, [loadAll])

  const handleNewReviews = async (newReviews) => {
    // merge naive: append and dedupe by id
    const map = new Map(reviews.map(r => [r.id, r]))
    newReviews.forEach(nr => map.set(nr.id, nr))
    const merged = Array.from(map.values())
    setReviews(merged)

    // recalc stats
    try {
      const s = await getReviewStats(String(productId))
      setStats({
        overallAverage: +(s.averageRating || 0).toFixed(1),
        totalReviews: s.totalReviews || 0,
        sourceBreakdown: Object.entries(s.sourcesDistribution || {}).map(([source, count]) => ({ source, count, average: 0 })),
        ratingHistogram: s.ratingDistribution || {},
      })
    } catch (err) {
      console.warn('Failed to refresh stats after new reviews', err)
    }
  }

  return (
    <div className="space-y-6">
      <ProductHeader productName="Demo Product" productPrice={199.99} />

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-1/3">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Reviews & Summary</h3>
              <ReviewFetcher productId={String(productId)} onReviewsFetched={handleNewReviews} />
            </div>

            <div>
              <ReviewStats loading={loading} stats={stats || { overallAverage: 0, totalReviews: 0, sourceBreakdown: [], ratingHistogram: {} }} />
            </div>
          </aside>

          <main className="lg:flex-1">
            {error && <div role="alert" className="mb-4 text-sm text-red-600">{error}</div>}
            <ReviewList reviews={reviews} loading={loading} onFilterChange={() => {}} />
          </main>
        </div>
      </div>
    </div>
  )
}

ReviewAggregatorPage.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
