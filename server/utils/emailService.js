const { sendEmail } = require('./emailConfig');
const welcomeTemplate = require('../templates/welcome');
const orderConfirmationTemplate = require('../templates/orderConfirmation');
const resetPasswordTemplate = require('../templates/resetPassword');
const supportRequestTemplate = require('../templates/supportRequest');

const sendWelcomeEmail = async (user) => {
    const subject = 'Welcome to LicenseZone - Premium Store!';
    const html = welcomeTemplate(user);
    return await sendEmail(user.email, subject, html);
};

const sendOrderConfirmationEmail = async (order, user) => {
    const subject = `Order Confirmation #${order._id}`;
    const html = orderConfirmationTemplate(order, user);
    return await sendEmail(user.email, subject, html);
};

const sendPasswordResetEmail = async (user, resetToken) => {
    const subject = 'Password Reset Request';
    const html = resetPasswordTemplate(user, resetToken);
    return await sendEmail(user.email, subject, html);
};

const sendSupportEmail = async (formData) => {
    const subject = `Support Request: ${formData.subject}`;
    const html = supportRequestTemplate(formData);
    // Send to your admin/support email address
    return await sendEmail(process.env.SUPPORT_EMAIL || process.env.EMAIL_FROM, subject, html);
};

module.exports = {
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendPasswordResetEmail,
    sendSupportEmail
};