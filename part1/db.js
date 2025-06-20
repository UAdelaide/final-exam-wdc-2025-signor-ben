const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',           // or your MySQL host
  user: 'root',                // change this to your MySQL username
  password: '',                // change this to your MySQL password
  database: 'DogWalkService',  // name from dogwalks.sql
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;