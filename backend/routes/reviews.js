const express = require("express");
const pool = require("../db");
const router = express.Router();

// Add a new review
router.post("/", async (req, res) => {
    const { product_id, user_id, rating, comment } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO reviews (product_id, user_id, rating, comment) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [product_id, user_id, rating, comment]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all reviews for a product
router.get("/:product_id", async (req, res) => {
    const { product_id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM reviews WHERE product_id = $1", [product_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
