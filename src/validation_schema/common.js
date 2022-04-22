const Joi = require('joi');

module.exports = {
  list: {
    page: Joi.number().integer().required(),
    limit: Joi.number().integer().required()
  },
  id: {
    id: Joi.number().integer().required()
  }
};
