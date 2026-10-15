const Joi = require('joi');

module.exports = {
  signupSchema: Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
      .required()
      .messages({
        'string.pattern.base': 'Password must have at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.empty': 'Password cannot be empty.',
        'any.required': 'Password is required.',
      }),
    role: Joi.string().required()
  }),
  
  loginSchema: Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
      .required()
      .messages({
        'string.pattern.base': 'Password must have at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.empty': 'Password cannot be empty.',
        'any.required': 'Password is required.',
      }),
  })
}
