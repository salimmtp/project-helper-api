const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token) {
    const options = {
      expiresIn: process.env.JWTEXPIRE
    };
    jwt.verify(token, process.env.JWTSECRET, options, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: 'Auth token is not supplied'
    });
  }
};
