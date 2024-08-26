const Joi = require("joi");

const validationSignup = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(20).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(10).required(),
    username: Joi.string().min(5).max(15),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });
  return schema.validate(data);
};

module.exports = { validationSignup };
