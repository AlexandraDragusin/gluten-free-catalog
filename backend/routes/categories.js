const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get all categories
router.get("/", async (req, res) => {
    try {
		const result = await pool.query("SELECT name FROM categories ORDER BY name");
        res.json(result.rows.map(row => row.name));

    } catch (err) {
        console.error("Eroare la obținerea categoriilor:", err);
        res.status(500).json({ error: "Eroare de server" });
    }
});

module.exports = router;