import Joi from "joi";

const createContactSchema = Joi.object({
  name: Joi.string()
    .trim()
    .regex(/^[\p{L} ']+$/u)
    .min(2)
    .max(50)
    .required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string()
    .trim()
    .regex(/^\+?(?:\d{1,3}|\(\d{1,3}\))?\s?\d{3,12}-?\d{3,12}$/)
    .required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string()
    .trim()
    .regex(/^[\p{L} ']+$/u)
    .min(2)
    .max(50),
  email: Joi.string().trim().email(),
  phone: Joi.string()
    .trim()
    .regex(/^\+?(?:\d{1,3}|\(\d{1,3}\))?\s?\d{3,12}-?\d{3,12}$/),
});

export { createContactSchema, updateContactSchema };
