const express = require("express");
const pool = require("../db");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

// Add a new review
router.post("/", authenticateToken, async (req, res) => {
	const { product_id, rating, comment } = req.body;
	const user_id = req.user.id; // luăm user-ul din token

	try {
		const result = await pool.query(
			`INSERT INTO reviews (product_id, user_id, rating, comment) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
			[product_id, user_id, rating, comment]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

// Get all reviews for a product
router.get("/:product_id", async (req, res) => {
    const { product_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT r.*, u.username  AS user_name
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.product_id = $1
             ORDER BY r.created_at DESC`,
            [product_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Eroare la încărcarea recenziilor:", err.message);
        res.status(500).json({ error: "Eroare la server" });
    }
});

// Delete a review by ID (only if it belongs to the user)
router.delete("/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;

	try {
		const check = await pool.query(
			"SELECT * FROM reviews WHERE id = $1 AND user_id = $2",
			[id, userId]
		);

		if (check.rowCount === 0) {
			return res.status(403).json({ error: "Nu ai permisiunea să ștergi această recenzie." });
		}

		await pool.query("DELETE FROM reviews WHERE id = $1", [id]);
		res.json({ message: "Recenzia a fost ștearsă cu succes." });
	} catch (err) {
		console.error("Eroare la ștergere:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

module.exports = router;
