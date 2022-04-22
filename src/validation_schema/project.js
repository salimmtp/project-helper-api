const Joi = require('joi');

module.exports = {
  add: {
    topic: Joi.string().required().max(299),
    department: Joi.array().items(Joi.number().integer()).min(1).required(),
    description: Joi.string().required(),
    level: Joi.number().integer().valid(1, 2, 3).required(),
    skills: Joi.string()
  },
  update: {
    id: Joi.number().integer().required(),
    topic: Joi.string().required().max(299),
    department: Joi.array().items(Joi.number().integer()).min(1).required(),
    description: Joi.string().required(),
    level: Joi.number().integer().valid(1, 2, 3).required(),
    skills: Joi.string()
  },
  bookmark: {
    id: Joi.number().integer().required()
  },
  list: {
    page: Joi.number().integer().required(),
    limit: Joi.number().integer().required(),
    search: Joi.string().optional(),
    level: Joi.number().integer().valid(1, 2, 3).optional(),
    userId: Joi.number().integer().optional(),
    department: Joi.number().integer().optional()
  },
  search: {
    search: Joi.string().optional()
  }
};
