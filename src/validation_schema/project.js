const Joi = require('joi');

module.exports = {
  add: {
    topic: Joi.string().required().max(299),
    department: Joi.array().items(Joi.number().integer()).min(1).required(),
    description: Joi.string().required(),
    level: Joi.number().integer().valid(1, 2, 3).required(),
    skills: Joi.string()
  }
};
