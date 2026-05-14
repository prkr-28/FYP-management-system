export function getResetPasswordEmailTemplate(resetPasswordUrl) {
    return `
        <h1>FYP SYSYTEM - Password Reset Request</h1>
        <p>You have requested to reset your password. Please click the link below to reset it:</p>
        <a href="${resetPasswordUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
    `;
}