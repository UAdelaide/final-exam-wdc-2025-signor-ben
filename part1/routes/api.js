const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/dogs
router.get('/dogs', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.dog_id, d.name, d.size, u.username AS owner
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs', details: err.message });
  }
});

// GET /api/walkrequests/open
router.get('/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT wr.request_id, d.name AS dog, wr.requested_time, wr.duration_minutes, wr.location
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      WHERE wr.status = 'open'
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch open walk requests', details: err.message });
  }
});

// GET /api/walkers/summary
router.get('/walkers/summary', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.username AS walker, COUNT(wr.request_id) AS completed_walks
      FROM WalkRatings r
      JOIN Users u ON r.walker_id = u.user_id
      JOIN WalkRequests wr ON r.request_id = wr.request_id
      WHERE wr.status = 'completed'
      GROUP BY u.username
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch walker summary', details: err.message });
  }
});

module.exports = router;