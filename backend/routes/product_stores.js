const express = require("express");
const pool = require("../db");
const router = express.Router();

// Add a product to a store
router.post("/", async (req, res) => {
    const { product_id, store_id } = req.body;

    try {
        await pool.query(
            "INSERT INTO product_stores (product_id, store_id) VALUES ($1, $2)",
            [product_id, store_id]
        );
        res.status(201).json({ message: "Product linked to store" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all stores for a product
router.get("/:product_id", async (req, res) => {
    const { product_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT s.id, s.name, s.address, s.website 
            FROM stores s
            JOIN product_stores ps ON s.id = ps.store_id
            WHERE ps.product_id = $1`,
            [product_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Remove a product from a store
router.delete("/", async (req, res) => {
    const { product_id, store_id } = req.body;

    try {
        await pool.query(
            "DELETE FROM product_stores WHERE product_id = $1 AND store_id = $2",
            [product_id, store_id]
        );
        res.json({ message: "Product removed from store" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
