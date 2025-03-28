const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const pool = require("../db");

// GET
router.get("/", async (req, res) => {
	try {
		const result = await pool.query("SELECT code, name FROM allergens ORDER BY name");
		res.json(result.rows);
	} catch (err) {
		console.error("Eroare la obținerea alergenilor:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

// POST
router.post("/", authenticateToken, async (req, res) => {
	if (req.user.role !== "admin") return res.status(403).json({ error: "Acces interzis" });

	const { code, name } = req.body;
	if (!code || !name) {
		return res.status(400).json({ error: "Codul și numele alergenului sunt necesare." });
	}

	try {
		const result = await pool.query(
			"INSERT INTO allergens (code, name) VALUES ($1, $2) RETURNING *",
			[code.trim().toLowerCase(), name.trim()]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error("Eroare la adăugare:", err.message);
		res.status(500).json({ error: "Alergenul există deja sau eroare la server." });
	}
});

// PUT
router.put("/:code", authenticateToken, async (req, res) => {
	if (req.user.role !== "admin") return res.status(403).json({ error: "Acces interzis" });

	const oldCode = req.params.code;
	const { code: newCode, name } = req.body;

	if (!newCode || !name) {
		return res.status(400).json({ error: "Codul și numele sunt necesare." });
	}

	try {
		const result = await pool.query(
			`UPDATE allergens SET code = $1, name = $2 WHERE code = $3 RETURNING *`,
			[newCode.trim(), name.trim(), oldCode]
		);

		if (result.rowCount === 0) {
			return res.status(404).json({ error: "Alergenul nu a fost găsit." });
		}

		res.status(200).json({ message: "Alergen actualizat cu succes" });
	} catch (err) {
		console.error("Eroare la actualizare:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

// DELETE
router.delete("/:code", authenticateToken, async (req, res) => {
	if (req.user.role !== "admin") return res.status(403).json({ error: "Acces interzis" });

	const { code } = req.params;

	try {
		await pool.query("DELETE FROM allergens WHERE code = $1", [code]);
		res.status(200).json({ message: "Alergen șters cu succes." });
	} catch (err) {
		console.error("Eroare la ștergere:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

module.exports = router;
