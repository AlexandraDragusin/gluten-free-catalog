const express = require("express");
const pool = require("../db");
const router = express.Router();
const xlsx = require("xlsx");
const authenticateToken = require("../middleware/authMiddleware");

const { upload, uploadToS3 } = require("../middleware/uploadMiddleware");

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

// Get a single product by ID with all details
router.get("/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query(`
			SELECT 
				p.*,
				c.id AS category_id,
				c.name AS category_name,
				s.id AS store_id,
				s.name AS store_name,
				s.type AS store_type,
				s.website AS store_website,
				s.logo_url AS store_logo
			FROM products p
			LEFT JOIN categories c ON p.category_id = c.id
			LEFT JOIN stores s ON p.store_id = s.id
			WHERE p.id = $1
		`, [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Produsul nu a fost găsit." });
		}

		const p = result.rows[0];

		// Pregătim răspunsul pentru frontend
		const fullProduct = {
			id: p.id,
			name: p.name,
			brand: p.brand,
			description: p.description,
			ean: p.ean_code,
			image_url: p.image_url,
			weight: p.weight,
			unit: p.unit,
			certified_arig: p.certified_arig,
			made_in_romania: p.made_in_romania,
			producer_gluten_declaration: p.producer_gluten_declaration,
			cross_grain_cert_code: p.cross_grain_cert_code,

			allergen_tags: Array.isArray(p.allergen_tags) ? p.allergen_tags : [],

			category: {
				id: p.category_id,
				name: p.category_name
			},

			stores: p.store_id ? [{
				id: p.store_id,
				name: p.store_name,
				type: p.store_type,
				website: p.store_website,
				logo: p.store_logo
			}] : []
		};

		res.json(fullProduct);
	} catch (err) {
		console.error("Eroare la fetch produs:", err.message);
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
		category_id,
		description,
		cross_grain_cert_code,
		producer_gluten_declaration = false,
		store_id 
	} = req.body;

	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	try {
		if (category_id) {
			const categoryCheck = await pool.query("SELECT 1 FROM categories WHERE id = $1", [category_id]);
			if (categoryCheck.rowCount === 0) {
			  return res.status(400).json({ error: `Categoria cu ID '${category_id}' nu există.` });
			}
		} else {
			return res.status(400).json({ error: "Categoria nu a fost selectată." });
		}

		if(store_id) {
			const storeCheck = await pool.query("SELECT 1 FROM stores WHERE id = $1", [store_id]);
			if (storeCheck.rowCount === 0) {
				return res.status(400).json({ error: `Magazinul cu ID '${store_id}' nu există.` });
			}
		} else {
			console.log("Magazinul nu a fost selectat.");
			return res.status(400).json({ error: "Magazinul nu a fost selectat." });
		}

		// Format allergen_tags to lowercase and trim whitespace
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
					allergen_tags = $8, category_id = $9, description = $10, cross_grain_cert_code = $11,
					producer_gluten_declaration = $12, store_id = $13
				WHERE id = $14
			`, [
				name, brand, made_in_romania, certified_arig,
				weight, unit, image_url, formattedAllergenTags,
				category_id, description, cross_grain_cert_code,
				producer_gluten_declaration, store_id, productId
			]);

		} else {
			// INSERT
			const insertResult = await pool.query(`
				INSERT INTO products (
					name, brand, made_in_romania, certified_arig,
					weight, unit, image_url, ean_code,
					allergen_tags, category_id, description, cross_grain_cert_code,
					producer_gluten_declaration, store_id
				) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
				RETURNING id
			`, [
				name, brand, made_in_romania, certified_arig,
				weight, unit, image_url, ean_code,
				formattedAllergenTags, category_id, description,
				cross_grain_cert_code, producer_gluten_declaration, store_id
			]);

			productId = insertResult.rows[0].id;
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

		const categoryQuery = await pool.query("SELECT id, name FROM categories");
		const categoryMap = new Map(
			categoryQuery.rows.map(row => [row.name.toLowerCase(), row.id])
		);

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
			
			const categoryName = row["Categorie produs"]?.trim().toLowerCase() || null;
			const category_id = categoryMap.get(categoryName) || null;

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
			if(!name && !ean_code && !category_id && !weight && !unit && !brand && !description && !cross_grain_cert_code) {
				continue;
			}

			// Verify required fields
			if (!name || !ean_code) {
				return res.status(400).json({
					error: `Produs invalid: lipsă nume sau cod EAN la rândul: ${JSON.stringify(row)}`
				});
			}

			// Verify category
			if (!category_id) {
				return res.status(400).json({
					error: `Categoria '${categoryName}' nu există în baza de date. Te rugăm să o adaugi mai întâi.`,
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
							allergen_tags = $8, category_id = $9, description = $10, cross_grain_cert_code = $11,
							producer_gluten_declaration = $12, store_id = $13
						WHERE id = $14
					`, [
						name,
						brand,
						made_in_romania,
						certified_arig,
						weight,
						unit,
						image_url,
						allergen_tags,
						category_id,
						description,
						cross_grain_cert_code,
						producer_gluten_declaration,
						storeId,
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
							allergen_tags, category_id, description, cross_grain_cert_code,
							producer_gluten_declaration, store_id
						) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
						category_id,
						description,
						cross_grain_cert_code,
						producer_gluten_declaration,
						storeId
					]);
					
					added++;
					productId = insertProduct.rows[0].id;
					console.log(`Produs adăugat: ${name}`);
				}

				// Link product to category
				if (category_id) {
					const existingStoreCategory = await pool.query(
						"SELECT 1 FROM store_categories WHERE store_id = $1 AND category_id = $2",
						[storeId, category_id]
					);

					if (existingStoreCategory.rows.length === 0) {
						await pool.query(
							"INSERT INTO store_categories (store_id, category_id) VALUES ($1, $2)",
							[storeId, category_id]
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
		category_id,
		description,
		cross_grain_cert_code,
		producer_gluten_declaration = false,
		store_id
	} = req.body;

	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	try {
		// Check if product exists
		const exists = await pool.query("SELECT 1 FROM products WHERE id = $1", [id]);
		if (exists.rowCount === 0) {
			return res.status(404).json({ error: "Produsul nu a fost găsit." });
		}

		// Validate category and store
		if (category_id) {
			const categoryCheck = await pool.query("SELECT 1 FROM categories WHERE id = $1", [category_id]);
			if (categoryCheck.rowCount === 0) {
			  return res.status(400).json({ error: `Categoria cu ID '${category_id}' nu există.` });
			}
		} else {
			return res.status(400).json({ error: "Categoria nu a fost selectată." });
		}

		if (store_id) {
			const storeCheck = await pool.query("SELECT 1 FROM stores WHERE id = $1", [store_id]);
			if (storeCheck.rowCount === 0) {
				return res.status(400).json({ error: `Magazinul cu ID '${store_id}' nu există.` });
			}
		}

		const formattedAllergenTags = Array.isArray(allergen_tags)
			? allergen_tags.map(tag => tag.trim().toLowerCase())
			: [];

		await pool.query(`
			UPDATE products SET
				name = $1, brand = $2, made_in_romania = $3, certified_arig = $4,
				weight = $5, unit = $6, image_url = $7, ean_code = $8,
				allergen_tags = $9, category_id = $10, description = $11,
				cross_grain_cert_code = $12, producer_gluten_declaration = $13, store_id = $14
			WHERE id = $15
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
			category_id,
			description,
			cross_grain_cert_code,
			producer_gluten_declaration,
			store_id,
			id
		]);

		res.json({ message: "Produs actualizat cu succes." });
	} catch (err) {
		console.error("Eroare la actualizare produs:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

// Upload product image to Cloudinary
router.post("/upload-image",
	authenticateToken,
	(req, res, next) => { req.uploadFolder = "product-images"; next(); },
	upload.single("image"),
	uploadToS3,
	async (req, res) => {
		if (!req.user || req.user.role !== "admin") {
			return res.status(403).json({ error: "Acces interzis." });
		}

		const imageUrl = req.fileUrl;

		try {
			res.json({ imageUrl: imageUrl });

		} catch (error) {
			console.error("Eroare la upload imagine produs:", error);
			res.status(500).json({ error: "Eroare la încărcarea imaginii." });
		}
	}
);

// Delete a product
router.delete("/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;

	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Acces interzis" });
	}

	try {
		await pool.query("DELETE FROM products WHERE id = $1", [id]);

		res.json({ message: "Produs șters cu succes." });
	} catch (err) {
		console.error("Eroare la ștergere produs:", err.message);
		res.status(500).json({ error: "Eroare la server" });
	}
});

module.exports = router;
