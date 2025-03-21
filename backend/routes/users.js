const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

/** 
 * Generates a JWT token.
 */
const generateToken = (user) => {
	return jwt.sign(
		{
			id: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "1h" }
	);
};

/**
 * Get all users from the database
 */
router.get("/", async (req, res) => {
	try {
		const result = await pool.query("SELECT id, username, email, created_at FROM users");
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Eroare la server" });
	}
});

/**
 * Get user profile. This route is protected and requires a valid JWT token
 */
router.get("/profile", authenticateToken, async (req, res) => {
	try {
		console.log("Authenticated User:", req.user);

		if (!req.user || !req.user.id) {
			return res.status(401).json({ error: "Utilizatorul nu a fost găsit" });
		}

		const user = await pool.query("SELECT id, username, email, role, profile_picture FROM users WHERE id = $1", [req.user.id]);

		if (user.rows.length === 0) {
			return res.status(404).json({ error: "Utilizatorul nu a fost găsit" });
		}

		res.json(user.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Eroare la server" });
	}
});

/**
 * Update user profile. This route is protected and requires a valid JWT token
 */
router.put("/update", authenticateToken, async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const userId = req.user.id;

		const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
		if (userCheck.rows.length === 0) {
			return res.status(404).json({ error: "Utilizatorul nu a fost găsit" });
		}

		let updateFields = [];
		let values = [];
		let index = 1;

		if (username) {
			updateFields.push(`username = $${index}`);
			values.push(username);
			index++;
		}

		if (email) {
			updateFields.push(`email = $${index}`);
			values.push(email);
			index++;
		}

		if (password) {
			const hashedPassword = await bcrypt.hash(password, 10);
			updateFields.push(`password_hash = $${index}`);
			values.push(hashedPassword);
			index++;
		}

		if (updateFields.length === 0) {
			return res.status(400).json({ error: "Nu au fost efectuate modificări" });
		}

		values.push(userId);
		const updateQuery = `UPDATE users SET ${updateFields.join(", ")} WHERE id = $${index} RETURNING id, username, email, profile_picture, role`;

		const updatedUser = await pool.query(updateQuery, values);

		console.log("Updated User:", updatedUser.rows[0]);

		let newToken = null;
		if (password) {
			newToken = generateToken(updatedUser.rows[0]);
		}

		res.json({
			message: "Profile updated successfully",
			user: updatedUser.rows[0],
			token: newToken,
		});

	} catch (err) {
		console.error("Error updating profile:", err);
		res.status(500).json({ error: "Eroare la server" });
	}
});

/**
 * Delete user profile. This route is protected and requires a valid JWT token
 */
router.delete("/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;

	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis." });
	}

	try {
		const user = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);

		if (user.rowCount === 0) {
			return res.status(404).json({ error: "Utilizatorul nu a fost găsit" });
		}

		res.json({ message: "Utilizator șters cu succes." });
	} catch (err) {
		console.error("Eroare la ștergerea utilizatorului:", err);
		res.status(500).json({ error: "Eroare server." });
	}
});

/**
 * Get user by ID
 */
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const result = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [id]);
		if (result.rows.length === 0) return res.status(404).json({ error: "Utilizatorul nu a fost găsit" });
		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Eroare la server" });
	}
});

module.exports = router;
