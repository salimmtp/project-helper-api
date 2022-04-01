const db = require('../util/db');
const accountModel = require('../model/account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailContent = require('../helper/mailContent');
const mailer = require('../helper/mailer');
const dayjs = require('dayjs');

const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const [userData] = await accountModel.verifyUserExist(email, username);

    if (userData.length) {
      let message = '';
      console.log(userData[0].email, email);
      if (userData[0].username === username) message = 'Username is not available.';
      if (userData[0].email === email) message = 'Already registered with this email.';
      return res.status(400).json({ message });
    }
    req.body.password = await bcrypt.hash(password, 10);
    await accountModel.regiter(req.body);

    res.json({ message: 'registration successful.' });
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [user] = await accountModel.verifyEmail(email);

    if (!user.length) {
      await sleep(2000);
      return res.status(401).json({ message: 'wrong credentials' });
    }
    console.log(password, user[0].password);
    const match = await bcrypt.compare(password, user[0].password);
    console.log({ match });
    if (!match) {
      await sleep(2000);
      return res.status(401).json({ message: 'wrong credential' });
    }
    delete user[0].password;
    let userData = user[0];
    return res.status(200).json({
      message: 'login successfully',
      user_info: userData,
      token: jwt.sign(userData, process.env.JWTSECRET, {
        expiresIn: process.env.JWTEXPIRE
      })
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ message: 'server error' });
  }
};

//  ------------------ FORGOT PASSWORD ---------------------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // check email exist & verified
    const [userData] = await accountModel.verifyEmail(email);
    if (!userData.length) return res.status(404).json({ message: 'user not found' });

    const token = await require('crypto').randomBytes(48).toString('hex');
    await accountModel.updateUserToken(email, userData[0].id, token);

    // sending mail to user
    const html = mailContent(
      `${process.env.WEB_LINK}passwordReset/${token}/${email}`,
      'Password Reset Link',
      'Reset your password by clicking the button below.'
    );
    await mailer(email, 'Password reset link', html);

    res.json({ message: 'password reset link has been sent to your email id.' });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: 'server error' });
  }
};

exports.validateUser = async (req, res) => {
  try {
    const { email, token } = req.params;
    const [isTokenVerified] = await accountModel.verifyToken(email, token);
    if (!isTokenVerified.length) return res.status(403).json({ message: 'unauthorized user', isTokenVerified });
    const expirytime = dayjs(isTokenVerified[0].created_at).add(1, 'day');
    const currentTime = dayjs();
    if (currentTime > expirytime) return res.status(417).json({ message: 'Token expired.' });
    return res.json({ message: 'token verification success' });
  } catch (error) {
    console.log({ error });
    res.status(417).json({ message: 'something went wrong' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;
    const [isTokenVerified] = await accountModel.verifyToken(email, token);
    if (!isTokenVerified.length) {
      await sleep(2000);
      return res.status(403).json({ message: 'Link Expired/Unauthorized user' });
    }
    const expirytime = dayjs(isTokenVerified[0].created_at).add(1, 'day');
    const currentTime = dayjs();
    if (currentTime > expirytime) return res.status(417).json({ message: 'OTP expired.' });
    console.log({ password });
    const hashedPwd = await bcrypt.hash(password, 10);
    console.log({ hashedPwd });
    await accountModel.updatePasswordAndTokenState(email, hashedPwd, isTokenVerified[0].id);

    return res.json({ message: 'Reset password has completed.' });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: 'server error' });
  }
};

//  ------------------ FORGOT PASSWORD ENDS ---------------------------
