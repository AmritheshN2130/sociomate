const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Get all posts for home feed
router.get('/posts', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT posts.*, users.username, users.profile_pic
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `);
console.log("✅ Posts found:", rows.length);
console.log(rows);

    res.send(rows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Failed to fetch posts");
  }
});

module.exports = router;
