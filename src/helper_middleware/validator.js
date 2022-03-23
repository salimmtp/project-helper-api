// Server side validation - Joi validation middleware
const Joi = require('joi');

module.exports = (schema, value = 'body') => {
  return (req, res, next) => {
    const { error } = Joi.object(schema).validate(req[value]);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      res.status(422).json({
        message: details[0]['message']
      });
    }
  };
};
