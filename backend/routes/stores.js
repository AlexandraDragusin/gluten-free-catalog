const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get all stores
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM stores");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Add a new store
router.post("/", async (req, res) => {
    const { name, type, address, logo_url, arig_partner, discount_percentage, website, description } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO stores (name, type, address, logo_url, arig_partner, discount_percentage, website, description) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [name, type, address, logo_url, arig_partner, discount_percentage, website, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
