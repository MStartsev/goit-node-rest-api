import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import authRouter from "./routes/authRouter.js";
import contactsRouter from "./routes/contactsRouter.js";
import logError from "./helpers/logError.js";
import { FILES_STORAGE } from "./constants.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static(FILES_STORAGE));

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
  logError(err);
});

export default app;
