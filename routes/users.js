const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const db = require('../db');

dotenv.config();
const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const upload = multer({ storage: multer.memoryStorage() });

// ✅ Update user profile (bio + profile_pic)
router.put('/users/:id', upload.single('profile_pic'), async (req, res) => {
  console.log("➡️  PUT /users/:id called");
  const bio = req.body.bio;
  let profilePicUrl = null;

  try {
    if (req.file) {
      const key = `profile_pics/${uuidv4()}_${req.file.originalname}`;
      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      }));
      profilePicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    const updateFields = [];
    const values = [];

    if (bio) {
      updateFields.push('bio = ?');
      values.push(bio);
    }
    if (profilePicUrl) {
      updateFields.push('profile_pic = ?');
      values.push(profilePicUrl);
    }

    if (updateFields.length === 0) {
      return res.status(400).send("Nothing to update");
    }

    values.push(req.params.id);

    await db.execute(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, values);
    res.send({ message: "Profile updated successfully", profile_pic: profilePicUrl });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).send("Update failed");
  }
});

// ✅ Search users by username
router.get('/users/search', async (req, res) => {
  const searchTerm = req.query.username || '';
  try {
    const [rows] = await db.execute(
      'SELECT id, username, profile_pic FROM users WHERE username LIKE ?',
      [`%${searchTerm}%`]
    );
    res.send(rows);
  } catch (err) {
    console.error('Search failed:', err);
    res.status(500).send('Search failed');
  }
});

// ✅ Get single user by ID (for profile, etc.)
router.get('/users/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, username, bio, profile_pic FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).send("User not found");
    res.send(rows[0]);
  } catch (err) {
    console.error('User fetch failed:', err);
    res.status(500).send('User fetch failed');
  }
});

module.exports = router;
