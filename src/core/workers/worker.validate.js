import Joi from "joi";

export const workerAddValidate = Joi.object({
  name: Joi.string().min(3).max(50).trim().required().messages({
    "string.empty": "Ism maydoni bo'sh bo'lmasligi kerak.",
    "string.min": "Ism kamida 3 ta belgidan iborat bo'lishi kerak.",
    "string.max": "Ism eng ko'pi bilan 50 ta belgidan oshmasligi kerak.",
  }),

  phone_number: Joi.string()
    .pattern(/^[0-9]{9,12}$/)
    .required()
    .messages({
      "string.empty": "Telefon raqami kiritilishi shart.",
      "string.pattern.base":
        "Telefon raqami 9 dan 12 gacha bo'lgan raqamlar bo'lishi kerak.",
    }),

  role: Joi.string().valid("admin", "worker", "manager").required().messages({
    "any.only": "Rol faqat 'admin', 'worker', yoki 'manager' bo'lishi kerak.",
    "any.required": "Rol tanlanishi kerak.",
  }),
});

export const workerUpdateValidate = Joi.object({
  worker_id: Joi.string().required(),
  new_password: Joi.string().length(5).required(),
});
