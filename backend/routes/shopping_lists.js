const express = require("express");
const pool = require("../db");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

// Create a new shopping list
router.post("/", authenticateToken, async (req, res) => {
	const { name } = req.body;
	const user_id = req.user.id;

	if (!name) return res.status(400).json({ error: "Numele listei este obligatoriu." });

	try {
		const result = await pool.query(
			`INSERT INTO shopping_lists (user_id, name) 
			VALUES ($1, $2) RETURNING *`,
			[user_id, name]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la crearea listei." });
	}
});

// Add a product to a shopping list
router.post("/:listId/items", authenticateToken, async (req, res) => {
	const { product_id, quantity } = req.body;
	const { listId } = req.params;

	try {
		const result = await pool.query(
			`INSERT INTO shopping_list_items (shopping_list_id, product_id, quantity)
			 VALUES ($1, $2, $3) RETURNING *`,
			[listId, product_id, quantity || 1]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la adăugarea produsului în listă." });
	}
});

// Get all shopping lists for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
	const user_id = req.user.id;

	try {
		const result = await pool.query(
			`SELECT id, name, created_at 
			 FROM shopping_lists 
			 WHERE user_id = $1 
			 ORDER BY created_at DESC`,
			[user_id]
		);
		res.json(result.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la încărcarea listelor." });
	}
});

// Get items of a specific shopping list
router.get("/:listId/items", authenticateToken, async (req, res) => {
	const { listId } = req.params;

	try {
		const result = await pool.query(
			`SELECT sli.id, sli.quantity, sli.checked, 
			        p.id AS product_id, p.name, p.brand, p.image_url
			 FROM shopping_list_items sli
			 JOIN products p ON sli.product_id = p.id
			 WHERE sli.shopping_list_id = $1`,
			[listId]
		);
		res.json(result.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la încărcarea produselor din listă." });
	}
});

// Delete a product from a shopping list
router.delete("/items/:itemId", authenticateToken, async (req, res) => {
	const { itemId } = req.params;

	try {
		await pool.query(`DELETE FROM shopping_list_items WHERE id = $1`, [itemId]);
		res.json({ message: "Produs șters din listă." });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la ștergere produs." });
	}
});

// Delete a shopping list
router.delete("/:listId", authenticateToken, async (req, res) => {
	const { listId } = req.params;

	try {
		await pool.query(`DELETE FROM shopping_lists WHERE id = $1`, [listId]);
		res.json({ message: "Listă ștearsă." });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la ștergerea listei." });
	}
});

// Check/uncheck a product in a shopping list
router.patch("/items/:itemId/check", authenticateToken, async (req, res) => {
	const { itemId } = req.params;
	const { checked } = req.body;

	if (typeof checked !== "boolean") {
		return res.status(400).json({ error: "Valoarea 'checked' trebuie să fie booleană." });
	}

	try {
		const result = await pool.query(
			`UPDATE shopping_list_items SET checked = $1 WHERE id = $2 RETURNING *`,
			[checked, itemId]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Produsul nu a fost găsit." });
		}

		res.json(result.rows[0]);
	} catch (err) {
		console.error("Eroare la bifarea produsului:", err.message);
		res.status(500).json({ error: "Eroare la server." });
	}
});

// Update a shopping list name
router.put("/:listId", authenticateToken, async (req, res) => {
	const { listId } = req.params;
	const { name } = req.body;
	const user_id = req.user.id;

	if (!name) {
		return res.status(400).json({ error: "Numele listei este obligatoriu." });
	}

	try {
		const result = await pool.query(
			`UPDATE shopping_lists 
			 SET name = $1 
			 WHERE id = $2 AND user_id = $3 
			 RETURNING *`,
			[name, listId, user_id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Lista nu a fost găsită sau nu aparține utilizatorului." });
		}

		res.json(result.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la actualizarea listei." });
	}
});

// PATCH /items/:itemId/quantity
router.patch("/items/:itemId/quantity", authenticateToken, async (req, res) => {
	const { itemId } = req.params;
	const { quantity } = req.body;

	if (!quantity || quantity < 1) {
		return res.status(400).json({ error: "Cantitatea trebuie să fie un număr pozitiv." });
	}

	try {
		const result = await pool.query(
			`UPDATE shopping_list_items SET quantity = $1 WHERE id = $2 RETURNING *`,
			[quantity, itemId]
		);

		if (result.rowCount === 0) {
			return res.status(404).json({ error: "Itemul nu a fost găsit." });
		}

		res.json(result.rows[0]);
	} catch (err) {
		console.error("Eroare la actualizare cantitate:", err.message);
		res.status(500).json({ error: "Eroare la server." });
	}
});

module.exports = router;