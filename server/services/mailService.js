import nodeMailer from 'nodemailer';

export async function sendEmail(to, subject, message) {
    try {
        const transporter = nodeMailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            service: process.env.EMAIL_SERVICE
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: message
        };
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        throw new Error(`Failed to send email: ${error.message}`);
    }
}