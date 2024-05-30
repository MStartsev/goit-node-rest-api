import User from "../models/User.js";
import bcrypt from "bcrypt";

export const findUser = async (filter) => await User.findOne(filter);

export const createUser = async (body) => {
  const hashResult = await bcrypt.hash(body.password, 10);
  return User.create({ ...body, password: hashResult });
};

export const updateUser = async (filter, body) =>
  await User.findOneAndUpdate(filter, body, { new: true });

//Only for tests
export const deleteAllUsers = () => User.deleteMany();
