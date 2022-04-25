const Joi = require('joi');

module.exports = {
  bookmark: {
    id: Joi.number().integer().required()
  },
  list: {
    page: Joi.number().integer().required(),
    limit: Joi.number().integer().required()
  }
};
