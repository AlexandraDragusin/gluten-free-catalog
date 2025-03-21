const express = require("express");
const pool = require("../db");
const router = express.Router();

// Add a product to favorites
router.post("/", async (req, res) => {
    const { user_id, product_id } = req.body;

    try {
        await pool.query(
            "INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [user_id, product_id]
        );
        res.status(201).json({ message: "Product added to favorites" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Eroare la server" });
    }
});

// Get all favorite products for a user
router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT p.id, p.name, p.brand, p.price 
            FROM products p
            JOIN favorites f ON p.id = f.product_id
            WHERE f.user_id = $1`,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Eroare la server" });
    }
});

// Remove a product from favorites
router.delete("/", async (req, res) => {
    const { user_id, product_id } = req.body;

    try {
        await pool.query(
            "DELETE FROM favorites WHERE user_id = $1 AND product_id = $2",
            [user_id, product_id]
        );
        res.json({ message: "Product removed from favorites" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Eroare la server" });
    }
});

module.exports = router;
