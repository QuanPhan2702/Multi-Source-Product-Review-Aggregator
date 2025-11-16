import express from "express";
import db from "../db.js";

const router = express.Router();

// ---------------------------------------------------------------------------
// Reviews API Routes
// ---------------------------------------------------------------------------
// This file handles review-related endpoints for the product review aggregator.
// It provides CRUD operations for reviews and review aggregation functionality.

// GET /api/reviews - Get all reviews with optional filtering
router.get("/", async (req, res) => {
  try {
    const { product_id, source, min_rating, max_rating, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT r.*, p.name as product_name 
      FROM reviews r 
      LEFT JOIN products p ON r.product_id = p.id 
      WHERE 1=1
    `;
    const params = [];
    
    if (product_id) {
      query += " AND r.product_id = ?";
      params.push(product_id);
    }
    
    if (source) {
      query += " AND r.source = ?";
      params.push(source);
    }
    
    if (min_rating) {
      query += " AND r.rating >= ?";
      params.push(min_rating);
    }
    
    if (max_rating) {
      query += " AND r.rating <= ?";
      params.push(max_rating);
    }
    
    query += " ORDER BY r.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));
    
    const [reviews] = await db.query(query, params);
    
    res.json({
      success: true,
      data: reviews,
      meta: {
        count: reviews.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message
    });
  }
});

// GET /api/reviews/:id - Get a specific review
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const [reviews] = await db.query(
      `SELECT r.*, p.name as product_name 
       FROM reviews r 
       LEFT JOIN products p ON r.product_id = p.id 
       WHERE r.id = ?`,
      [id]
    );
    
    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }
    
    res.json({
      success: true,
      data: reviews[0]
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch review",
      error: error.message
    });
  }
});

// POST /api/reviews - Create a new review
router.post("/", async (req, res) => {
  try {
    const {
      product_id,
      source,
      external_id,
      reviewer_name,
      rating,
      title,
      content,
      review_date,
      verified_purchase = false,
      helpful_votes = 0
    } = req.body;
    
    // Validate required fields
    if (!product_id || !source || !reviewer_name || !rating || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: product_id, source, reviewer_name, rating, title, content"
      });
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }
    
    const [result] = await db.query(
      `INSERT INTO reviews 
       (product_id, source, external_id, reviewer_name, rating, title, content, review_date, verified_purchase, helpful_votes, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [product_id, source, external_id, reviewer_name, rating, title, content, review_date, verified_purchase, helpful_votes]
    );
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        product_id,
        source,
        external_id,
        reviewer_name,
        rating,
        title,
        content,
        review_date,
        verified_purchase,
        helpful_votes
      }
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message
    });
  }
});

// DELETE /api/reviews/:id - Delete a review
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query("DELETE FROM reviews WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message
    });
  }
});

export default router;

