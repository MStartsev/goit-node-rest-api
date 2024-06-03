import nodemailer from "nodemailer";
import "dotenv/config";
import logError from "../helpers/logError.js";

const {
  PORT = 3000,
  HOST = "localhost",
  SENDER_EMAIL,
  SENDER_PASSWORD,
} = process.env;

const transport = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
});

export const createEmailTemplate = ({ email, verificationToken }) => {
  const link = `http://${HOST}:${PORT}/users/verify/${verificationToken}`;

  return {
    to: email,
    subject: "Email confirm",
    html: `<h1>Email confirm</h1><p>To confirm your email address ${email}, please click <a href=${link}>[LINK]</a>.</p>`,
  };
};

export const sendEmail = async (emailData) => {
  const { response } = await transport.sendMail({
    from: SENDER_EMAIL,
    ...emailData,
  });
  console.log("Email send status: ", response);
  if (response.includes("OK")) {
    return true;
  } else {
    return false;
  }
};
