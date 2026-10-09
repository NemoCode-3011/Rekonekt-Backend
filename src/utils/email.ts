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

const createOtpEmail = (otp: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Verify your REKÒ account</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f5f0e6;
        font-family: Arial, Helvetica, sans-serif;
        color: #171914;
      ">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="padding: 40px 16px;"
        >
          <tr>
            <td align="center">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  max-width: 560px;
                  background-color: #ffffff;
                  border-radius: 16px;
                  overflow: hidden;
                "
              >

                <!-- Header -->
                <tr>
                  <td style="
                    background-color: #0b5d3b;
                    padding: 32px;
                    text-align: center;
                  ">
                    <div style="
                      color: #ffffff;
                      font-size: 30px;
                      font-weight: 700;
                      letter-spacing: 2px;
                    ">
                      REKÒ
                    </div>

                    <div style="
                      color: #d8c7a9;
                      font-size: 12px;
                      margin-top: 8px;
                      letter-spacing: 1px;
                    ">
                      DIGITAL MUSEUM OF NIGERIAN HISTORY
                    </div>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 32px;">

                    <h1 style="
                      margin: 0 0 16px;
                      color: #163f32;
                      font-size: 26px;
                      font-weight: 600;
                    ">
                      Verify your email
                    </h1>

                    <p style="
                      margin: 0 0 24px;
                      font-size: 16px;
                      line-height: 1.6;
                    ">
                      Welcome to REKÒ. Use the verification code below
                      to finish creating your account.
                    </p>

                    <!-- OTP -->
                    <div style="
                      background-color: #f5f0e6;
                      border: 1px solid #d8c7a9;
                      border-radius: 12px;
                      padding: 24px;
                      text-align: center;
                      margin: 28px 0;
                    ">
                      <div style="
                        color: #163f32;
                        font-size: 12px;
                        font-weight: 600;
                        letter-spacing: 2px;
                        margin-bottom: 12px;
                      ">
                        VERIFICATION CODE
                      </div>

                      <div style="
                        color: #0b5d3b;
                        font-size: 34px;
                        font-weight: 700;
                        letter-spacing: 8px;
                      ">
                        ${otp}
                      </div>
                    </div>

                    <p style="
                      margin: 0 0 12px;
                      color: #555;
                      font-size: 14px;
                      line-height: 1.6;
                    ">
                      This code expires in <strong>5 minutes</strong>.
                    </p>

                    <p style="
                      margin: 0;
                      color: #777;
                      font-size: 13px;
                      line-height: 1.6;
                    ">
                      If you didn't create a REKÒ account, you can
                      safely ignore this email.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="
                    background-color: #163f32;
                    padding: 28px 32px;
                    text-align: center;
                  ">
                    <div style="
                      color: #ffffff;
                      font-size: 14px;
                      font-weight: 600;
                      letter-spacing: 1px;
                    ">
                      REKÒ
                    </div>

                    <div style="
                      color: #d8c7a9;
                      font-size: 12px;
                      margin-top: 8px;
                    ">
                      Know Your Roots. Own Your Future.
                    </div>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `;
};

export const sendOtpEmail = async (email: string, otp: string) => {
  const mailOption = {
    from: `"REKONEKT" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your REKONEKT account",
    text: `Your REKONEKT verification code is ${otp}. It expires in 5 minutes.`,
    html: createOtpEmail(otp),
  };

  await transport.sendMail(mailOption);
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

export const sendAdminSetupEmail = async (
  name: string,
  email: string,
  setupUrl: string,
) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const mailOption = {
    from: `"REKONEKT" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Set up your REKONEKT admin account",
    text: `Hello ${name}, your REKONEKT admin account is ready. Sign in with ${email} after setting your password using this one-time link: ${setupUrl}. The link expires in 1 hour.`,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #171914; max-width: 560px; margin: 32px auto; padding: 32px; border: 1px solid #d8c7a9; border-radius: 12px;">
        <h1 style="color: #0b5d3b;">Welcome to REKONEKT</h1>
        <p>Hello ${safeName},</p>
        <p>Your administrator account has been created. Set your password using the one-time link below, then sign in with <strong>${safeEmail}</strong>.</p>
        <p><a href="${escapeHtml(setupUrl)}" style="display: inline-block; padding: 12px 20px; background: #0b5d3b; color: #fff; text-decoration: none; border-radius: 6px;">Set your password</a></p>
        <p>This link expires in 1 hour and can only be used once. If you were not expecting this invitation, contact your REKONEKT administrator.</p>
      </div>
    `,
  };

  await transport.sendMail(mailOption);
};
