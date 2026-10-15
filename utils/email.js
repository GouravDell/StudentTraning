const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    console.log("option:", option);

    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 587,  // Use 587 for TLS, 465 for SSL
        secure: false,  // For TLS, set to false
        auth: {
            user: process.env.Email_user,
            pass: process.env.Email_password
        }
    });

    const emailOptions = {
        from: "Ciniflix support <support@gmail.com>",
        to: option.email,
        subject: option.subject,
        text: option.message
    };

    try {
        await transporter.sendMail(emailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;
