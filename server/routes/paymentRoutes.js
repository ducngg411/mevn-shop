const express = require('express');
const router = express.Router();
const {
    createCheckoutSession,
	handleWebhook,
	confirmPayment,
	cancelPayment,
	getConfig,
} = require('../controllers/paymentController');

const { protect } = require('../middleware/authMiddleware');
const { route } = require('./authRoutes');

// Get publishable key
router.get('/config', getConfig);

// Create checkout session

router.post('/create-checkout-session', protect, createCheckoutSession);

// Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Redirect to payment page
router.get('/success', (req, res) => {
	const { orderId} = req.query;
	res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${orderId}`);
});

router.get('/cancel', (req, res) => {
	const { orderId } = req.query;
	res.redirect(`${process.env.FRONTEND_URL}/payment/cancel?orderId=${orderId}`);
});


// Confirm payment success
router.post('/confirm/:orderId', protect, confirmPayment);

// Cancel payment
router.get('/cancel/:orderId', protect, cancelPayment);

module.exports = router;