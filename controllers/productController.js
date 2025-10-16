import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const filePath = "./data/products.json";

const readData = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const writeData = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

export const getAllProducts = (req, res) => {
  const { category, page = 1, limit = 5 } = req.query;
  let products = readData();

  // Filtering
  if (category) {
    products = products.filter((p) => p.category === category);
  }

  // Pagination
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + Number(limit));

  res.json({
    page: Number(page),
    total: products.length,
    results: paginated,
  });
};

export const getProductById = (req, res) => {
  const products = readData();
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
};

export const createProduct = (req, res) => {
  const products = readData();
  const newProduct = { id: uuidv4(), ...req.body };
  products.push(newProduct);
  writeData(products);
  res.status(201).json(newProduct);
};

export const updateProduct = (req, res) => {
  const products = readData();
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  products[index] = { ...products[index], ...req.body };
  writeData(products);
  res.json(products[index]);
};

export const deleteProduct = (req, res) => {
  const products = readData();
  const updated = products.filter((p) => p.id !== req.params.id);
  if (updated.length === products.length)
    return res.status(404).json({ error: "Product not found" });

  writeData(updated);
  res.status(204).send();
};

export const searchProducts = (req, res) => {
  const { name } = req.query;
  const products = readData();
  const results = products.filter((p) =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );
  res.json(results);
};

export const getStats = (req, res) => {
  const products = readData();
  const stats = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  res.json(stats);
};
