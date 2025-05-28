require("dotenv").config();
const axios = require("axios");
const { Pool } = require("pg");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");
const path = require("path");

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_BUCKET_NAME;
const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN;

async function downloadImage(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return response.data;
}

async function uploadToS3(buffer, folder, originalName) {
  const ext = path.extname(originalName) || ".jpg";
  const key = `${folder}/${randomUUID()}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    })
  );

  return `https://${CLOUDFRONT_DOMAIN}/${key}`;
}

async function migrateImagesFromTable({ table, column, folder }) {
  console.log(`\nMigrating images from ${table}.${column}...`);

  const { rows } = await db.query(
    `SELECT id, ${column} FROM ${table} WHERE ${column} IS NOT NULL`
  );

  for (const row of rows) {
    const id = row.id;
    const imageUrl = row[column];

    if (!imageUrl.includes("cloudinary")) continue;

    try {
      const buffer = await downloadImage(imageUrl);
      const newUrl = await uploadToS3(buffer, folder, imageUrl);

      await db.query(
        `UPDATE ${table} SET ${column} = $1 WHERE id = $2`,
        [newUrl, id]
      );

      console.log(`Migrated image for ${table} ID ${id}`);
    } catch (error) {
      console.error(`Error with ${table} ID ${id}: ${error.message}`);
    }
  }
}

(async () => {
  await migrateImagesFromTable({
    table: "users",
    column: "profile_picture",
    folder: "profile-images",
  });

  await migrateImagesFromTable({
    table: "products",
    column: "image_url",
    folder: "product-images",
  });

  await migrateImagesFromTable({
    table: "stores",
    column: "logo_url",
    folder: "store-logos",
  });

  console.log("Migrare completă!");
  process.exit();
})();
