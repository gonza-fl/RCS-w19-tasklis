import 'dotenv/config';
import nodemailer from "nodemailer";

const {
  EMAIL_USER,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REFRESH_TOKEN
} = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: "OAuth2",
    user: EMAIL_USER,
    clientId: OAUTH_CLIENT_ID,
    clientSecret: OAUTH_CLIENT_SECRET,
    refreshToken: OAUTH_REFRESH_TOKEN,
  }
});

export default transporter;
