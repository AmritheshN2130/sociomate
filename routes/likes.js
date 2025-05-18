const express = require('express');
const router = express.Router();
const db = require('../db');
const axios = require("axios");

// ✅ Helper function to notify via Lambda
const notify = async (userId, message, type = "like") => {
  try {
    await axios.post("https://slqvk0bkr1.execute-api.ap-south-1.amazonaws.com/dev", {
      userId,
      message,
      type
    });
  } catch (err) {
    console.error("Lambda notification failed:", err.message);
  }
};

// ✅ GET /likes/:post_id → Count + status
router.get('/likes/:post_id', async (req, res) => {
  const post_id = req.params.post_id;
  const user_id = req.query.user_id;

  try {
    const [[countRes]] = await db.query(
      'SELECT COUNT(*) AS like_count FROM likes WHERE post_id = ?',
      [post_id]
    );

    let liked_by_user = false;
    if (user_id) {
      const [likedRows] = await db.query(
        'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
        [post_id, user_id]
      );
      liked_by_user = likedRows.length > 0;
    }

    res.send({ like_count: countRes.like_count, liked_by_user });
  } catch (err) {
    console.error('❌ Error getting likes:', err);
    res.status(500).send('Error getting likes');
  }
});

// ✅ POST /likes → Toggle like
router.post('/likes', async (req, res) => {
  const { user_id, post_id } = req.body;

  if (!user_id || !post_id) {
    return res.status(400).send('Missing user_id or post_id');
  }

  try {
    const [existing] = await db.query(
      'SELECT * FROM likes WHERE user_id = ? AND post_id = ?',
      [user_id, post_id]
    );

    if (existing.length > 0) {
      await db.query(
        'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
        [user_id, post_id]
      );
      return res.send({ liked: false });
    } else {
      await db.query(
        'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
        [user_id, post_id]
      );

      // ✅ Get post owner's user_id and username
      const [[post]] = await db.query(`
        SELECT users.id AS owner_id, users.username AS owner_name
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
      `, [post_id]);

      // ✅ Get liker username
      const [[liker]] = await db.query(`SELECT username FROM users WHERE id = ?`, [user_id]);

      if (post && liker) {
        const message = `${liker.username} liked your post`;
        notify(post.owner_id, message, "like");
      }

      return res.send({ liked: true });
    }
  } catch (err) {
    console.error('❌ Error toggling like:', err);
    res.status(500).send('Like failed');
  }
});

module.exports = router;
