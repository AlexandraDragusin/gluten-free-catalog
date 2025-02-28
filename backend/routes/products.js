const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Add a new product
router.post("/", async (req, res) => {
    const { name, brand, made_in_romania, certified_arig, weight, unit, image_url, ean_code, allergen_tags, category } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO products (name, brand, made_in_romania, certified_arig, weight, unit, image_url, ean_code, allergen_tags, category) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [name, brand, made_in_romania, certified_arig, weight, unit, image_url, ean_code, allergen_tags, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
