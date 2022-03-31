const db = require('../util/db');
const accountModel = require('../model/account');

exports.register = async (req, res) => {
  try {
    console.log('body', req.body);
    const { email, username } = req.body;
    const [userData] = await accountModel.verifyUserExist(email, username);
    if (userData.length) {
      let message = '';
      console.log(userData[0].email, email);
      if (userData[0].username === username) message = 'Username is not available.';
      if (userData[0].email === email) message = 'Already registered with this email.';
      return res.status(400).json({ message });
    }
    res.json({ message: 'registration successful.', token: 'Jswndksad' });
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
};
