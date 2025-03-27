const express = require("express");
const pool = require("../db");
const router = express.Router();
const multer = require("multer");
const xlsx = require("xlsx");
const authenticateToken = require("../middleware/authMiddleware");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all products
router.get("/", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM products");
		res.json(result.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

// Add a new product
router.post("/", authenticateToken, async (req, res) => {
	const {
		name,
		brand,
		made_in_romania,
		certified_arig,
		weight,
		unit,
		image_url = "https://example.com/default-image.jpg",
		ean_code,
		allergen_tags,
		category,
		description,
		cross_grain_cert_code,
		producer_gluten_declaration = false,
		store_id 
	} = req.body;

	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	try {

		if (category) {
			const categoryCheck = await pool.query("SELECT 1 FROM categories WHERE name = $1", [category]);
			if (categoryCheck.rowCount === 0) {
				return res.status(400).json({ error: `Categoria '${category}' nu există.` });
			}
		} else {
			console.log("Categoria nu a fost selectată.");
			return res.status(400).json({ error: "Categoria nu a fost selectată." });
		}

		if (!store_id) {
			return res.status(400).json({ error: "Magazinul nu a fost selectat." });
		}


		// Formatează etichetele alergenilor
		const formattedAllergenTags = Array.isArray(allergen_tags)
		? allergen_tags.map(tag => tag.trim().toLowerCase())
		: [];

		let productId;

		const existingProduct = await pool.query("SELECT id FROM products WHERE ean_code = $1", [ean_code]);
		if (existingProduct.rows.length > 0) {
			// UPDATE
			productId = existingProduct.rows[0].id;
			await pool.query(`
				UPDATE products SET
					name = $1, brand = $2, made_in_romania = $3, certified_arig = $4,
					weight = $5, unit = $6, image_url = $7,
					allergen_tags = $8, category = $9, description = $10, cross_grain_cert_code = $11,
					producer_gluten_declaration = $12
				WHERE id = $13
			`, [
				name, brand, made_in_romania, certified_arig,
				weight, unit, image_url, formattedAllergenTags,
				category, description, cross_grain_cert_code,
				producer_gluten_declaration, productId
			]);

		} else {
			// INSERT
			const insertResult = await pool.query(`
				INSERT INTO products (
					name, brand, made_in_romania, certified_arig,
					weight, unit, image_url, ean_code,
					allergen_tags, category, description, cross_grain_cert_code,
					producer_gluten_declaration
				) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
				RETURNING id
			`, [
				name, brand, made_in_romania, certified_arig,
				weight, unit, image_url, ean_code,
				formattedAllergenTags, category, description,
				cross_grain_cert_code, producer_gluten_declaration
			]);

			productId = insertResult.rows[0].id;
		}

		const existsLink = await pool.query(`
			SELECT 1 FROM product_stores WHERE product_id = $1 AND store_id = $2
		`, [productId, store_id]);

		if (existsLink.rows.length === 0) {
			await pool.query(
				"INSERT INTO product_stores (product_id, store_id) VALUES ($1, $2)",
				[productId, store_id]
			);
		}

		res.status(201).json({ message: "Produs adăugat sau actualizat cu succes." });

	} catch (err) {
		console.error("Eroare la adăugarea produsului:", err.message);

		if (err.code === "23505") {
			return res.status(400).json({ error: "Codul EAN trebuie să fie unic." });
		}

		res.status(500).json({ error: "Eroare de server" });
	}
});

// Upload and process Excel file for bulk product insert
router.post("/upload", authenticateToken, upload.single("file"), async (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	try {
		if (!req.file) {
			return res.status(400).json({ error: "Niciun fișier nu a fost încărcat." });
		}

		const fileName = req.file.originalname;
		const storeNameMatch = fileName.match(/Tabel_Informatii_(.*?)\.xlsx/);

		if (!storeNameMatch) {
			return res.status(400).json({
				error: "Numele fișierului nu este corect. Folosește formatul: 'Tabel_Informatii_Nume_Magazin.xlsx'",
			});
		}

		const storeName = storeNameMatch[1].replace(/_/g, " ");
		console.log(`Procesăm date pentru magazinul: ${storeName}`);

		const storeQuery = await pool.query("SELECT id FROM stores WHERE name = $1", [storeName]);
		if (storeQuery.rows.length === 0) {
            return res.status(400).json({
                error: `Magazinul '${storeName}' nu există în baza de date. Adaugă mai întâi magazinul.`,
            });
        }

		const storeId = storeQuery.rows[0].id;

		const categoryQuery = await pool.query("SELECT name FROM categories");
		const existingCategories = categoryQuery.rows.map((row) => row.name.toLowerCase());

		const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];

		const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
			defval: "",
			raw: false
		});

		let added = 0, updated = 0;

		for (const row of data) {
			const name = row["Denumire produs"] ?? null;
			const brand = row["Brand"] ?? null;
			const weight = parseFloat(row["Gramaj"]) || null;
			const unit = row["Unitate de măsura gramaj"] ?? null;
			const ean_code = row["Cod de bare produs (cod EAN certificat GS1)"] ?? null;
			let category = row["Categorie produs"]?.trim() ?? null;
			const image_url = null;
			const description = row["Descriere produs"] ?? null;
			const cross_grain_cert_code = row["Certificat Crossed Grain"] ?? null;			
			const allergenRaw = row["Alergeni (lista/flag-uri)"] ?? "";

			const producer = row["Producător"] ?? "";
			const made_in_romania = /rom[aâ]nia/i.test(producer);
			const certified_arig = (row["Etichetat Gluten Free"] ?? "").toString().toLowerCase().includes("da");
			const producerDeclarationRaw = row["Declarație producător (DA/NU)"]?.toString().trim().toLowerCase();
			const producer_gluten_declaration = producerDeclarationRaw === "da";

			const allergen_tags = allergenRaw
				.split(",")
				.map((a) => a.trim().toLowerCase())
				.filter(Boolean);

			// Ignore rows with no data
			if(!name && !ean_code && !category && !weight && !unit && !brand && !description && !cross_grain_cert_code) {
				continue;
			}

			// Verify required fields
			if (!name || !ean_code) {
				return res.status(400).json({
					error: `Produs invalid: lipsă nume sau cod EAN la rândul: ${JSON.stringify(row)}`
				});
			}

			// Verify category
			if (category && !existingCategories.includes(category.toLowerCase())) {
				return res.status(400).json({
					error: `Categoria '${category}' nu există în baza de date. Te rugăm să o corectezi.`,
				});
			}

			try {
				const existingProduct = await pool.query("SELECT id FROM products WHERE ean_code = $1", [ean_code]);
				let productId = null;

				if (existingProduct.rows.length > 0) {
					// UPDATE
					productId = existingProduct.rows[0].id;
					const existingName = existingProduct.rows[0].name;

					if (existingName !== name) {
						console.warn(`Produsul cu EAN ${ean_code} are deja alt nume în baza de date: '${existingName}' vs '${name}'. Se ignoră.`);
						continue;
					}

					await pool.query(`
						UPDATE products SET
							name = $1, brand = $2, made_in_romania = $3, certified_arig = $4,
							weight = $5, unit = $6, image_url = $7,
							allergen_tags = $8, category = $9, description = $10, cross_grain_cert_code = $11,
							producer_gluten_declaration = $12
						WHERE id = $13
					`, [
						name,
						brand,
						made_in_romania,
						certified_arig,
						weight,
						unit,
						image_url,
						allergen_tags,
						category,
						description,
						cross_grain_cert_code,
						producer_gluten_declaration,
						productId
					]);
					
					updated++;
					console.log(`Produs actualizat: ${name}`);
			
				} else {
					// INSERT
					const insertProduct = await pool.query(`
						INSERT INTO products (
							name, brand, made_in_romania, certified_arig,
							weight, unit, image_url, ean_code,
							allergen_tags, category, description, cross_grain_cert_code,
							producer_gluten_declaration
						) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
						RETURNING id
					`, [
						name,
						brand,
						made_in_romania,
						certified_arig,
						weight,
						unit,
						image_url,
						ean_code,
						allergen_tags,
						category,
						description,
						cross_grain_cert_code,
						producer_gluten_declaration
					]);
					
					added++;
					productId = insertProduct.rows[0].id;
					console.log(`Produs adăugat: ${name}`);
				}

				// Link product to store
				await pool.query(
					"INSERT INTO product_stores (product_id, store_id) VALUES ($1, $2)",
					[productId, storeId]
				);

				// Link product to category
				if (category) {
					const existingStoreCategory = await pool.query(
						"SELECT 1 FROM store_categories WHERE store_id = $1 AND category = $2",
						[storeId, category]
					);

					if (existingStoreCategory.rows.length === 0) {
						await pool.query(
							"INSERT INTO store_categories (store_id, category) VALUES ($1, $2)",
							[storeId, category]
						);
					}
				}

			} catch (err) {
				console.warn(`Eroare la inserarea produsului ${name} : ${err.message}`);
				return res.status(400).json({
					error: `Eroare la inserarea produsului '${name}') : ${err.message}`
				});
			}
		}

		res.status(200).json({
			message: "Fișier procesat cu succes!",
			adaugate: added,
			actualizate: updated
		});

	} catch (err) {
		console.error("Eroare la procesarea fișierului:", err);
		res.status(500).json({ error: "Eroare de server" });
	}
});

