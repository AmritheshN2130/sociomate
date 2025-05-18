const express = require('express');
const db = require('../db');
const router = express.Router();

// ❤️ LIKE/UNLIKE a post
router.post('/likes', async (req, res) => {
  const { user_id, post_id } = req.body;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM likes WHERE user_id = ? AND post_id = ?', [user_id, post_id]
    );

    if (rows.length > 0) {
      await db.execute('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [user_id, post_id]);
      return res.send({ liked: false });
    } else {
      await db.execute('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [user_id, post_id]);
      return res.send({ liked: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Like operation failed');
  }
});

// Get like count for a post
router.get('/likes/:post_id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as like_count FROM likes WHERE post_id = ?', [req.params.post_id]
    );
    res.send(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to get like count');
  }
});

// 💬 COMMENT on a post
router.post('/comments', async (req, res) => {
  const { user_id, post_id, comment } = req.body;
  try {
    await db.execute(
      'INSERT INTO comments (user_id, post_id, comment) VALUES (?, ?, ?)',
      [user_id, post_id, comment]
    );
    res.send({ message: 'Comment added' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Comment failed');
  }
});

// Get comments for a post
router.get('/comments/:post_id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT comments.*, users.username, users.profile_pic
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = ?
       ORDER BY comments.created_at ASC`, [req.params.post_id]
    );
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to get comments');
  }
});

// 👥 FOLLOW a user
router.post('/follow', async (req, res) => {
  const { follower_id, following_id } = req.body;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM followers WHERE follower_id = ? AND following_id = ?', [follower_id, following_id]
    );

    if (rows.length > 0) {
      await db.execute('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [follower_id, following_id]);
      return res.send({ following: false });
    } else {
      await db.execute('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)', [follower_id, following_id]);
      return res.send({ following: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Follow operation failed');
  }
});

// Suggested users (not already followed)
router.get('/suggestions/:user_id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, username, profile_pic FROM users
       WHERE id != ?
       AND id NOT IN (
         SELECT following_id FROM followers WHERE follower_id = ?
       )
       LIMIT 5`, [req.params.user_id, req.params.user_id]
    );
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch suggestions');
  }
});

module.exports = router;
