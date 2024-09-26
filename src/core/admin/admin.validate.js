import Joi from "joi";
export const registerValidate = Joi.object({
  name: Joi.string().required(),
  special_name: Joi.string().required(),
  password: Joi.string().min(8).required(),
  maxfiy_password: Joi.string().min(8).required(),
});
export const loginValidate = Joi.object({
  special_name: Joi.string().required(),
  password: Joi.string().min(8).required(),
});
