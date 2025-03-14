const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
	// Get token from Authorization header
	const authHeader = req.header("Authorization");

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Access denied. No token provided" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
		console.log("Decoded User:", decodedUser);

		if (!decodedUser.id) {
			return res.status(401).json({ error: "Invalid token data. No user ID found." });
		}

		req.user = decodedUser;
		next();
	} catch (err) {
		console.error("JWT Verification Error:", err);
		return res.status(403).json({ message: "Invalid Token." });
	}
}

module.exports = authenticateToken;
