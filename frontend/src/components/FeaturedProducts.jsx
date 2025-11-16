import PropTypes from "prop-types";

// Simple featured list of 5 products with Add to Cart buttons
export default function FeaturedProducts({ onAddToCart }) {
    const featured = [
        { id: "fp1", name: "Wireless Headphones" },
        { id: "fp2", name: "Smart Watch" },
        { id: "fp3", name: "USB-C Charger" },
        { id: "fp4", name: "Bluetooth Speaker" },
        { id: "fp5", name: "Mechanical Keyboard" },
    ];

    return (
        <section aria-labelledby="featured-title" className="mb-6">
            <h2 id="featured-title" className="text-lg font-semibold mb-3">
                Featured Products
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 list-none">
                {featured.map((p) => (
                    <li
                        key={p.id}
                        className="border rounded p-3 bg-white flex flex-col justify-between"
                    >
                        <div
                            className="font-medium mb-2"
                            aria-label={`Product name: ${p.name}`}
                        >
                            {p.name}
                        </div>
                        <button
                            type="button"
                            className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            onClick={() => onAddToCart?.(p)}
                            aria-label={`Add ${p.name} to cart`}
                        >
                            Add to Cart
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

FeaturedProducts.propTypes = {
    onAddToCart: PropTypes.func,
};
