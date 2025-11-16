/* product-reviews-interface.js
   Minimal frontend prototype for the Multi-Source Product Review Aggregator
   - static products array
   - renderProducts(productsArray)
   - init() wiring
   - simulated fetchFreshReviews(productId)
*/

// products will be loaded at runtime from the backend (or local JSON during prototyping)
let products = [];

function renderStars(avg) {
  const filled = Math.round(avg);
  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}

function renderProducts(productsArray) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = productsArray
    .map((p) => {
      const imgSrc = `https://placehold.co/300x200?text=${encodeURIComponent(p.name)}`;

      const sourcesRows = Object.entries(p.reviewBreakdown)
        .map(([src, b]) => {
          return `
            <div class="flex items-center justify-between text-sm text-gray-700 py-1">
              <div class="flex items-center gap-2">
                <span class="font-medium">${src}</span>
                <span class="text-xs text-gray-500">(${b.count})</span>
              </div>
              <div class="text-sm font-semibold text-indigo-600">${b.avgRating.toFixed(1)}</div>
            </div>
          `;
        })
        .join('');

      return `
        <article class="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
          <img src="${imgSrc}" alt="${p.name}" class="w-full h-40 object-cover rounded-md"/>
          <div class="mt-3 flex-1">
            <h2 class="text-lg font-semibold text-gray-800">${p.name}</h2>
            <p class="text-sm text-gray-500">${p.category}</p>

            <div class="mt-3 flex items-center justify-between">
              <div>
                <div class="flex items-baseline gap-3">
                  <span class="text-2xl font-bold text-indigo-600">${p.avgRating.toFixed(1)}</span>
                  <span class="text-sm text-gray-600">/ 5</span>
                </div>
                <div class="text-sm text-yellow-500 mt-1">${renderStars(p.avgRating)}</div>
                <div class="text-sm text-gray-600 mt-1">${p.totalReviews} reviews from ${p.sources.length} sources</div>
              </div>
            </div>

            <div class="mt-4 border-t pt-3 text-sm text-gray-700">
              ${sourcesRows}
            </div>
          </div>

          <div class="mt-4 flex gap-2">
            <button data-id="${p.id}" class="btn-view px-3 py-2 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200">View All Reviews</button>
            <button data-id="${p.id}" class="btn-refresh ml-auto px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">Fetch Fresh Reviews</button>
          </div>
        </article>
      `;
    })
    .join('');

  // Attach handlers
  grid.querySelectorAll('.btn-view').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      // placeholder behaviour
      alert(`View all reviews for ${id} (placeholder)`);
    });
  });

  grid.querySelectorAll('.btn-refresh').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      fetchFreshReviews(id);
    });
  });
  // update results counter (shown, total)
  updateResultsCount(productsArray.length, products.length);
}

function updateResultsCount(shown, total) {
  const el = document.getElementById('results-count');
  if (!el) return;
  el.textContent = `Showing ${shown} of ${total} products`;
}

async function fetchProducts() {
  try {
    const resp = await fetch('./products-with-reviews.json');
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    const data = await resp.json();
    // expecting { products: [...] }
    return data.products || [];
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return [];
  }
}

function fetchFreshReviews(productId) {
  const p = products.find((x) => x.id === productId);
  if (!p) return;

  // mutate reviewBreakdown with small random changes
  Object.keys(p.reviewBreakdown).forEach((src) => {
    const entry = p.reviewBreakdown[src];
    const delta = (Math.random() - 0.5) * 0.4;
    entry.avgRating = Math.max(1, Math.min(5, +(entry.avgRating + delta).toFixed(2)));
    entry.count = entry.count + Math.floor(Math.random() * 6);
  });

  // recompute totals and weighted average
  const totals = Object.values(p.reviewBreakdown).reduce(
    (acc, b) => {
      acc.count += b.count;
      acc.weighted += b.avgRating * b.count;
      return acc;
    },
    { count: 0, weighted: 0 }
  );

  p.totalReviews = totals.count;
  p.avgRating = totals.count ? +(totals.weighted / totals.count).toFixed(2) : p.avgRating;

  renderProducts(products);
}

function filterProductsBySource(productsArray, source) {
  if (!source || source === 'all') return productsArray;
  return productsArray.filter((p) => p.sources && p.sources.includes(source));
}

function init() {
  document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('product-grid');
    if (grid) grid.innerHTML = '<div class="p-6 text-center text-gray-600">Loading product reviews...</div>';

    // load products from local JSON (simulating backend API)
    products = await fetchProducts();

    const filterEl = document.getElementById('source-filter');

    if (filterEl) {
      filterEl.addEventListener('change', (e) => {
        const val = filterEl.value;
        const filtered = filterProductsBySource(products, val);
        console.log('[filter] selected=', val, 'results=', filtered.map(p => p.id));
        renderProducts(filtered);
      });
    }

    renderProducts(products);
  });
}

// If script is loaded after DOM, initialize immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  renderProducts(products);
} else {
  init();
}

init();
