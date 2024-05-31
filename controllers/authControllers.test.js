import mongoose from "mongoose";
import request from "supertest";

import app from "../app.js";
import { findUser, deleteAllUsers } from "../services/authServices.js";

const { DB_HOST_TEST, PORT, USER_EMAIL, USER_PASSWORD } = process.env;
const userSign = {
  email: USER_EMAIL,
  password: USER_PASSWORD,
};

describe("test /api/users/login", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(PORT);

    await request(app).post("/api/users/register").send(userSign);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await deleteAllUsers();
  });

  test("test login with correct data", async () => {
    const { status, body } = await request(app)
      .post("/api/users/login")
      .send(userSign);

    expect(status).toBe(200);
    expect(typeof body.token).toBe("string");
    expect(body.user.email).toBe(userSign.email);
    expect(typeof body.user.subscription).toBe("string");
    expect(typeof body.user.avatarURL).toBe("string");

    const user = await findUser({ token: body.token });
    expect(user).not.toBeNull();
    expect(user.email).toBe(body.user.email);
    expect(user.subscription).toBe(body.user.subscription);
    expect(user.avatarURL).toBe(body.user.avatarURL);
  });
});
