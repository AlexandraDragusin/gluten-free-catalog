const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// Get all categories
router.get("/", async (req, res) => {
	try {
		const result = await pool.query("SELECT name FROM categories ORDER BY name");
		res.json(result.rows.map(row => row.name));
	} catch (err) {
		console.error("Eroare la preluarea categoriilor:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

// Update a category
router.put("/:oldName", authenticateToken, async (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	const { oldName } = req.params;
	const { name: newName } = req.body;

	if (!newName || newName.trim() === "") {
		return res.status(400).json({ error: "Numele categoriei nu poate fi gol." });
	}

	try {
		const existing = await pool.query("SELECT 1 FROM categories WHERE name = $1", [newName.trim()]);
		if (existing.rows.length > 0) {
			return res.status(400).json({ error: "Această categorie există deja." });
		}

		await pool.query("UPDATE categories SET name = $1 WHERE name = $2", [newName.trim(), oldName]);
		res.json({ message: "Categoria a fost actualizată cu succes." });
	} catch (err) {
		console.error("Eroare la actualizarea categoriei:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

// Delete a category
router.delete("/:name", authenticateToken, async (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	const { name } = req.params;

	try {
		const result = await pool.query("SELECT COUNT(*) FROM products WHERE category = $1", [name]);
		if (parseInt(result.rows[0].count) > 0) {
			return res.status(400).json({ error: "Categoria nu poate fi ștearsă deoarece este folosită de produse." });
		}

		await pool.query("DELETE FROM categories WHERE name = $1", [name]);
		res.json({ message: "Categoria a fost ștearsă cu succes." });
	} catch (err) {
		console.error("Eroare la ștergerea categoriei:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

router.post("/", authenticateToken, async (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	const { name } = req.body;

	if (!name || name.trim() === "") {
		return res.status(400).json({ error: "Numele categoriei este obligatoriu." });
	}

	try {
		// Evită duplicate (ignoră case)
		const existing = await pool.query("SELECT 1 FROM categories WHERE LOWER(name) = LOWER($1)", [name]);
		if (existing.rows.length > 0) {
			return res.status(400).json({ error: "Categoria există deja." });
		}

		const result = await pool.query(
			"INSERT INTO categories (name) VALUES ($1) RETURNING *",
			[name.trim()]
		);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error("Eroare la adăugarea categoriei:", err.message);
		res.status(500).json({ error: "Eroare la server." });
	}
});

module.exports = router;