var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

async function insertTestData() {
  try {
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM Users');
    if (rows[0].count === 0) {
        await db.execute(`INSERT IGNORE INTO Users (username, email, password_hash, role)
        VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner')`);
        await db.execute(`INSERT IGNORE INTO Dogs (owner_id, name, size)
        SELECT user_id, 'Max', 'medium' FROM Users WHERE username = 'alice123'`);

        await db.execute(`INSERT IGNORE INTO Dogs (owner_id, name, size)
        SELECT user_id, 'Bella', 'small' FROM Users WHERE username = 'carol123'`);
        await db.execute(`INSERT IGNORE INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
        SELECT d.dog_id, '2025-06-10 08:00:00', 30, 'Parklands', 'open'
        FROM Dogs d WHERE d.name = 'Max'`);

        console.log('Database seeded successfully.');
    } else {
        console.log('Database already has users. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error inserting test data:', err.message);
  }
}

insertTestData();

module.exports = app;
