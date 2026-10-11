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
    from: `"REKÒ" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your REKÒ account",
    text: `Your REKÒ verification code is ${otp}. It expires in 5 minutes.`,
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
    from: `" REKÒ" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Set up your REKÒ admin account",
    text: `Hello ${name}, your  REKÒ admin account is ready. Sign in with ${email} after setting your password using this one-time link: ${setupUrl}. The link expires in 1 hour.`,
    html: `
    <div style="margin:0;padding:32px 16px;background-color:#F5F0E6;font-family:'Instrument Sans',Arial,Helvetica,sans-serif;color:#171914;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="padding:28px 32px;background-color:#0B5D3B;border-radius:8px 8px 0 0;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.1;letter-spacing:1px;color:#F5F0E6;">
        REKÒ
      </div>
      <div style="margin-top:10px;font-size:10px;letter-spacing:2px;color:#F5F0E6;">
        KNOW YOUR ROOTS. OWN YOUR FUTURE.
      </div>
    </div>

    <div style="padding:36px 32px;background-color:#FFFFFF;border:1px solid #D8C7A9;border-top:0;">
      <p style="margin:0 0 16px;font-size:11px;font-weight:bold;letter-spacing:2px;color:#A66A3F;">
        ADMINISTRATOR INVITATION
      </p>

      <h1 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.2;font-weight:normal;color:#171914;">
        Welcome to REKÒ.
      </h1>

      <p style="margin:0 0 16px;font-size:15px;line-height:1.8;">
        Hello ${safeName},
      </p>

      <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#3E4039;">
        Your administrator account is ready. Set your password to activate your access to the REKÒ administration workspace.
      </p>

      <p style="margin:0 0 8px;font-size:12px;color:#66685F;">
        YOUR SIGN-IN EMAIL
      </p>

      <div style="padding:14px 16px;margin-bottom:28px;background-color:#F5F0E6;border:1px solid #D8C7A9;border-radius:4px;font-size:14px;overflow-wrap:anywhere;">
        <strong>${safeEmail}</strong>
      </div>

      <div style="margin:0 0 24px;">
        <a href="${escapeHtml(setupUrl)}" style="display:inline-block;padding:15px 24px;background-color:#0B5D3B;border-radius:4px;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:bold;">
          Set your password &rarr;
        </a>
      </div>

      <p style="margin:0;font-size:13px;line-height:1.8;color:#62645C;">
        This invitation expires in one hour and can only be used once. If you weren't expecting it, contact your REKÒ administrator.
      </p>

      <div style="height:1px;margin:32px 0 20px;background-color:#D8C7A9;"></div>

      <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.6;color:#163F32;">
        Exploring Nigeria's history, culture, and the stories shaping its present.
      </p>
    </div>
    <div style="padding:18px 12px;text-align:center;font-size:11px;line-height:1.7;color:#62645C;">
      REKÒ &middot; Know Your Roots. Own Your Future.
    </div>
  </div>
</div>
    `,
  };

  await transport.sendMail(mailOption);
};
