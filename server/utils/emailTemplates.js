export function getResetPasswordEmailTemplate(resetPasswordUrl) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset – FYP SYSTEM</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">

        <table width="560" cellpadding="0" cellspacing="0" border="0"
               style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center"
                style="background:linear-gradient(135deg,#1a73e8 0%,#0d47a1 100%);padding:32px 40px 28px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">
                FYP SYSTEM &nbsp;🔐&nbsp; Password Reset Request
              </p>
              <p style="margin:8px 0 0;font-size:13px;color:#bbdefb;letter-spacing:0.5px;">
                Secure access to your learning journey
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#1a73e8,#42a5f5,#1a73e8);"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <p style="margin:0 0 16px;font-size:15px;color:#37474f;line-height:1.6;">
                Dear User,
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#546e7a;line-height:1.7;">
                We received a request to reset your password. Please click the button below
                to set up a new one.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px;">
                <tr>
                  <td align="center"
                      style="background:linear-gradient(135deg,#1a73e8,#1565c0);border-radius:8px;">
                    <a href="${resetPasswordUrl}"
                       style="display:inline-block;padding:14px 40px;font-size:15px;font-weight:600;
                              color:#ffffff;text-decoration:none;letter-spacing:0.4px;border-radius:8px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #eceff1;margin:0 0 24px;" />

              <p style="margin:0;font-size:13px;color:#90a4ae;line-height:1.7;">
                If you did not request this, you can safely ignore this email.
                This link will expire in <strong style="color:#546e7a;">15 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:18px 40px;border-top:1px solid #eceff1;text-align:center;">
              <p style="margin:0;font-size:12px;color:#b0bec5;">
                © 2026 FYP System &nbsp;·&nbsp; All rights reserved
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}