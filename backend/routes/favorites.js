const express = require("express");
const pool = require("../db");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

// Add a product to favorites
router.post("/", authenticateToken, async (req, res) => {
	const { product_id } = req.body;
	const user_id = req.user.id;

	try {
		await pool.query(
			"INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
			[user_id, product_id]
		);
		res.status(201).json({ message: "Adăugat la favorite" });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

// Get all favorite products for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
	const user_id = req.user.id;

	try {
		const result = await pool.query(
			`SELECT p.id, p.name, p.brand, p.image_url
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

// Remove a product from favorites for the authenticated user
router.delete("/", authenticateToken, async (req, res) => {
	const { product_id } = req.body;
	const user_id = req.user.id;

	try {
		await pool.query(
			"DELETE FROM favorites WHERE user_id = $1 AND product_id = $2",
			[user_id, product_id]
		);
		res.json({ message: "Șters din favorite" });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

module.exports = router;