// Update an existing product
router.put("/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;
	const {
		name,
		brand,
		made_in_romania,
		certified_arig,
		weight,
		unit,
		image_url,
		ean_code,
		allergen_tags,
		category,
		description,
		cross_grain_cert_code,
		producer_gluten_declaration = false
	} = req.body;

	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	try {
		// Verifică existența produsului
		const exists = await pool.query("SELECT 1 FROM products WHERE id = $1", [id]);
		if (exists.rowCount === 0) {
			return res.status(404).json({ error: "Produsul nu a fost găsit." });
		}

		// Validare categorie
		if (category) {
			const categoryCheck = await pool.query("SELECT 1 FROM categories WHERE name = $1", [category]);
			if (categoryCheck.rowCount === 0) {
				return res.status(400).json({ error: `Categoria '${category}' nu există.` });
			}
		}

		const formattedAllergenTags = Array.isArray(allergen_tags)
			? allergen_tags.map(tag => tag.trim().toLowerCase())
			: [];

		await pool.query(`
			UPDATE products SET
				name = $1, brand = $2, made_in_romania = $3, certified_arig = $4,
				weight = $5, unit = $6, image_url = $7, ean_code = $8,
				allergen_tags = $9, category = $10, description = $11,
				cross_grain_cert_code = $12, producer_gluten_declaration = $13
			WHERE id = $14
		`, [
			name,
			brand,
			made_in_romania,
			certified_arig,
			weight,
			unit,
			image_url,
			ean_code,
			formattedAllergenTags,
			category,
			description,
			cross_grain_cert_code,
			producer_gluten_declaration,
			id
		]);

		res.json({ message: "Produs actualizat cu succes." });
	} catch (err) {
		console.error("Eroare la actualizare produs:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

// Delete a product
router.delete("/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;

	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	try {
		// Ștergem din product_stores (legătura cu magazine)
		await pool.query("DELETE FROM product_stores WHERE product_id = $1", [id]);

		// Apoi din products
		await pool.query("DELETE FROM products WHERE id = $1", [id]);

		res.json({ message: "Produs șters cu succes." });
	} catch (err) {
		console.error("Eroare la ștergere produs:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

module.exports = router;
