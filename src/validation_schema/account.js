const Joi = require('joi');

module.exports = {
  bookmark: {
    id: Joi.number().integer().required()
  },
  list: {
    page: Joi.number().integer().required(),
    limit: Joi.number().integer().required()
  },
  accountUpdate: {
    name: Joi.string().max(100).required(),
    bio: Joi.string().max(3000).required(),
    department: Joi.array().items(Joi.number().integer()).min(1).required()
  },
  updatePassword: {
    password: Joi.string().min(6).max(30).required()
  }
};
