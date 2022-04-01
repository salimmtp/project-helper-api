const db = require('../util/db');

// registration
exports.verifyUserExist = (email, username) =>
  db.query(`SELECT id,email,name,username FROM users WHERE email = ? OR username = ?;`, [email, username]);

//   add
exports.regiter = data => db.query(`INSERT INTO users SET ?;`, [data]);

// verify for login, with email
exports.verifyEmail = email =>
  db.query(`SELECT id,name,email,username,password,level,department FROM users WHERE email=?;`, [email]);

// forgot password token generation
exports.updateUserToken = async (email, userId, token) => {
  try {
    console.log(email, userId, token);
    const [data] = await db.query(`SELECT id FROM user_tokens WHERE email=? and user_id=?`, [email, userId, token]);
    if (data.length) {
      let tokenData = { token, is_used: 0, created_at: new Date() };
      await db.query(`UPDATE user_tokens SET ? WHERE id =?`, [tokenData, data[0].id]);
    } else {
      let tokenData = {
        email,
        token,
        user_id: userId
      };
      await db.query(`INSERT INTO user_tokens SET ?`, [tokenData]);
    }
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};

// verify token for password update
exports.verifyToken = (email, token) => {
  // return db.query(`SELECT * FROM user_tokens WHERE email= ? AND token = ? AND is_used = 0 `, [email, token]);
  return db.query(`SELECT * FROM user_tokens WHERE email= ? AND token = ?`, [email, token]);
};

// forgot password - updating password and state of token
exports.updatePasswordAndTokenState = async (email, password, tokenId) => {
  try {
    const conn = await db.getConnection();
    await conn.query('START TRANSACTION');

    const pwdData = {
      password
    };
    await conn.query(`UPDATE users SET ? WHERE email = ?;`, [pwdData, email]);

    const tokenData = {
      is_used: 1
    };
    await conn.query(`UPDATE user_tokens SET ? WHERE id = ?`, [tokenData, tokenId]);

    await conn.commit();
    await conn.release();
    return Promise.resolve(true);
  } catch (e) {
    await conn.query('ROLLBACK');
    await conn.release();
    return Promise.reject(e);
  }
};
