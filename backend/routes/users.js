const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get all users from the database
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, username, email FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get user profile. This route is protected and requires a valid JWT token
router.get("/profile", authenticateToken, async (req, res) => {
    try {
		console.log("Authenticated User:", req.user);

		if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized. Invalid user data" });
        }

        const user = await pool.query("SELECT id, username, email, role FROM users WHERE id = $1", [req.user.id]);

        if (user.rows.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}

        res.json(user.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get a user by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
