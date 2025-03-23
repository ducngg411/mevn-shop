const { sendSupportEmail } = require('../utils/emailService');

// @desc    Send a support/contact email
// @route   POST /api/support/contact
// @access  Public
const sendContactForm = async (req, res) => {
    try {
        const { name, email, subject, message, orderNumber } = req.body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Send email
        const emailResult = await sendSupportEmail({
            name,
            email,
            subject,
            message,
            orderNumber: orderNumber || 'N/A'
        });

        if (emailResult.success) {
            res.json({
                success: true,
                message: 'Your message has been sent successfully. We will get back to you soon.'
            });
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        console.error('Error sending support email:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to send your message. Please try again later.'
        });
    }
};

module.exports = {
    sendContactForm
};