import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from './emailtemplates.js';
import { transporter } from './nodemailer.config.js';

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const info = await transporter.sendMail({
            from: '"ChatterBox" <stonesjohn278@gmail.com>', 
            to: email,
            subject: "Verify your email", 
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken) 
        });

        console.log('Verification email sent successfully.', info.response);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error(`Error sending Verification Email: ${error.message}`);
    }
};

export const sendWelcomeEmail = async (email, firstName, lastName) => {
    try {
        const info = await transporter.sendMail({
            from: '"ChatterBox" <stonesjohn278@gmail.com>', 
            to: email, 
            subject: "Welcome to ChatterBox", 
            html: `<p>Welcome ${firstName} ${lastName} to ChatterBox!</p>` 
        });

        console.log('Welcome email sent successfully.', info.response);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error(`Error sending Welcome Email: ${error.message}`);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const info = await transporter.sendMail({
            from: '"ChatterBox" <stonesjohn278@gmail.com>',
            to: email,
            subject: "Reset your password", 
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL) 
        });

        console.log('Password reset email sent successfully.', info.response);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error(`Error sending Password Reset Email: ${error.message}`);
    }
};

export const sendResetSuccessEmail = async (email) => {
    try {
        const info = await transporter.sendMail({
            from: '"ChatterBox" <stonesjohn278@gmail.com>', 
            to: email, 
            subject: "Password Reset Successful", 
            html: PASSWORD_RESET_SUCCESS_TEMPLATE 
        });

        console.log('Password reset success email sent successfully.', info.response);
    } catch (error) {
        console.error('Error sending password reset success email:', error);
        throw new Error(`Error sending Password Reset Success Email: ${error.message}`);
    }
};
