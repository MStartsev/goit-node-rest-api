import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { findUser, createUser, updateUser } from "../services/authServices.js";
import { controllerWrapper } from "../decorators/controllerWrapper.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import logError from "../helpers/logError.js";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";
import { FILES_STORAGE } from "../constants.js";

const register = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email, { protocol: "https" });
  const newUser = await createUser({ ...req.body, avatarURL });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
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

  const token = createToken(payload);

  await updateUser({ _id: id }, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
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

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const avatarsPath = path.resolve(FILES_STORAGE, "avatars");

  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  const { path: tempPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);

  try {
    const image = await Jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(tempPath);
    await fs.rename(tempPath, newPath);

    const avatarURL = path.join("avatars", filename).replace(/\\/g, "/");
    const updatedUser = await updateUser({ _id }, { avatarURL });

    if (!updatedUser) {
      throw HttpError(401, "Not authorized");
    }

    res.status(200).json({
      avatarURL: updatedUser.avatarURL,
    });
  } catch (error) {
    await fs.unlink(tempPath).catch((unlinkError) => {
      logError("Failed to remove temporary file:", unlinkError);
    });
    next(error);
  }
};

export default {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  getCurrent: controllerWrapper(getCurrent),
  logout: controllerWrapper(logout),
  updateSubscription: controllerWrapper(updateSubscription),
  updateAvatar: controllerWrapper(updateAvatar),
};
