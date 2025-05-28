const multer = require("multer");
const { randomUUID } = require("crypto");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../s3");
const path = require("path");

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToS3 = async (req, res, next) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "Fișierul lipsește" });
		}

		const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
		if (!allowedTypes.includes(req.file.mimetype)) {
			return res.status(400).json({ error: "Formatul imaginii nu este acceptat." });
		}

		const MAX_SIZE = 5 * 1024 * 1024;
		if (req.file.size > MAX_SIZE) {
			return res.status(400).json({ error: "Imaginea este prea mare. Dimensiune maximă: 5MB." });
		}

		const folder = req.uploadFolder || "generic";
		const fileExt = path.extname(req.file.originalname) || ".jpg";
		const key = `${folder}/${randomUUID()}${fileExt}`;

		const params = {
			Bucket: BUCKET_NAME,
			Key: key,
			Body: req.file.buffer,
			ContentType: req.file.mimetype,
		};

		await s3Client.send(new PutObjectCommand(params));

		req.fileUrl = `https://${process.env.AWS_CLOUDFRONT_DOMAIN}/${key}`;
		next();

	} catch (error) {
		console.error("Eroare la upload S3:", error);
		res.status(500).json({ error: "Eroare la încărcarea imaginii" });
	}
};

module.exports = {
	upload,
	uploadToS3
};
