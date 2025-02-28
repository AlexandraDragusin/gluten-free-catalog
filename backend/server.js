const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running...");
});

// Routes
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const storeRoutes = require("./routes/stores");
const favoriteRoutes = require("./routes/favorites");
const reviewRoutes = require("./routes/reviews");
const storeCategoryRoutes = require("./routes/store_categories");
const productStoreRoutes = require("./routes/product_stores");

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/store_categories", storeCategoryRoutes);
app.use("/api/product_stores", productStoreRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
