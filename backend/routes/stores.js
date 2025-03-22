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

	const { name, type, logo_url, arig_partner, discount_percentage, website, description, addresses = [] } = req.body;

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
		const existingStore = await pool.query(
			"SELECT id FROM stores WHERE LOWER(name) = LOWER($1)",
			[name]
		);

		if (existingStore.rows.length > 0) {
			return res.status(400).json({ error: "Magazinul există deja în baza de date." });
		}

		// Inserarea magazinului in baza de date
		const storeResult = await pool.query(
			`INSERT INTO stores (name, type, logo_url, arig_partner, discount_percentage, website, description) 
			VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
			[name, storeType, logo_url, arig_partner, discount_percentage, website, description]
		);

		const store = storeResult.rows[0];

		// Inserarea adreselor magazinului
		for (const addr of addresses) {
			if (addr.address && addr.address.trim() !== "") {
				await pool.query(
					`INSERT INTO store_addresses (store_id, address, city, county, country) 
					 VALUES ($1, $2, $3, $4, $5)`,
					[store.id, addr.address.trim(), addr.city || null, addr.county || null, addr.country || 'România']
				);
			}
		}

		res.status(201).json(store);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

module.exports = router;
