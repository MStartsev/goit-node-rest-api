import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  usersRegister,
  usersLogin,
  updateUserSubscriptionSchema,
} from "../schemas/authSchema.js";
import authController from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(usersRegister),
  authController.register
);

authRouter.post("/login", validateBody(usersLogin), authController.login);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch(
  "/",
  authenticate,
  validateBody(updateUserSubscriptionSchema),
  authController.updateSubscription
);

export default authRouter;
