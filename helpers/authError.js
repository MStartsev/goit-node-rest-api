import HttpError from "../helpers/HttpError.js";

const authError = () => HttpError(401, "Not authorized");

export default authError;
