import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  usersRegister,
  usersLogin,
  updateUserSubscriptionSchema,
} from "../schemas/authSchema.js";
import upload from "../middlewares/upload.js";
import authenticate from "../middlewares/authenticate.js";
import authController from "../controllers/authControllers.js";

const {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
} = authController;

const authRouter = express.Router();

authRouter.post("/register", validateBody(usersRegister), register);

authRouter.post("/login", validateBody(usersLogin), login);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);

authRouter.patch(
  "/",
  authenticate,
  validateBody(updateUserSubscriptionSchema),
  updateSubscription
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default authRouter;
