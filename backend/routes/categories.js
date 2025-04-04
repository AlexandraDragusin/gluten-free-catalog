const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// Get all categories
router.get("/", async (req, res) => {
	try {
		const result = await pool.query("SELECT id, name FROM categories ORDER BY name");
		res.json(result.rows);
	} catch (err) {
		console.error("Eroare la preluarea categoriilor:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

// Update a category by id
router.put("/:id", authenticateToken, async (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	const { id } = req.params;
	const { name: newName } = req.body;

	if (!newName || newName.trim() === "") {
		return res.status(400).json({ error: "Numele categoriei nu poate fi gol." });
	}

	try {
		const existing = await pool.query("SELECT 1 FROM categories WHERE LOWER(name) = LOWER($1) AND id != $2", [newName.trim(), id]);
		if (existing.rows.length > 0) {
			return res.status(400).json({ error: "Această categorie există deja." });
		}

		await pool.query("UPDATE categories SET name = $1 WHERE id = $2", [newName.trim(), id]);
		res.json({ message: "Categoria a fost actualizată cu succes." });
	} catch (err) {
		console.error("Eroare la actualizarea categoriei:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

// Delete a category
router.delete("/:id", authenticateToken, async (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	const { id } = req.params;

	try {
		// Verificăm dacă categoria este folosită în produse
		const result = await pool.query("SELECT COUNT(*) FROM products WHERE category_id = $1", [id]);
		if (parseInt(result.rows[0].count) > 0) {
			return res.status(400).json({ error: "Categoria nu poate fi ștearsă deoarece este folosită de produse." });
		}

		await pool.query("DELETE FROM categories WHERE id = $1", [id]);
		res.json({ message: "Categoria a fost ștearsă cu succes." });
	} catch (err) {
		console.error("Eroare la ștergerea categoriei:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

// Add a new category
router.post("/", authenticateToken, async (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	const { name } = req.body;

	if (!name || name.trim() === "") {
		return res.status(400).json({ error: "Numele categoriei este obligatoriu." });
	}

	try {
		// Verificăm dacă există deja o categorie cu același nume (case-insensitive)
		const existing = await pool.query("SELECT 1 FROM categories WHERE LOWER(name) = LOWER($1)", [name.trim()]);
		if (existing.rows.length > 0) {
			return res.status(400).json({ error: "Categoria există deja." });
		}

		const result = await pool.query(
			"INSERT INTO categories (name) VALUES ($1) RETURNING id, name",
			[name.trim()]
		);

		res.status(201).json(result.rows[0]); // returnăm { id, name }
	} catch (err) {
		console.error("Eroare la adăugarea categoriei:", err.message);
		res.status(500).json({ error: "Eroare la server." });
	}
});

module.exports = router;