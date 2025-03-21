const express = require("express");
const pool = require("../db");
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
 * Registers a new user.
 */
router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Utilizatorul există deja" });
        }

		const hashedPassword = await bcrypt.hash(password, 10);

        const userRole = role && (role === "admin" || role === "user") ? role : "user";

        const result = await pool.query(
            "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
            [username, email, hashedPassword, userRole]
        );
		
		const newUser = result.rows[0];

		const token = generateToken(newUser);

        res.status(201).json({ message: "User registered successfully", token, user: newUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Eroare la server" });
    }
});


/**
 * Logs in a user.
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
			return res.status(401).json({ error: "Email-ul sau parola nu sunt valide" });
		}

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
			return res.status(401).json({ error: "Email-ul sau parola nu sunt valide" });
		}

		const token = generateToken(user.rows[0]);

        res.json({ message: "Login successful", token, user: { id: user.rows[0].id, username: user.rows[0].username } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Eroare la server" });
    }
});

module.exports = router;
