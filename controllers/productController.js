const pool = require('../models/db');

// Get all products
exports.getProducts = async (req, res) => {
  const products = await pool.query("SELECT * FROM products");
  res.json(products.rows);
};

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const newProduct = await pool.query(
    "INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, description, price, stock]
  );
  res.json(newProduct.rows[0]);
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  const updatedProduct = await pool.query(
    "UPDATE products SET name = $1, description = $2, price = $3, stock = $4 WHERE id = $5 RETURNING *",
    [name, description, price, stock, id]
  );
  res.json(updatedProduct.rows[0]);
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM products WHERE id = $1", [id]);
  res.json({ message: "Product deleted" });
};