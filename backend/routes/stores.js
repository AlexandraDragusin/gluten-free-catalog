const express = require("express");
const pool = require("../db");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

// Get all stores
router.get("/", async (req, res) => {
    try {
        const storesResult = await pool.query("SELECT * FROM stores");
		const stores = storesResult.rows;

		// Get addresses for all stores
		const addressesResult = await pool.query("SELECT * FROM store_addresses");
		const addressesByStore = {};
		for (const addr of addressesResult.rows) {
			if (!addressesByStore[addr.store_id]) {
				addressesByStore[addr.store_id] = [];
			}
			addressesByStore[addr.store_id].push(addr);
		}

		// Get categories for all stores
		const categoriesResult = await pool.query("SELECT store_id, category FROM store_categories");
		const categoriesByStore = {};
		for (const row of categoriesResult.rows) {
			if (!categoriesByStore[row.store_id]) {
				categoriesByStore[row.store_id] = [];
			}
			categoriesByStore[row.store_id].push(row.category);
		}

		// Attach addresses and categories to each store
		const enrichedStores = stores.map(store => ({
			...store,
			addresses: addressesByStore[store.id] || [],
			categories: categoriesByStore[store.id] || []
		}));

		res.json(enrichedStores);
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

// Update a store
router.put("/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;
	const { name, type, website, logo_url, arig_partner, discount_percentage, description } = req.body;

	if (discount_percentage < 0 || discount_percentage > 100) {
		return res.status(400).json({ error: "Discountul trebuie să fie între 0 și 100." });
	}

	try {
		await pool.query(`
		UPDATE stores SET
			name = $1, type = $2, website = $3,
			logo_url = $4, arig_partner = $5,
			discount_percentage = $6, description = $7
		WHERE id = $8
		`, [name, type, website, logo_url, arig_partner, discount_percentage, description, id]);

		res.json({ message: "Magazin actualizat." });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Eroare la actualizare." });
	}
});

// Delete a store
router.delete("/:id", authenticateToken, async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: "Acces interzis" });
	}

	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	const { id } = req.params;

	try {
		await pool.query("DELETE FROM stores WHERE id = $1", [id]);
		res.json({ message: "Magazin șters." });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

module.exports = router;
