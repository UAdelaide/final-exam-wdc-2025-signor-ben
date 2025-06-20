const express = require('express');
const path = require('path');
// bring in express-session to handle user sessions
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// use session middleware before your routes so req.session is available
app.use(session({
  secret: 'superdogsecret', // secret for signing session cookies (use env var later)
  resave: false,            // don't save session if nothing changed
  saveUninitialized: true   // save new sessions even if empty
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);



// Export the app instead of listening here
module.exports = app;