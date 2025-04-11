const express = require("express");
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/mailer");

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
		// Validate input
		if (!username || !email || !password) {
			return res.status(400).json({ error: "Toate câmpurile sunt obligatorii" });
		}

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

		const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
		await pool.query(
			"UPDATE users SET verification_code = $1 WHERE id = $2",
			[verificationCode, newUser.id]
		);

		await sendVerificationEmail(newUser.email, verificationCode);

		res.status(201).json({ message: "User registered successfully" });
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

		if (!user.rows[0].is_verified) {
			return res.status(403).json({ error: "Contul nu este verificat. Verifică-ți emailul pentru codul de activare" });
		}

		const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
		if (!validPassword) {
			return res.status(401).json({ error: "Parola nu este validă" });
		}

		const token = generateToken(user.rows[0]);

		res.json({ message: "Login successful", token, user: { id: user.rows[0].id, username: user.rows[0].username } });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

/**
 * Verify user's email address.
 */
router.post("/verify", async (req, res) => {
	const { email, code } = req.body;

	try {
		const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

		if (userResult.rows.length === 0) {
			return res.status(404).json({ error: "Utilizatorul nu a fost găsit" });
		}

		const user = userResult.rows[0];

		if (user.is_verified) {
			return res.status(400).json({ error: "Contul este deja verificat" });
		}

		if (user.verification_code !== code) {
			return res.status(400).json({ error: "Cod de verificare incorect" });
		}

		await pool.query(
			"UPDATE users SET is_verified = TRUE, verification_code = NULL WHERE email = $1",
			[email]
		);

		const updatedResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
		const updatedUser = updatedResult.rows[0];

		const token = generateToken(updatedUser);

		res.json({
			message: "Cont verificat cu succes",
			token,
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role
			}
		});
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ error: "Eroare la server" });
		}
});

/**
 * Resend verification code to user's email.
 */
router.post("/resend-code", async (req, res) => {
	const { email } = req.body;

	try {
		const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

		if (userResult.rows.length === 0) {
			return res.status(404).json({ error: "Utilizatorul nu a fost găsit" });
		}

		const user = userResult.rows[0];

		if (user.is_verified) {
			return res.status(400).json({ error: "Contul este deja verificat" });
		}

		const newCode = Math.floor(100000 + Math.random() * 900000).toString();

		await pool.query(
			"UPDATE users SET verification_code = $1 WHERE email = $2",
			[newCode, email]
		);

		await sendVerificationEmail(email, newCode);

		res.json({ message: "Codul a fost retrimis" });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la trimiterea codului" });
	}
});

module.exports = router;
