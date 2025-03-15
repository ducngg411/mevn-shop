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

// Get publishable key
router.get('/config', getConfig);

// Create checkout session

router.post('/create-checkout-session', protect, createCheckoutSession);

// Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Confirm payment success
router.post('/confirm/:orderId', protect, confirmPayment);

// Cancel payment
router.get('/cancel/:orderId', protect, cancelPayment);

module.exports = router;