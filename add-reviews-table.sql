-- Run this SQL script to add the reviews table to your existing database
-- This preserves your existing data

-- Create reviews table for product reviews from multiple sources
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  source ENUM('Amazon', 'BestBuy', 'Walmart') NOT NULL,
  reviewer_name VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  review_date DATE,
  helpful_votes INT DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_reviews_product (product_id),
  INDEX idx_reviews_source (source),
  INDEX idx_reviews_rating (rating),
  INDEX idx_reviews_date (review_date DESC)
);

-- Insert sample reviews for product 1 (USB-C Charger)
INSERT INTO reviews (product_id, source, reviewer_name, rating, title, content, review_date, helpful_votes, verified_purchase) VALUES
(1, 'Amazon', 'Sarah Johnson', 5, 'Excellent quality!', 'This USB-C charger works perfectly with my laptop. Fast charging and solid build quality. Highly recommended for MacBook users.', '2025-09-15', 12, TRUE),
(1, 'Amazon', 'Michael Chen', 4, 'Good value for money', 'Charges quickly and the cable is durable. Only complaint is it gets a bit warm during use, but that''s normal.', '2025-09-10', 8, TRUE),
(1, 'Amazon', 'Emily Rodriguez', 5, 'Perfect for travel', 'Compact design makes it easy to carry. Charges my phone and laptop without issues. Great purchase!', '2025-09-05', 15, TRUE),
(1, 'BestBuy', 'David Kim', 4, 'Reliable charger', 'Works well with multiple devices. The build quality is solid and it charges at the advertised speed.', '2025-08-28', 6, TRUE),
(1, 'BestBuy', 'Jessica Martinez', 3, 'Decent but not perfect', 'It works, but I expected faster charging. The cable is a bit short for my setup. Overall okay for the price.', '2025-08-20', 3, FALSE),
(1, 'Walmart', 'Robert Taylor', 5, 'Great product!', 'Fast shipping and the charger works exactly as described. No complaints at all. Would buy again.', '2025-09-12', 9, TRUE),
(1, 'Walmart', 'Amanda White', 4, 'Solid purchase', 'Good quality charger that handles multiple devices well. The price is reasonable for what you get.', '2025-09-01', 5, TRUE);


