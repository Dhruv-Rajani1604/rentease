const express = require("express");
const path = require("path");
const products = require("./data/products.json");

const app = express();
const PORT = process.env.PORT || 3000;

// Send every product as JSON
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Send one product by its id, or a 404 message if it doesn't exist
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

// Serve the website files (index.html, css/, js/, images/) from this folder
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`RentEase running at http://localhost:${PORT}`);
});