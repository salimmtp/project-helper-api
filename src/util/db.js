const mysql = require('mysql2');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
  dateStrings: true
});

module.exports = pool.promise();
