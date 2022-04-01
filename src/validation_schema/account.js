const Joi = require('joi');

module.exports = {
  register: {
    name: Joi.string().max(100).required(),
    email: Joi.string().email().max(128).required(),
    username: Joi.string().max(60).required(),
    level: Joi.number().integer().required(),
    department: Joi.number().integer().required(),
    password: Joi.string().min(6).max(30).required()
  },
  login: {
    email: Joi.string().email().max(128).required(),
    password: Joi.string().min(6).max(30).required()
  },
  forgotPwd: {
    email: Joi.string().email().max(128).required()
  },
  validateUser: {
    token: Joi.string().min(48),
    email: Joi.string().email().max(128).required()
  },
  verifyUser: {
    token: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required()
  }
};
