import Joi from "joi";

export const usersRegister = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
});

export const usersLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});
