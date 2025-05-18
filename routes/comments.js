const express = require('express');
const db = require('../db');
const router = express.Router();

// ✅ GET /comments/:post_id → All comments for a post
router.get('/comments/:post_id', async (req, res) => {
  const post_id = req.params.post_id;

  try {
    const [rows] = await db.query(
      `SELECT c.*, u.username, u.profile_pic 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.post_id = ?
       ORDER BY c.created_at DESC`,
      [post_id]
    );
    res.send(rows);
  } catch (err) {
    console.error('❌ Error loading comments:', err);
    res.status(500).send('Failed to fetch comments');
  }
});

// ✅ POST /comments → Add a comment
router.post('/comments', async (req, res) => {
  const { user_id, post_id, comment } = req.body;

  if (!user_id || !post_id || !comment) {
    return res.status(400).send('Missing fields');
  }

  try {
    await db.query(
      'INSERT INTO comments (user_id, post_id, comment) VALUES (?, ?, ?)',
      [user_id, post_id, comment]
    );
    res.send({ message: 'Comment added' });
  } catch (err) {
    console.error('❌ Error posting comment:', err);
    res.status(500).send('Failed to post comment');
  }
});

module.exports = router;
