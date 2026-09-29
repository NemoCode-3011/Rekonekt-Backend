import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  const mailOption = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Your verification code",
    text: `Your verification code is ${otp}. Expires in 5 minutes`,
  };
  await transport.sendMail(mailOption);
};
