const schedule = require('node-schedule');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Account = require('../models/Account');

// Schedule a task to check for expired orders every minute
const initOrderScheduler = () => {
	console.log('Initializing order expiration checker...');

	// Run every minute
	schedule.scheduleJob('*/1 * * * *', async () => {
		try {
			console.log('Checking for expired orders...');

			// Find pending orders older than 15 minutes
			const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

			const expiredOrders = await Order.find({
				status: 'pending',
				createdAt: { $lt: fifteenMinutesAgo }
			});

			console.log(`Found ${expiredOrders.length} orders to cancel.`);

			// Process each expired order
			for (const order of expiredOrders) {
				// Update order status to cancelled
				order.status = 'cancelled';
				order.paymentStatus = 'cancelled';
				await order.save();

				console.log(`Cancelled order ID: ${order._id}`);

				// Update accounts to 'available' status
				for (const item of order.orderItems) {
					for (const accountId of item.accounts) {
						await Account.findByIdAndUpdate(accountId, {
							status: 'available',
							order: null
						});
						console.log(`Account ${accountId} has been returned to the store.`);
					}

					// Update the stock of the product
					await Product.findByIdAndUpdate(item.product, {
						$inc: { stock: item.quantity }
					});

					console.log(`Updated stock for product ID: ${item.product}`);
				}
			}
		} catch (error) {
			console.error('Error processing expired orders:', error);
		}
	});
};

module.exports = initOrderScheduler;
