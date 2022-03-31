const db = require('../util/db');

exports.verifyUserExist = (email, username) =>
  db.query(`SELECT id,email,name,username FROM users WHERE email = ? OR username = ?;`, [email, username]);
