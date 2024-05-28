import authError from "../helpers/authError.js";
import { verifyToken } from "../helpers/jwt.js";
import { findUser } from "../services/authServices.js";

const authenticate = async (req, res, next) => {
  console.log(req.headers);
  const { authorization = null } = req.headers;

  if (!authorization) return next(authError());

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") return next(authError());

  try {
    const { id } = verifyToken(token);
    const user = await findUser({ _id: id });

    if (!user) return next(authError());
    if (!user.token) return next(authError());

    req.user = user;
    next();
  } catch (error) {
    next(authError());
  }
};
export default authenticate;
