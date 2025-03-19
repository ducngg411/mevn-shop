const stripe = require('../config/stripe');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Account = require('../models/Account');

// @desc    Create new payment session
// @route   POST /api/payment/create-checkout-session
// @access  Private

const createCheckoutSession = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Get order

        const order = await Order.findById(orderId)
            .populate('orderItems.product', 'title image price');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure current user is the owner of the order
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to pay this order'
            });
        }

        // Check order status
        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Order status is ${order.status}, cannot proceed to payment`,
            });
        }
        
        // Create line items for Stripe

		const lineItems = order.orderItems.map(item => ({
			price_data: {
				currency: 'vnd',
				product_data: {
					name: item.product.title,
					images: [
						item.product.image && typeof item.product.image === 'string' && item.product.image.startsWith('http') 
							? item.product.image 
							: `${process.env.FRONTEND_URL}${item.product.image}`
					],
				},
				unit_amount: Math.round(item.price),
			},
			quantity: item.quantity,
		}));                                              

        if (order.discountAmount > 0) {
            lineItems.push({
                price_data: {
                    currency: 'vnd',
                    product_data: {
                        name: 'Discount',
                    },
                    unit_amount: -Math.round(order.discountAmount),
                },
                quantity: 1,
            });
        }

        // Create the Stripe checkout session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: lineItems,
			mode: 'payment',
			success_url: `${req.protocol}://${req.get('host')}/api/payments/redirect?orderId=${order._id}&status=success`,
  			cancel_url: `${req.protocol}://${req.get('host')}/api/payments/redirect?orderId=${order._id}&status=cancel`,
			metadata: {
				orderId: order._id.toString(),
			},
		});

		res.json({
			success: true,
			sessionId: session.id,
			url: session.url,
		});
	} catch (error) {
		console.error('Error creating checkout session:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Handle webhook from Stripe
// @route   POST /api/payments/webhook
// @access  Public
const handleWebhook = async (req, res) => {
	const sig = req.headers['stripe-signature'];
	let event;

	try {
		// Ensure req.body is raw data (raw buffer)
		const payload = req.body;
		
		// Verify the webhook signature
		event = stripe.webhooks.constructEvent(
			payload,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET
		);
	} catch (error) {
		console.error('Webhook verification error:', error.message);
		return res.status(400).send(`Webhook Error: ${error.message}`);
	}

	// Process payment events
	try {
		if (event.type === 'checkout.session.completed') {
			const session = event.data.object;
			
			// Update order status
			const orderId = session.metadata.orderId;
			const order = await Order.findById(orderId);
			
			if (order) {
				order.status = 'completed';
				order.paymentStatus = 'completed';
				order.paymentResult = {
					id: session.id,
					status: session.payment_status,
					update_time: new Date().toISOString(),
					email_address: session.customer_details?.email || '',
				};
				await order.save();

				console.log(`Order ${orderId} has been updated to completed.`);
			}
		} else if (event.type === 'payment_intent.succeeded') {
			const paymentIntent = event.data.object;
			console.log(`PaymentIntent ${paymentIntent.id} succeeded.`);
			// Add special handling here if needed
		} else if (event.type === 'payment_intent.payment_failed') {
			const paymentIntent = event.data.object;
			console.log(`PaymentIntent ${paymentIntent.id} failed.`);
			// Add special handling here if needed
		}
	} catch (error) {
		console.error('Error processing webhook event:', error);
	}

	// Respond to let Stripe know that the webhook was received
	res.status(200).send({ received: true });
};

// @desc    Confirm successful payment
// @route   GET /api/payments/confirm/:orderId
// @access  Private
const confirmPayment = async (req, res) => {
	try {
		const { orderId } = req.params;

		// Find the order
		const order = await Order.findById(orderId);

		if (!order) {
			return res.status(404).json({
				success: false,
				message: 'Order not found',
			});
		}

		// Ensure the current user is the one who placed the order
		if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
			return res.status(403).json({
				success: false,
				message: 'You do not have permission to this order',
			});
		}

		// Update the order status to completed
		order.status = 'completed';
		order.paymentStatus = 'completed';
		await order.save();

		// Update product stock
		for (const item of order.orderItems) {
			await Product.findByIdAndUpdate(item.product, {
				$inc: { stock: -item.quantity }
			});
		}

		res.json({
			success: true,
			message: 'Payment successful',
			order,
		});
	} catch (error) {
		console.error('Error confirming payment:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Cancel payment
// @route   GET /api/payments/cancel/:orderId
// @access  Private
const cancelPayment = async (req, res) => {
	try {
		const { orderId } = req.params;

		// Find the order
		const order = await Order.findById(orderId);

		if (!order) {
			return res.status(404).json({
				success: false,
				message: 'Order not found',
			});
		}

		// If the order is completed, it cannot be canceled
		if (order.status === 'completed') {
			return res.status(400).json({
				success: false,
				message: 'Order is completed, cannot be canceled',
			});
		}

		res.json({
			success: true,
			message: 'Payment has been canceled',
			orderId,
		});
	} catch (error) {
		console.error('Error canceling payment:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc    Get publishable key
// @route   GET /api/payments/config
// @access  Public
const getConfig = async (req, res) => {
	res.json({
		success: true,
		publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
	});
};

// Redirect 

const redirectAfterPayment = async (req, res) => {
	const { orderId, status } = req.query;

	const frontendURL = process.env.FRONTEND_URL || 'http://localhost:8080';

	let redirectURL;

	if (status === 'success') {
		redirectURL = `${frontendURL}/payment/success?orderId=${orderId}&payment=success`;

		try {
			const order = await Order.findById(orderId);
			if (order) {
				order.status = 'completed';
				order.paymentStatus = 'completed';
				await order.save();
			}
		} catch (error) {
			console.error('Error updating order status:', error);
		}
	} else {
		redirectURL = `${frontendURL}/payment/cancel?orderId=${orderId}`;
	}

	const html = `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Redirecting...</title>
		<meta http-equiv="refresh" content="0;url=${redirectURL}">
		<style>
		body {
			font-family: Arial, sans-serif;
			text-align: center;
			padding-top: 50px;
		}
		.loader {
			border: 5px solid #f3f3f3;
			border-top: 5px solid #3498db;
			border-radius: 50%;
			width: 50px;
			height: 50px;
			animation: spin 1s linear infinite;
			margin: 20px auto;
		}
		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
		</style>
	</head>
	<body>
		<h2>Đang chuyển hướng về trang chủ...</h2>
		<div class="loader"></div>
		<p>Nếu bạn không được chuyển hướng tự động, <a href="${redirectURL}">nhấn vào đây</a>.</p>
		<script>
		window.location.href = "${redirectURL}";
		</script>
	</body>
	</html>`;

	res.send(html);
};


module.exports = {
	createCheckoutSession,
	handleWebhook,
	confirmPayment,
	cancelPayment,
	getConfig,
	redirectAfterPayment,
};
