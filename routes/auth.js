const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) return res.status(400).send("All fields required");

  const hashed = await bcrypt.hash(password, 10);
  try {
    await db.execute("INSERT INTO users (email, username, password) VALUES (?, ?, ?)", [email, username, hashed]);
    res.send({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).send("Signup failed");
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      console.log("❌ User not found");
      return res.status(400).send("User not found");
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      console.log("❌ Invalid password");
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.send({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Login failed");
  }
});

module.exports = router;
