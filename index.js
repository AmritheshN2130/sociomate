const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const socialRoutes = require('./routes/social');
const likesRoutes = require('./routes/likes'); // ✅ Here
const commentsRoutes = require('./routes/comments');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Define test route (optional)
app.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS time");
    res.send({ db_time: rows[0].time });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).send("Database connection failed");
  }
});

// ✅ Mount routes BEFORE listening
app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes);
app.use('/api', postRoutes);
app.use('/api', userRoutes);
app.use('/api', socialRoutes);
app.use('/api', likesRoutes);
app.use('/api', commentsRoutes);

// ✅ NOW start listening (last)
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
