import Joi from "joi";

export const userLoginValidate = Joi.object({
  worker_id: Joi.string().length(5).required(),
  password: Joi.string().min(5).required(),
});
