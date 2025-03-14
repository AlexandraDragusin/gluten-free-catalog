import { jwtDecode } from "jwt-decode";

/**
 * Checks if the user is logged in based on the presence and validity of the token.
 * @returns {boolean} true if logged in, false otherwise.
 */
export function checkLoginStatus() {
	const token = localStorage.getItem("token");
	if (!token) return false;

	return !isTokenExpired(token);
}


/**
 * Checks if a JWT token is expired.
 * @param {string} token - The JWT token.
 * @returns {boolean} true if expired, false otherwise.
 */
export function isTokenExpired(token) {
	try {
		const decoded = jwtDecode(token);
		const currentTime = Math.floor(Date.now() / 1000);
		return decoded.exp < currentTime;
	} catch (error) {
		console.error("Invalid token", error);
		return true;
	}
}

/**
 * Periodically checks if the token is expired and logs out the user if necessary.
 * @param {function} logoutCallback - Function to call when the token expires.
 */
export function checkTokenExpiration(logoutCallback) {
	const token = localStorage.getItem("token");
	if (token && isTokenExpired(token)) {
		logoutCallback();
	}
}
