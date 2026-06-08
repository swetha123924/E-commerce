const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing and comparison
const registerUser  = require('./register.cjs'); // Ensure this import is correct

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "ecommerce",
  password: "password",
  port: 5432
});

client.connect()
  .then(() => console.log("Connected to database"))
  .catch(err => console.error("Connection error", err.stack));

// Registration endpoint
app.post("/api/auth/register", async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body; // Ensure variable names match
  try {
    const result = await registerUser (client, { email, password, firstName, lastName, role });
    res.status(201).json({ message: 'User  registered successfully', user: result });
  } catch (err) {
    console.error("Registration error:", err); // Log the error for debugging
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If login is successful, return user data (excluding password)
    const { password: _, ...userData } = user; // Exclude password from response
    res.status(200).json(userData);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/api/cart/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO user_cart_${userId} (product_id, quantity) VALUES ($1, $2)`,
      [productId, quantity]
    );
    res.status(201).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
});
app.get("/api/cart/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await client.query(`SELECT * FROM user_cart_${userId}`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    res.status(500).json({ message: 'Error retrieving cart items' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});