const express = require("express");
const pool = require("../db");
const router = express.Router();

// Add a category to a store
router.post("/", async (req, res) => {
    const { store_id, category_id } = req.body;

    try {
        await pool.query(
            "INSERT INTO store_categories (store_id, category_id) VALUES ($1, $2)",
            [store_id, category_id]
        );
        res.status(201).json({ message: "Category added to store" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Eroare la server" });
    }
});

// Get all categories for a store
router.get("/:store_id", async (req, res) => {
    const { store_id } = req.params;

    try {
        const result = await pool.query(
            "SELECT category_id FROM store_categories WHERE store_id = $1",
            [store_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Eroare la server" });
    }
});

// Remove a category from a store
router.delete("/", async (req, res) => {
    const { store_id, category_id } = req.body;

    try {
        await pool.query(
            "DELETE FROM store_categories WHERE store_id = $1 AND category_id = $2",
            [store_id, category_id]
        );
        res.json({ message: "Category removed from store" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Eroare la server" });
    }
});

module.exports = router;
