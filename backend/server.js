const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running...");
});

// Routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const storeRoutes = require("./routes/stores");
const favoriteRoutes = require("./routes/favorites");
const reviewRoutes = require("./routes/reviews");
const storeCategoryRoutes = require("./routes/store_categories");
const productStoreRoutes = require("./routes/product_stores");
const categoriesRouter = require("./routes/categories");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoriesRouter); 
app.use("/api/stores", storeRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/store_categories", storeCategoryRoutes);
app.use("/api/product_stores", productStoreRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
