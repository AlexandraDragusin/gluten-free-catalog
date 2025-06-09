const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
	const authHeader = req.header("Authorization");

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Acces interzis. Te rugăm să te autentifici." });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

		if (!decodedUser.id) {
			return res.status(401).json({ error: "Token-ul este invalid. Nu s-a găsit id-ul utilizatorului." });
		}

		req.user = decodedUser;
		next();
	} catch (err) {
		return res.status(403).json({ message: "Token-ul este invalid" });
	}
}

module.exports = authenticateToken;
