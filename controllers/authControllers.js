import { findUser, createUser, updateUser } from "../services/authServices.js";
import { controllerWrapper } from "../decorators/controllerWrapper.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import { createToken } from "../helpers/jwt.js";

const register = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await createUser(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const compareResult = await bcrypt.compare(password, user.password);
  if (!compareResult) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = {
    id,
  };
  console.log("qwe: ", id, payload);
  const token = createToken(payload);
  console.log("qwerty: ", id, payload, token);
  await updateUser({ _id: id }, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await updateUser({ _id }, { token: "" });

  res.status(204).json();
};

const updateSubscription = async (req, res) => {
  const { _id: id } = req.user;
  const { subscription } = req.body;

  const updatedUser = await updateUser({ _id: id }, { subscription });

  if (!updatedUser) {
    throw HttpError(404, "User not found");
  }

  res.status(200).json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

export default {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  getCurrent: controllerWrapper(getCurrent),
  logout: controllerWrapper(logout),
  updateSubscription: controllerWrapper(updateSubscription),
};
