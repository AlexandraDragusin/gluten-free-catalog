const express = require("express");
const pool = require("../db");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

// Get all stores
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM stores");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Eroare la server" });
    }
});

// Add a new store
router.post("/", authenticateToken, async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: "Acces interzis" });
	}

	if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Acces interzis" });
    }

    const { name, type, address, logo_url, arig_partner, discount_percentage, website, description } = req.body;

	const allowedTypes = {
		"Fizic": "physical",
		"Online": "online",
		"Mixt": "mixed",
		"Restaurant": "restaurant"
	};

	const storeType = allowedTypes[type];
	
	if (!storeType) {
		return res.status(400).json({ error: "Tipul magazinului este invalid" });
	}

    try {
        const result = await pool.query(
            `INSERT INTO stores (name, type, address, logo_url, arig_partner, discount_percentage, website, description) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [name, storeType, address, logo_url, arig_partner, discount_percentage, website, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Eroare la server" });
    }
});

module.exports = router;
