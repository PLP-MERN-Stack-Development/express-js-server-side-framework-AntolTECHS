// server.js - Complete Express.js API for Week 2 Assignment

const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || "my-secret-key"; // Example auth key

// ===================== MIDDLEWARE =====================

// Parse JSON request bodies
app.use(bodyParser.json());

// Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Authentication Middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== API_KEY) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid API key" });
  }
  next();
};

// ===================== CUSTOM ERROR CLASSES =====================
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

// ===================== SAMPLE DATA =====================
let products = [
  {
    id: uuidv4(),
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: uuidv4(),
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: uuidv4(),
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// ===================== ROUTES =====================

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Product API! Use /api/products to interact with data.");
});

// GET /api/products — list all products (with filter, pagination, search)
app.get("/api/products", (req, res) => {
  let results = [...products];
  const { category, search, page = 1, limit = 10 } = req.query;

  // Filter by category
  if (category) {
    results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  // Search by name
  if (search) {
    results = results.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const paginatedResults = results.slice(startIndex, startIndex + parseInt(limit));

  res.json({
    success: true,
    total: results.length,
    page: Number(page),
    limit: Number(limit),
    data: paginatedResults,
  });
});

// GET /api/products/:id — get product by ID
app.get("/api/products/:id", (req, res, next) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return next(new NotFoundError("Product not found"));
  res.json({ success: true, data: product });
});

// POST /api/products — create a new product
app.post("/api/products", authenticate, (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || !price || !category || inStock === undefined) {
    return next(new ValidationError("All product fields are required"));
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock,
  };

  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// PUT /api/products/:id — update a product
app.put("/api/products/:id", authenticate, (req, res, next) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return next(new NotFoundError("Product not found"));

  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || !price || !category || inStock === undefined) {
    return next(new ValidationError("All fields are required for update"));
  }

  product.name = name;
  product.description = description;
  product.price = price;
  product.category = category;
  product.inStock = inStock;

  res.json({ success: true, data: product });
});

// DELETE /api/products/:id — delete a product
app.delete("/api/products/:id", authenticate, (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError("Product not found"));

  const deletedProduct = products.splice(index, 1);
  res.json({ success: true, data: deletedProduct[0] });
});

// GET /api/products/stats — count by category
app.get("/api/products/stats", (req, res) => {
  const stats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  res.json({ success: true, stats });
});

// ===================== GLOBAL ERROR HANDLER =====================
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    error: err.name,
    message: err.message || "Internal Server Error",
  });
});

// ===================== SERVER START =====================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
